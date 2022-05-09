
// Attribute is derived from buffer
attribute vec4 a_position;
attribute vec3 a_color;
attribute vec3 a_normal;

// attribute vec3 a_offset;
// attribute vec3 a_rotation;
// attribute float a_scale;

// Uniform (global) variable set during render call
uniform mat4 u_camera;
uniform vec3 u_lightDirection;

// Varying variable that is passed to the fragment shader
varying vec3 v_color;
varying vec3 v_normal;
varying vec3 v_lightDirection;

void main() {
    gl_Position = u_camera * a_position;

    v_color = a_color;
    v_normal = a_normal;

    v_lightDirection = u_lightDirection;
}