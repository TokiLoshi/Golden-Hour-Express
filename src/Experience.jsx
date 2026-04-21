import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useLayoutEffect } from "react";
import vertexShader from "../src/shaders/nebula/vertex.glsl";
import fragmentShader from "../src/shaders/nebula/fragment.glsl";
import * as THREE from "three";
import { useControls } from "leva";
import { useGLTF } from "@react-three/drei";
import Nebula from "./Nebula";
import Train from "./Train";

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
		trainRef.current.position.z = Math.sin(t * 0.3) * 0.08;
	});

	return (
		<>
			<mesh ref={trainRef} position={[0, 0, 0]}>
				<boxGeometry args={[0.8, 0.5, 2.0]} />
				<meshStandardMaterial
					color='#f4a832'
					emissive='#c4620a'
					roughness={0.6}
					metalness={0.3}
				/>
				<pointLight color='#fa832' intensity={3} distance={4} decay={2} />
			</mesh>
		</>
	);
}

export default function Experience({ audioData, update }) {
	return (
		<>
			<Nebula audioData={audioData} update={update} />
			{/* <PlaceholderTrain /> */}
			<Train />
			<ambientLight intensity={0.15} color='#1a0a2e' />
			<pointLight
				color='#f3a832'
				intensity={4}
				distance={8}
				decay={2}
				position={[0, 0.2, 3.6]}
			/>
			<pointLight
				color='#f4a832'
				intensity={50}
				distance={80}
				decay={2}
				position={[0, 3, 0]}
			/>
		</>
	);
}
