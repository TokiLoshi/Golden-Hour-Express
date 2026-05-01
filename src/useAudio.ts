import { useRef, useCallback } from "react";

interface AudioData {
	bass: number;
	mid: number;
	treble: number;
}

export function useAudio() {
	const audioRef = useRef<AudioData>({
		bass: 0,
		mid: 0,
		treble: 0,
	});

	const analyserRef = useRef<AnalyserNode | null>(null);
	const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
	const ctxRef = useRef<AudioContext | null>(null);
	const dataArrayRef = useRef<Uint8Array | null>(null);

	const connectElement = useCallback((audioElement: HTMLAudioElement) => {
		if (sourceRef.current) return;

		const ctx = new AudioContext();
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 256; // 128 frequency bins (fftSize / 2)
		analyser.smoothingTimeConstant = 0.8; // 0=jumpy, 1=laggy, looking for peace in middle

		const source = ctx.createMediaElementSource(audioElement);
		source.connect(analyser);
		analyser.connect(ctx.destination);

		ctxRef.current = ctx;

		analyserRef.current = analyser;
		sourceRef.current = source;
		dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
	}, []);

	const update = useCallback(() => {
		const analyser = analyserRef.current;
		const data = dataArrayRef.current;
		if (!analyser || !data) return;

		analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>);
		// Frequency bin ranges (for fftSize=256, 128 bins total):
		// Bin 0-9 => 0.33 Hz => bass
		// Bin 10 - 79 => 344 - 22756 Hz => mids
		// Bin 80 - 127 => 2756+ Hz => trebble

		const avg = (start: number, end: number) => {
			let sum = 0;
			for (let i = start; i < end; i++) sum += data[i];
			const defaultVolume = 0.6;
			return (sum / ((end - start) * 255)) * defaultVolume; // normalize
		};

		const rawBass = avg(0, 10);
		const rawMid = avg(10, 80);
		const rawTreble = avg(80, 128);

		const smooth = (
			current: number,
			target: number,
			attack: number,
			release: number,
		) => {
			const rate = target > current ? attack : release;
			return current + (target - current) * rate;
		};

		audioRef.current.bass = smooth(audioRef.current.bass, rawBass, 0.12, 0.04);
		audioRef.current.mid = smooth(audioRef.current.mid, rawMid, 0.18, 0.08);
		audioRef.current.treble = smooth(
			audioRef.current.treble,
			rawTreble,
			0.3,
			0.15,
		);
	}, []);

	return { audioRef, connectElement, update };
}
