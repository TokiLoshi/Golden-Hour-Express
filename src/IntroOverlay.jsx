import { useState } from "react";

export default function IntroOverlay() {
	const [visible, setVisible] = useState(true);
	if (!visible) return null;

	return (
		<>
			<div
				style={{
					position: "fixed",
					inset: 0,
					zIndex: 100,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backdropFilter: "blur(8px)",
					background: "rgba(10, 5, 20, 0.55)",
					animation: "fadeIn 0.8s ease-out",
				}}>
				<div
					style={{
						maxWidth: "520px",
						padding: "2.5rem 2.75rem",
						background:
							"linear-gradient(135deg, rgba(40, 20, 35, 0.85), rgba(60, 35, 20, 0.85))",
						border: "1px solid rgba(255, 200, 130, 0.25)",
						borderRadius: "16px",
						boxShadow:
							"0 20px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(255, 180, 100, 0.08)",
						color: "#fff4d6",
						fontFamily: "'Georgia', 'Cormorant Garamond', serif",
						textAlign: "center",
						animation: "slideUp 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)",
					}}>
					<h1
						style={{
							fontSize: "1.7rem",
							fontWeight: 400,
							letterSpacing: "0.02em",
							margin: "0 0 1.25rem 0",
							color: "#ffd591",
						}}>
						All aboard the Golden Hour Express
					</h1>
					<p
						style={{
							fontSize: "1rem",
							lineHeight: 1.7,
							margin: "0 0 1rem 0",
							color: "rgba(255, 244, 214, 0.9)",
						}}>
						Sometimes life feels like you're hurtling through space, unsure of
						the destination - but you keep going through it, and it's more fun
						when you can dance to the music.
					</p>
					<p
						style={{
							fontSize: "1rem",
							lineHeight: 1.7,
							margin: "0 0 1rem 0",
							color: "rgba(255, 244, 214, 0.9)",
						}}>
						Take a moment, take a breath, and watch the universe dance with you.
					</p>
					<p
						style={{
							fontSize: "1rem",
							lineHeight: 1.7,
							margin: "0 0 1rem 0",
							color: "rgba(255, 244, 214, 0.9)",
						}}>
						This is a tiny experiment in passing audio data to shaders. Hope you
						enjoy! 🚂
					</p>
					<button
						onClick={() => setVisible(false)}
						style={{
							background: "linear-gradient(135deg, #f3a832, #ffb347)",
							color: "#2a1505",
							border: "none",
							padding: "0.75rem 2.25rem",
							borderRadius: "900px",
							fontSize: "0.95rem",
							fontFamily: "inherit",
							letterSpacing: "0.05rem",
							cursor: "pointer",
							boxShadow: "0 4px 20px rgba(243, 168, 50, 0.4)",
							transition: "transform 0.2 ease, box-shadow 0.2 ease",
						}}>
						Lets dance
					</button>
				</div>
			</div>
		</>
	);
}
