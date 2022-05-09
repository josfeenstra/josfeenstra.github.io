precision mediump float;

varying vec3 v_color;
varying vec3 v_normal;

varying vec3 v_lightDirection;

void main() {
    float colorIntensity = dot(v_normal, -v_lightDirection);
    vec3 color = colorIntensity * v_color;

    gl_FragColor = vec4(color.x / 255.0, color.y / 255.0, color.z / 255.0, 1.0);
}