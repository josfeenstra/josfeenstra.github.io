attribute vec2 a_vertex;
attribute vec2 a_textureCoordinate;

uniform vec2 u_resolution;

varying vec2 v_textureCoordinate;

void main() {
	vec2 position = a_vertex;
	vec2 clipSpace = ((position / u_resolution) * 2.0 - 1.0);

	// Set position
	gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);

	v_textureCoordinate = a_textureCoordinate;
}
