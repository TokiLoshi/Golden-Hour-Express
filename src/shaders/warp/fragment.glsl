uniform vec3 uCoreColor; 
uniform vec3 uGlowColor; 
uniform float uTime;
uniform float uTreble; 
uniform float uTrebleFlicker; 

varying float vDepth01; 
varying float vRandom; 
varying float vStreak; 

void main() {
  
  vec2 uv = gl_PointCoord - 0.5; 
  uv.y *= 1.0 + vStreak; 
  float d = length(uv);
  float core = smoothstep(0.45, 0.0, d); 
  float glow = smoothstep(0.5, 0.1, d) * 0.6; 
  float flicker = 1.0 + sin(uTime * 18.0 + vRandom * 31.4) * uTreble * uTrebleFlicker;

  float spawnFade = smoothstep(0.0, 0.15, vDepth01); 
  float exitFade = 1.0 - smoothstep(0.92, 1.0, vDepth01); 
  vec3 color = mix(uGlowColor, uCoreColor, core) * flicker;
  float alpha = (core + glow) * spawnFade * exitFade;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(color, alpha); 
}