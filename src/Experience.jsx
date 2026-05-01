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
import WarpField from "./WarpField";
import { BlendFunction, KernelSize, Resizer } from "postprocessing";

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
			<WarpField />
			<Train ref={sunRef} />
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
				position={[0, 5, 0]}
			/>
			{sunReady && (
				<EffectComposer multisampling={0} disableNormalPass>
					<GodRays
						sun={sunRef}
						blendFunction={BlendFunction.Screen}
						samples={60}
						density={0.96}
						decay={0.92}
						weight={0.5}
						exposure={0.3}
						width={Resizer.AUTO_SIZE}
						height={Resizer.AUTO_SIZE}
						kernelSize={KernelSize.SMALL}
						blur
					/>
					{/* <Bloom
						intensity={0.15}
						luminanceThreshold={0.2}
						luminanceSmoothing={0.2}
						mipmapBlur
					/> */}
				</EffectComposer>
			)}
		</>
	);
}

// ToDO:
// Turn nebula into butterflies
// change near and far size to streaks
// Remove glass
// Remove train tracks
// Make treble flicker calmer and move more like dancing
// Right now everthing is just shaking
// the god rays are too bright and should be moved up a bit
// the warp field is a bit too harsh and should look more dreamy
// We should add audio controls to toggle the songs
// Need a starting overlay
// Should we make the dialogues clickable
// add cursor pointer
// dialog for train and click on the fairies
// reason for making this?
