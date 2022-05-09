
// Attribute is derived from buffer
attribute vec4 a_position;

// Uniform (global) variable set during render call
uniform mat4 u_camera;
uniform vec3 u_lightDirection;
uniform float u_period;

// Varying variable that is passed to the fragment shader
varying vec3 v_normal;
varying vec3 v_lightDirection;

const float waterLine = 300.0;

void main() {
    vec4 position = a_position;
    vec3 normal = normalize(position.xyz);
    position.xyz = normal * (waterLine + 1.0 * sin(u_period * 2.0 * 3.14159265) + 1.0);

    gl_Position = u_camera * position;

    v_normal = normal;
    v_lightDirection = u_lightDirection;
}