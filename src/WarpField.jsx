import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import warpVertex from "../src/shaders/warp/vertex.glsl";
import warpFragment from "../src/shaders/warp/fragment.glsl";

export default function WarpField({ audioData }) {
	const pointsRef = useRef(null);
	const materialRef = useRef(null);

	const {
		count,
		radius,
		tunnelDepth,
		speed,
		streakLength,
		nearSize,
		farSize,
		coreColor,
		glowColor,
		bassBoost,
		trebleFlicker,
	} = useControls(
		"WarpField",
		{
			count: { value: 1000, min: 500, max: 20000, step: 100 },
			radius: { value: 25, min: 2, max: 40, step: 0.5 },
			tunnelDepth: { value: 60, min: 10, max: 200, step: 1 },
			speed: { value: 10, min: 0, max: 80, step: 0.5 },
			streakLength: { value: 1.6, min: 0, max: 6, step: 0.1 },
			nearSize: { value: 1, min: 0.5, max: 12, step: 0.1 },
			farSize: { value: 0.5, min: 0.1, max: 4, step: 0.1 },
			coreColor: { value: "#fff4d6" },
			glowColor: { value: "#ffb347" },
			bassBoost: { value: 1.4, min: 0, max: 4, step: 0.05 },
			trebleFlicker: { value: 0.5, min: 0, max: 2, step: 0.05 },
		},
		{ collapsed: true },
	);

	const { positions, attribs } = useMemo(() => {
		const positions = new Float32Array(count * 3);
		const attribs = new Float32Array(count * 3);

		for (let i = 0; i < count; i++) {
			const i3 = i * 3;
			const angle = Math.random() * Math.PI * 2;
			const r = 0.15 + 0.85 * Math.sqrt(Math.random());
			const phase = Math.random();

			positions[i3 + 0] = 0;
			positions[i3 + 1] = 0;
			positions[i3 + 2] = 0;

			attribs[i3 + 0] = angle;
			attribs[i3 + 1] = r;
			attribs[i3 + 2] = phase;
		}
		return { positions, attribs };
	}, [count]);

	// const uniforms = useMemo(() => {
	// 	uTime: {
	// 		value: 0;
	// 	}
	// 	uSpeed: {
	// 		value: speed;
	// 	}
	// 	uRadius: {
	// 		value: radius;
	// 	}
	// 	uTunnelDepth: {
	// 		value: tunnelDepth;
	// 	}
	// 	uStreakLength: {
	// 		value: streakLength;
	// 	}
	// 	uNearSize: {
	// 		value: nearSize;
	// 	}
	// 	uFarSize: {
	// 		value: farSize;
	// 	}
	// 	uCoreColor: {
	// 		value: new THREE.Color(
	// 			coreColor.startsWith("#") ? coreColor : `#${coreColor}`,
	// 		);
	// 	}
	// 	uGlowColor: {
	// 		value: new THREE.Color(
	// 			glowColor.startsWith("#" ? glowColor : `#${glowColor}`),
	// 		);
	// 	}
	// 	uBass: {
	// 		value: 0;
	// 	}
	// 	uTreble: {
	// 		value: 0;
	// 	}
	// 	uBassBoost: {
	// 		value: bassBoost;
	// 	}
	// 	uTrebleFlicker: {
	// 		value: trebleFlicker;
	// 	}
	// 	return uniforms;
	// }, []);

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uSpeed: { value: speed },
			uRadius: { value: radius },
			uTunnelDepth: { value: tunnelDepth },
			uStreakLength: { value: streakLength },
			uNearSize: { value: nearSize },
			uFarSize: { value: farSize },
			uCoreColor: {
				value: new THREE.Color(
					coreColor.startsWith("#" ? coreColor : `#${coreColor}`),
				),
			},
			uGlowColor: {
				value: new THREE.Color(
					glowColor.startsWith("#" ? glowColor : `#${glowColor}`),
				),
			},
			uBass: { value: 0 },
			uTreble: { value: 0 },
			uBassBoost: { value: bassBoost },
			uTrebleFlicker: { value: trebleFlicker },
		}),
		[], // eslint-disable-line react-hooks/exhaustive-deps
	);

	useFrame(({ clock }) => {
		if (!materialRef.current) return;
		const u = materialRef.current.uniforms;
		u.uTime.value = clock.getElapsedTime();
		u.uSpeed.value = speed;
		u.uRadius.value = radius;
		u.uTunnelDepth.value = tunnelDepth;
		u.uStreakLength.value = streakLength;
		u.uNearSize.value = nearSize;
		u.uFarSize.value = farSize;
		u.uCoreColor.value.set(
			coreColor.startsWith("#" ? coreColor : `#${coreColor}`),
		);
		u.uGlowColor.value.set(
			glowColor.startsWith("#" ? glowColor : `#${glowColor}`),
		);
		u.uBassBoost.value = bassBoost;
		u.uTrebleFlicker.value = trebleFlicker;
		u.uBass.value = audioData.current.bass;
		u.uTreble.value = audioData.current.treble;
	});

	return (
		<>
			<points ref={pointsRef} frustumCulled={false}>
				<bufferGeometry>
					<bufferAttribute attach='attributes-position' args={[positions, 3]} />
					<bufferAttribute attach='attributes-aLane' args={[attribs, 3]} />
				</bufferGeometry>
				<shaderMaterial
					ref={materialRef}
					vertexShader={warpVertex}
					fragmentShader={warpFragment}
					uniforms={uniforms}
					transparent
					depthWrite={false}
					blending={THREE.AdditiveBlending}
				/>
			</points>
		</>
	);
}
