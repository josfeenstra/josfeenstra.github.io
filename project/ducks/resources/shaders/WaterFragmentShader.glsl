precision mediump float;

varying vec3 v_normal;
varying vec3 v_lightDirection;

void main() {
    vec3 waterColor = vec3(0.0, 100.0 / 255.0, 188.0 / 255.0);
    float colorIntensity = dot(v_normal, -v_lightDirection);

    waterColor = colorIntensity * waterColor;
    gl_FragColor = vec4(waterColor.x, waterColor.y, waterColor.z, 0.8);
}