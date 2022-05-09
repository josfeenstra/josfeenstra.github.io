// Shader.js - A generic shader which contains the vertex and fragment shader in a single program
class Shader {
	constructor(gl, vertexSource, fragmentSource) {
		this.gl = gl;

		this.vertexSource = vertexSource;
		this.fragmentSource = fragmentSource;

		this.vertexShader = null;
		this.fragmentShader = null;

		this.program = null;

		this.buffers = [];
		this.bufferLength = 0;

		this.uniforms = [];

		this.uniformDimensions = [];
		this.attributeDimensions = [];

		this.uniformLocations = [];
		this.attributeLocations = [];

		this.texture = null;
		this.textureBinding = null;
		this.textureIndex = 0;

		this.initialize();
	}


	// Initialize the shader program
	initialize() {
		this.vertexShader = this.compileShader(this.gl.VERTEX_SHADER, this.vertexSource);
		this.fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, this.fragmentSource);

		this.program = this.createProgram();
	}


	// Generic shader compiler
	compileShader(type, source) {
		let shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);

		let success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
		if (success) return shader;

		console.log(this.gl.getShaderInfoLog(shader));
		this.gl.deleteShader(shader);
	}


	// Create the shader program
	createProgram() {
		let program = this.gl.createProgram();
		this.gl.attachShader(program, this.vertexShader);
		this.gl.attachShader(program, this.fragmentShader);

		this.gl.linkProgram(program);

		let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
		if (success) return program;

		console.log(this.gl.getProgramInfoLog(program));
		this.gl.deleteProgram(program);
	}


	// Register the locations of the attributes and at the to the attribute locations dictionary
	registerAttributes(attributes) {
		if (this.program != null) {
			for (let [attribute, dim] of Object.entries(attributes)) {
				this.attributeLocations[attribute] = this.gl.getAttribLocation(this.program, attribute);
				this.attributeDimensions[attribute] = dim;
			}
		} else {
			console.log("Cannot register attribute locations, program has not been created yet!");
		}
	}


	// Register the locations of the uniforms and at the to the uniform locations dictionary
	registerUniforms(uniforms) {
		if (this.program != null) {
			for (let [uniform, dim] of Object.entries(uniforms)) {
				this.uniformLocations[uniform] = this.gl.getUniformLocation(this.program, uniform);
				this.uniformDimensions[uniform] = dim;
			}
		} else {
			console.log("Cannot register uniform locations, program has not been created yet!");
		}
	}


	// Add a texture to the shader program in a certain texture slot
	addTexture(image, index = 0) {
		this.textureBinding = this.gl.createTexture();
		let gl = this.gl;

		gl.activeTexture(gl.TEXTURE0 + index);
		gl.bindTexture  (gl.TEXTURE_2D, this.textureBinding);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		this.texture = image;
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.texture);

		// gl.generateMipmap(gl.TEXTURE_2D);
		this.textureIndex = index;
	}


	// Buffer the attribute data. Format: {name, dimension, data}
	buffer(attributeData) {
		this.bufferLength = 0;

		for (let [name, data] of Object.entries(attributeData)) {
			this.buffers[name] = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[name]);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);

			if (this.bufferLength === 0) this.bufferLength = data.length;
		}
	}


	// Set the uniforms in the shader program
	setUniforms(uniforms) {
		this.uniforms = [];

		for (let [uniform, data] of Object.entries(uniforms)) {
			this.uniforms[uniform] = data;
		}
	}


	// Render the shader
	render() {
		this.gl.useProgram(this.program);

		// Enable the attributes
		for (let value of Object.values(this.attributeLocations)) {
			this.gl.enableVertexAttribArray(value);
		}

		// Bind the buffers
		if (this.buffers != null) {
			for (let key of Object.keys(this.buffers)) {
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
				this.gl.vertexAttribPointer(this.attributeLocations[key], this.attributeDimensions[key], this.gl.FLOAT, false, 0, 0);
			}
		}

		// Bind the texture
		if (this.texture != null) {
			this.gl.activeTexture(this.gl.TEXTURE0 + this.textureIndex);
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureBinding);
		}
		
		// Set the uniforms
		if (this.uniforms != null) {
			for (let [uniform, data] of Object.entries(this.uniforms)) {
				let dim = this.uniformDimensions[uniform];
				switch (dim) {
					case 1:
						this.gl.uniform1f(this.uniformLocations[uniform], data);
						break;
					case 2:
						this.gl.uniform2fv(this.uniformLocations[uniform], new Float32Array(data));
						break;
					case 3:
						this.gl.uniform3fv(this.uniformLocations[uniform], new Float32Array(data));
						break;
					case 4:
						this.gl.uniform4fv(this.uniformLocations[uniform], new Float32Array(data));
						break;
					case "m3":
						this.gl.uniformMatrix3fv(this.uniformLocations[uniform], false, new Float32Array(data));
						break;
					case "m4":
						this.gl.uniformMatrix4fv(this.uniformLocations[uniform], false, new Float32Array(data));
						break;
				}
			}
		}

		// Execute the vertex and fragment shader on the shader program
		if (this.bufferLength > 0) this.gl.drawArrays(this.gl.TRIANGLES, 0, this.bufferLength);
	}
}