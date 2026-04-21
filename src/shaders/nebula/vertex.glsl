uniform float uTime;
uniform float uPointSize;
uniform float uSpeed; 
uniform float uBass;
uniform float uTreble;
uniform float uSwirl;
uniform float uDrift; 
uniform float uTrebleShake; 

attribute float aRandom;

varying float vRandom; 
varying float vDistance;

void main() {
  vRandom = aRandom; 
  vDistance = length(position) / 12.0; 

  vec3 pos = position; 
  float bassExpand = 1.0 + uBass * 0.8; 
  pos *= bassExpand;

  // Treble shake
  pos.x += sin(uTime * 20.0 + aRandom * 6.28) * uTreble * uTrebleShake;
  pos.y += sin(uTime * 20.0 + aRandom * 3.14) * uTreble * uTrebleShake;

  // Swirl 
  float angle = uTime * uSpeed * (0.5 + aRandom * 0.8); 
  float radius = length(position.xz); 
  
  pos.x += sin(angle + aRandom * 6.28) * uSwirl * radius * 0.1;
  pos.y += cos(angle + aRandom * 6.28) * uSwirl * radius * 0.1;
  // Drift 
  pos.z += sin(uTime + uSpeed * 0.7 + aRandom * 6.28) * uDrift;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0); 
  gl_Position = projectionMatrix * mvPosition; 

  gl_PointSize = uPointSize * (300.0 / -mvPosition.z) * (1.0 + uBass * 0.6);
}