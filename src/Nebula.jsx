import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useMemo, useRef } from "react";
import vertexShader from "../src/shaders/nebula/vertex.glsl";
import fragmentShader from "../src/shaders/nebula/fragment.glsl";
import * as THREE from "three";

export default function Nebula({ audioData, update }) {
	const pointsRef = useRef(null);
	const materialRef = useRef(null);

	const {
		count,
		spread,
		pointSize,
		speed,
		// Shape
		swirl,
		drift,
		trebleShake,
		// Colors:
		warmInner,
		warmOuter,
		coolInner,
		coolOuter,
		// Look
		softness,
		shimmerAmount,
		warmthFalloff,
	} = useControls(
		"Nebula",
		{
			count: { value: 8000, min: 1000, max: 30000, step: 100 },
			spread: { value: 12, min: 4, max: 30, step: 0.5 },
			pointSize: { value: 2.5, min: 0.5, max: 8, step: 0.1 },
			speed: { value: 0.12, min: 0.01, max: 1.0, step: 0.01 },
			// Shape
			swirl: { value: 0.15, min: 0.0, max: 1.0, step: 0.01, label: "Swirl" },
			drift: { value: 0.12, min: 0.0, max: 1.0, step: 0.01, label: "Drift" },
			trebleShake: {
				value: 0.3,
				min: 0.0,
				max: 2.0,
				step: 0.01,
				label: "Treble",
			},
			// Colors
			warmInner: { value: "#f29e2e", label: "Warm Inner" },
			warmOuter: { value: "#d94090", label: "Warm Outer" },
			coolInner: { value: "#38198c", label: "Cool Inner" },
			coolOuter: { value: "#1447b8", label: "Cool Outer" },
			// Look
			softness: { value: 2.0, max: 6.0, min: 0.5, label: "softness" },
			shimmerAmount: {
				value: 0.08,
				min: 0.0,
				max: 0.4,
				step: 0.01,
				label: "shimmerAmount",
			},
			warmthFalloff: {
				value: 0.7,
				min: 0.1,
				max: 2.0,
				step: 0.05,
				label: "warmthFalloff",
			},
		},
		{ collapsed: true },
	);

	const { positions, randoms } = useMemo(() => {
		const positions = new Float32Array(count * 3);
		const randoms = new Float32Array(count);

		for (let i = 0; i < count; i++) {
			const i3 = i * 3;
			const radius = Math.pow(Math.random(), 0.5) * spread;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);

			positions[i3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
			positions[i3 + 1] = radius * Math.sin(phi) + Math.sin(theta);
			positions[i3 + 2] = radius * Math.cos(phi);

			randoms[i] = Math.random();
		}
		return { positions, randoms };
	}, [count, spread]);

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uPointSize: { value: pointSize },
			uSpeed: { value: speed },
			// Audio
			uBass: { value: 0.0 },
			uMid: { value: 0.0 },
			uTreble: { value: 0.0 },
		}),
		[],
	);

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();
		// refresh audio data

		update();
		materialRef.current.uniforms.uTime.value = t;
		materialRef.current.uniforms.uPointSize.value = pointSize;
		materialRef.current.uniforms.uSpeed.value = speed;

		materialRef.current.uniforms.uBass.value = audioData.current.bass;
		materialRef.current.uniforms.uMid.value = audioData.current.mid;
		materialRef.current.uniforms.uTreble.value = audioData.current.treble;

		pointsRef.current.rotation.y = t * 0.018;
		pointsRef.current.rotation.x = Math.sin(t * 0.005) * 0.15;
	});

	return (
		<points ref={pointsRef}>
			<bufferGeometry>
				<bufferAttribute attach='attributes-position' args={[positions, 3]} />
				<bufferAttribute attach='attributes-aRandom' args={[randoms, 1]} />
			</bufferGeometry>

			<shaderMaterial
				ref={materialRef}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
				transparent
				depthWrite={false}
				blending={THREE.AdditiveBlending}
			/>
		</points>
	);
}
