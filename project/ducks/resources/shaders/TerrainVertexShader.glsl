
// Attribute is derived from buffer
attribute vec4 a_position;
attribute vec3 a_normal;

// Uniform (global) variable set during render call
uniform mat4 u_camera;
uniform vec3 u_lightDirection;

// Varying variable that is passed to the fragment shader
varying vec3 v_position;
varying vec3 v_normal;
varying vec3 v_lightDirection;

void main() {
    gl_Position = u_camera * a_position;

    v_position = a_position.xyz;
    v_normal = a_normal;
    v_lightDirection = u_lightDirection;
}