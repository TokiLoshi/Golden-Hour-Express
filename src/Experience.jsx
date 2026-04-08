import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import vertexShader from "../src/shaders/vertex.glsl";
import fragmentShader from "../src/shaders/fragment.glsl";
import * as THREE from "three";
import { useControls } from "leva";

function Nebula() {
	const pointsRef = useRef(null);
	const materialRef = useRef(null);

	const { count, spread, pointSize, speed } = useControls(
		"Nebula",
		{
			count: { value: 8000, min: 1000, max: 30000, step: 100 },
			spread: { value: 12, min: 4, max: 30, step: 0.5 },
			pointSize: { value: 2.5, min: 0.5, max: 8, step: 0.1 },
			speed: { value: 0.12, min: 0.01, max: 1.0, step: 0.01 },
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
			return { positions, randoms };
		}
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
		materialRef.current.uniforms.uTime.value = t;
		materialRef.current.uniforms.uPointSize.value = pointSize;
		materialRef.current.uniforms.uSpeed = speed;

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

function PlaceholderTrain() {
	const trainRef = useRef();

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();

		trainRef.current.rotation.z =
			Math.sin(t * 1.8) * 0.018 + Math.sin(t * 3.1) * 0.008;
		trainRef.current.rotation.x = Math.sin(t * 0.9) * 0.012;
		trainRef.current.rotation.y =
			Math.sin(t * 1.2) * 0.05 + Math.sin(t * 2.7) * 0.02;

		// Replace with camera movement
		meshRef.current.position.z = Math.sin(t * 0.3) * 0.08;
	});
}

function Box() {
	const boxRef = useRef();
	const materialRef = useRef();
	useFrame(({ clock }) => {
		const time = clock.getElapsedTime();
		boxRef.current.rotation.x = time * 0.5;
		boxRef.current.rotation.y = time * (Math.PI / 2) * 0.5;
	});
	return (
		<mesh ref={boxRef}>
			<boxGeometry />
			<shaderMaterial
				ref={materialRef}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={{
					uTime: { value: 0 },
				}}
				side={THREE.DoubleSide}
			/>
		</mesh>
	);
}

export default function Experience() {
	return (
		<>
			<Box />
		</>
	);
}
