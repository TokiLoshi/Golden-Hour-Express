import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import Experience from "./Experience";
import { OrbitControls } from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import { useRef } from "react";
import { useAudio } from "./useAudio";

export default function App() {
	const { bgColor } = useControls(
		"SceneControls",
		{
			bgColor: "#0a0612",
		},
		{ collapsed: true },
	);

	const audioRef = useRef < HTMLAudioElement > null;
	const { audioData, connect, update } = useAudio();

	return (
		<>
			<Leva collapsed />
			<audio
				ref={audioRef}
				src='/songs/waterfall.mp3'
				onPlay={() => connect(audioRef.current)}
				controls
				style={{ position: "fixed", bottom: 20, left: 20, zIndex: 100 }}
			/>
			<Canvas
				gl={{
					toneMapping: ACESFilmicToneMapping,
				}}
				flat
				// camera={{ position: [5, 3, 3], fov: 75 }}
				camera={{ position: [0, 0, 6], fov: 75 }}
				shadows>
				<ambientLight intensity={0.1} />
				<color attach='background' args={[bgColor]} />
				<OrbitControls
				// enableZoom={false}
				// enablePan={false}
				/>
				<directionalLight color='red' position={[0, 0, 5]} />
				<Experience audioData={audioData} update={update} />
			</Canvas>
		</>
	);
}
