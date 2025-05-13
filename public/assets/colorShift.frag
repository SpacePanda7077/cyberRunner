precision mediump float;

uniform float time;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main() {
    vec4 pixel = texture2D(uMainSampler, outTexCoord);

    float r = 0.6 + 0.4 * sin(time);
    float g = 0.6 + 0.4 * sin(time + 2.0);
    float b = 0.6 + 0.4 * sin(time + 4.0);

    gl_FragColor = vec4(pixel.rgb * vec3(r, g, b), pixel.a);
}
