uniform float uTime;
uniform float uBass;
uniform float uMid; 
uniform float uTreble;
uniform vec3 uWarmInner;
uniform vec3 uWarmOuter; 
uniform vec3 uCoolInner; 
uniform vec3 uCoolOuter; 
uniform float uSoftness; 
uniform float uShimmerAmount; 
uniform float uWarmthFallOff; 

varying float vRandom;
varying float vDistance;

void main() {
  float distToCenter = distance(gl_PointCoord, vec2(0.5));

  float strength = 1.0 - smoothstep(0.0, 0.5, distToCenter); 
  strength = pow(strength, 2.0); 

  float hueShift = vRandom + sin(uTime * 0.08 + vRandom * 6.28) * 0.1;

  vec3 warmColor = mix(uWarmInner, uWarmOuter, hueShift);

  vec3 coolColor = mix(uCoolInner, uCoolOuter, hueShift);

  float warmth = 1.0 - smoothstep(0.0, uWarmthFallOff, vDistance) + uBass * 0.3;
  warmth = clamp(warmth, 0.0, 1.0); 

  vec3 color = mix(coolColor, warmColor, warmth); 

  float shimmer = sin(uTime * (1.5 + vRandom * 2.0) + vRandom * 12.0) * 0.5 + 0.5;
  color += shimmer * uShimmerAmount;
  color += uMid * 0.15;

  float alpha = strength * (0.6 + 0.4 * (1.0 - vDistance));

  gl_FragColor = vec4(color, alpha); 
}