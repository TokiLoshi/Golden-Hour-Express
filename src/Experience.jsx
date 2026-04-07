import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import vertexShader from "../src/shaders/vertex.glsl";
import fragmentShader from "../src/shaders/fragment.glsl";
import * as THREE from "three";

console.log("Vertex shader: ", vertexShader);
console.log("Fragment shader: ", fragmentShader);

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
