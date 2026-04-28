import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useLayoutEffect, useState, useEffect } from "react";
import vertexShader from "../src/shaders/nebula/vertex.glsl";
import fragmentShader from "../src/shaders/nebula/fragment.glsl";
import * as THREE from "three";
import { useControls } from "leva";
import { useGLTF } from "@react-three/drei";
import Nebula from "./Nebula";
import Train from "./Train";
import { Bloom, EffectComposer, GodRays } from "@react-three/postprocessing";

export default function Experience({ audioData, update }) {
	const sunRef = useRef();
	const [sunReady, setSunReady] = useState(false);
	useEffect(() => {
		if (sunRef.current) {
			setSunReady(true);
		}
	}, []);
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
			{sunReady && (
				<EffectComposer multisampling={0} disableNormalPas>
					<GodRays
						sun={sunRef}
						blendFunction={BlendFunction.Screen}
						samples={60}
						density={0.96}
						decay={0.92}
						weight={0.5}
						exposure={0.55}
						width={Resizer.AUTO_SIZE}
						heihg={Resizer.AUTO_SIZE}
						kernelSize={KernalSize.SMALL}
						blur
					/>
					<Bloom
						intensity={0.45}
						luminanceThreshold={0.6}
						luminanceSmoothing={0.2}
						mipmapBlur
					/>
				</EffectComposer>
			)}
		</>
	);
}
