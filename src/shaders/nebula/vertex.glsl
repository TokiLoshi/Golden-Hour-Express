uniform float uTime;
uniform float uPointSize;
uniform float uSpeed; 

attribute float aRandom;

varying float vRandom; 
varying float vDistance;

void main() {
  vRandom = aRandom; 
  vDistance = length(position) / 12.0; 

  vec3 pos = position; 

  float angle = uTime * uSpeed * (0.5 + aRandom * 0.8); 
  float radius = length(position.xz); 
  
  pos.x += sin(angle + aRandom * 6.28) * 0.15 * radius * 0.1;
  pos.y += cos(angle + aRandom * 6.28) * 0.15 * radius * 0.1;
  pos.z += sin(uTime + uSpeed * 0.7 + aRandom * 6.28) * 0.12;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0); 
  gl_Position = projectionMatrix * mvPosition; 

  gl_PointSize = uPointSize * (300.0 / -mvPosition.z);
}