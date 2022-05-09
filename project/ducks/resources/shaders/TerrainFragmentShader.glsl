precision mediump float;

varying vec3 v_position;
varying vec3 v_normal;
varying vec3 v_lightDirection;

const float waterLine = 300.0;
const float mountainLine = 330.0;
const float sandWidth = 5.0;

const vec3 lightWoodsColor = vec3(111.0 / 255.0, 204.0 / 255.0, 111.0 / 255.0);
const vec3 darkWoodsColor = vec3(111.0 / 255.0, 204.0 / 255.0, 111.0 / 255.0); // vec3(4.0 / 255.0, 94.0 / 255.0, 42.0 / 255.0);
const vec3 sandColor = vec3(1.0, 1.0, 1.0);
const vec3 mountainColor = vec3(0.4, 0.4, 0.4);
const vec3 seaBedColor = vec3(0.3, 0.3, 0.3);

void main() {
    float height = length(v_position);
    vec3 color = vec3(1.0, 1.0, 1.0);

    if (height > mountainLine) color = darkWoodsColor;
    else if (height > (waterLine + sandWidth * 0.5)) {
        float factor = (height - waterLine + sandWidth * 0.5) / (mountainLine - waterLine + sandWidth * 0.5);
        color = (1.0 - factor) * lightWoodsColor + factor * darkWoodsColor;
    }
    else if (height > (waterLine - sandWidth * 0.5)) color = sandColor;
    else color = seaBedColor;

    float colorIntensity = dot(v_normal, -v_lightDirection);
    color = colorIntensity * color;

    gl_FragColor = vec4(color.x, color.y, color.z, 1.0);
}