varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uNoiseIntensity;

float random(vec2 uv) {
    return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = vUv;
    
    // Chromatic Aberration
    float amount = 0.005;
    vec4 r = texture2D(tDiffuse, uv + vec2(amount, 0.0));
    vec4 g = texture2D(tDiffuse, uv);
    vec4 b = texture2D(tDiffuse, uv - vec2(amount, 0.0));
    
    vec4 color = vec4(r.r, g.g, b.b, 1.0);
    
    // Noise
    float noise = random(uv + uTime) * uNoiseIntensity;
    color.rgb += noise;
    
    gl_FragColor = color;
}