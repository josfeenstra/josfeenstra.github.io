precision mediump float;

uniform sampler2D u_texture;

varying vec2 v_textureCoordinate;

void main() {
	vec4 pixel = texture2D(u_texture, v_textureCoordinate);

	gl_FragColor = pixel;
}