import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { forwardRef, useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const Train = forwardRef(function Train(_, sunRef) {
	// const { scene } = useGLTF(
	// 	"/models/train/spirited_away_train_fanart/spiritedTrainHalf.glb",
	// );
	const { scene } = useGLTF(
		"/models/train/spirited_away_train_fanart/spiritedTrainHalfMessing.glb",
	);
	// const { scene } = useGLTF(
	// 	"/models/train/spirited_away_train_fanart/scene.gltf",
	// );
	const trainRef = useRef();

	useLayoutEffect(() => {
		scene.traverse((obj) => {
			if (obj.isMesh) {
				obj.material.transparent = false;
				obj.material.side = THREE.DoubleSide;
				obj.material.opacity = 1;
				obj.material.depthWrite = true;
			}
		});
	}, [scene]);

	const {
		posX,
		posY,
		posZ,
		rotX,
		rotY,
		rotZ,
		scale,
		bobSpeed,
		bobHeight,
		swayAmount,
		sunOffsetZ,
		sunSize,
	} = useControls(
		"train",
		{
			posX: { value: 0, max: 10, min: -10, step: 0.1 },
			posY: { value: -0.4, max: 10, min: -10, step: 0.1 },
			posZ: { value: 3.6, max: 10, min: -10, step: 0.1 },
			rotX: { value: 0, max: 10, min: -10, step: 0.1 },
			rotY: { value: 0.1, max: 10, min: -10, step: 0.1 },
			rotZ: { value: 0, max: 10, min: -10, step: 0.1 },
			scale: { value: 0.1, max: 1, min: 0.01, step: 0.01 },
			bobSpeed: { value: 0.8, max: 3.0, min: 1, step: 0.1, label: "bobSpeed" },
			bobHeight: {
				value: 0.06,
				max: 0.3,
				min: 0.0,
				step: 0.01,
				label: "bobHeight",
			},
			swayAmount: {
				value: 0.015,
				min: 0.0,
				max: 0.1,
				step: 0.005,
				label: "swayAmount",
			},
			sunOffsetZ: { value: 0.6, max: 4, min: -2, step: 0.05 },
			sunSize: { value: 0.18, min: 0.05, max: 1, step: 0.01 },
		},
		{ collapsed: true },
	);

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();
		const group = trainRef.current;

		group.position.y =
			posY +
			Math.sin(t * bobSpeed) * bobHeight +
			Math.sin(t * bobSpeed * 1.7) * bobHeight * 0.3;

		group.rotation.z = rotZ + Math.sin(t * bobSpeed * 0.9) * swayAmount;
		group.rotation.x = rotX + Math.sin(t * bobSpeed * 0.5) * swayAmount * 0.6;
	});

	return (
		<>
			<group
				ref={trainRef}
				position={[posX, posY, posZ]}
				rotation={[rotX, rotY, rotZ]}>
				<primitive object={scene} scale={scale} />
				<mesh ref={sunRef} position={[0, 0.2, sunOffsetZ]}>
					<sphereGeometry args={[sunSize, 24, 24]} />
					<meshBasicMaterial color='#ffd591' toneMapped={false} />
				</mesh>
			</group>
		</>
	);
});

export default Train;
