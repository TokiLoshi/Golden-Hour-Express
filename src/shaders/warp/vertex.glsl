uniform float uTime; 
uniform float uSpeed;
uniform float uRadius; 
uniform float uTunnelDepth; 
uniform float uStreakLength; 
uniform float uNearSize; 
uniform float uFarSize; 
uniform float uBass; 
uniform float uTreble; 
uniform float uBassBoost; 

attribute vec3 aLane; 

varying float vDepth01; 
varying float vRandom; 
varying float vStreak; 

void main() {
  float angle = aLane.x;
  float radial = aLane.y;
  float phase = aLane.z; 

  float r = radial * uRadius; 
  vec3 pos;
  pos.x = cos(angle) * r; 
  pos.y = sin(angle) * r; 

  float boostedSpeed = uSpeed * (1.0 + uBass * uBassBoost);
  float travel = phase * uTunnelDepth + uTime * boostedSpeed; 

  float z = mod(travel, uTunnelDepth) - uTunnelDepth * 0.5; 
  pos.z = z; 

  vDepth01 = clamp((pos.z + uTunnelDepth * 0.5) / uTunnelDepth, 0.0, 1.0);
  vRandom = phase; 

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0); 
  gl_Position = projectionMatrix * mvPosition; 

  float sizeMix = smoothstep(0.0, 1.0, vDepth01); 
  float baseSize = mix(uFarSize, uNearSize, sizeMix); 
  gl_PointSize = baseSize * (300.0 / -mvPosition.z); 
  vStreak = uStreakLength * sizeMix; 

}