varying vec2 vUv;

uniform float uTime;

void main() {
  vec3 color = vec3(vUv.x, vUv.y, sin(uTime) * 0.8 + 0.5);
  gl_FragColor = vec4(color, 1.0);
}