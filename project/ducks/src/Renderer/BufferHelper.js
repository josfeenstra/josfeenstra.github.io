// BufferHelper.js - Helper class that deals with formatting the buffer

class BufferHelper {
	// Add a 2D rectangle to a list of vertices
	static add2DRectangle(vertices, x, y, width, height, angle = 0.0) {
		let tl, tr, bl, br;
		if (angle !== 0.0) {
			tl = new Vector(-width / 2, -height / 2).rotate(new Vector(), angle);
			tr = new Vector(width / 2, -height / 2).rotate(new Vector(), angle);
			bl = new Vector(-width / 2, height / 2).rotate(new Vector(), angle);
			br = new Vector(width / 2, height / 2).rotate(new Vector(), angle);
		} else {
			tl = new Vector(-width / 2, -height / 2);
			tr = new Vector(width / 2, -height / 2);
			bl = new Vector(-width / 2, height / 2);
			br = new Vector(width / 2, height / 2);
		}

		vertices.push(x + bl.x); vertices.push(y + bl.y);
		vertices.push(x + tr.x); vertices.push(y + tr.y);
		vertices.push(x + tl.x); vertices.push(y + tl.y);
		vertices.push(x + br.x); vertices.push(y + br.y);
		vertices.push(x + tr.x); vertices.push(y + tr.y);
		vertices.push(x + bl.x); vertices.push(y + bl.y);
	}


	// Add a 2D triangle to a list of vertices
	static add2DTriangle(vertices, x, y, width, height, angle = 0.0) {
		let t, bl, br;
		if (angle !== 0.0) {
			t = new Vector(0, height / 2).rotate(new Vector(), angle);
			bl = new Vector(-width / 2, -height / 2).rotate(new Vector(), angle);
			br = new Vector(width / 2, -height / 2).rotate(new Vector(), angle);
		} else {
			t = new Vector(0, height / 2);
			bl = new Vector(-width / 2, -height / 2);
			br = new Vector(width / 2, -height / 2);
		}

		vertices.push(x + t.x); vertices.push(y + t.y);
		vertices.push(x + br.x); vertices.push(y + br.y);
		vertices.push(x + bl.x); vertices.push(y + bl.y);
	}


	// Add 2D rectangular texture coordinates to a list of texture coordinates
	static add2DTextureCoordinates(textureCoordinates, sx, sy, sw, sh, image = null) {
		if (image != null) {
			sx = sx / image.width;
			sw = sw / image.width;

			sy = sy / image.height;
			sh = sh / image.height;
		}

		textureCoordinates.push(sx); textureCoordinates.push(sy + sh);
		textureCoordinates.push(sx + sw); textureCoordinates.push(sy);
		textureCoordinates.push(sx); textureCoordinates.push(sy);
		textureCoordinates.push(sx + sw); textureCoordinates.push(sy + sh);
		textureCoordinates.push(sx + sw); textureCoordinates.push(sy);
		textureCoordinates.push(sx); textureCoordinates.push(sy + sh);
	}


	// Add 2D color to colors
	static add2DColors(colors, r, g, b, a) {
		if (r > 1) r = r / 256;
		if (g > 1) g = g / 256;
		if (b > 1) b = b / 256;

		colors.push(r, g, b, a);
		colors.push(r, g, b, a);
		colors.push(r, g, b, a);
		colors.push(r, g, b, a);
		colors.push(r, g, b, a);
		colors.push(r, g, b, a);
	}


	// Add 2D color to colors
	static add2DTriangleColors(colors, r, g, b, a) {
		if (r > 1) r = r / 256;
		if (g > 1) g = g / 256;
		if (b > 1) b = b / 256;

		colors.push(r, g, b, a);
		colors.push(r, g, b, a);
		colors.push(r, g, b, a);
	}


	// Add a polygon to the buffer with a certain color and normals
	// static addPolygon(vertexBuffer, colorBuffer, normalBuffer, vertices, color = new Vector(0.0, 0.0, 0.0), offset = new Vector(0.0, 0.0, 0.0), rotation = new Vector(0.0, 0.0, 0.0), scale = 1.0) {		
	// 	if(scale === 0.0) scale = 1.0;
		
	// 	// Scale the vertices
	// 	for (let i = 0; i < 3; i++) {
	// 		vertices.data[i * 3 + 0] *= scale;
	// 		vertices.data[i * 3 + 1] *= scale;
	// 		vertices.data[i * 3 + 2] *= scale;
	// 	}
		
	// 	// Rotate around the X
	// 	vertices = vertices.tp();
	// 	const rotateX = Matrix.new(3, 3, [
	// 		1, 0, 0,
	// 		0, Math.cos(rotation.x), -Math.sin(rotation.x),
	// 		0, Math.sin(rotation.x), Math.cos(rotation.x)
	// 	]);
	// 	vertices = Matrix.mulAtoB(rotateX, vertices);
	// 	vertices = vertices.tp();
		
	// 	// Offset the vertices
	// 	for (let i = 0; i < 3; i++) {
	// 		vertices.data[i * 3 + 0] += offset.x;
	// 		vertices.data[i * 3 + 1] += offset.y;
	// 		vertices.data[i * 3 + 2] += offset.z;
	// 	}
		
	// 	// Rotate the vertices
	// 	vertices = vertices.tp();

	// 	// Rotate around the Z
	// 	const rotateZ = Matrix.new(3, 3, [
	// 		Math.cos(rotation.z), -Math.sin(rotation.z), 0,
	// 		Math.sin(rotation.z), Math.cos(rotation.z), 0,
	// 		0, 0, 1
	// 	]);

	// 	vertices = Matrix.mulAtoB(rotateZ, vertices);

	// 	// Rotate around the X
	// 	// const rotateX = Matrix.new(3, 3, [
	// 	// 	1, 0, 0,
	// 	// 	0, Math.cos(rotation.x), -Math.sin(rotation.x),
	// 	// 	0, Math.sin(rotation.x), Math.cos(rotation.x)
	// 	// ]);
	// 	// vertices = Matrix.mulAtoB(rotateX, vertices);

	// 	// Rotate around the Y
	// 	const rotateY = Matrix.new(3, 3, [
	// 		Math.cos(rotation.y), 0, -Math.sin(rotation.y),
	// 		0, 1, 0,
	// 		Math.sin(rotation.y), 0, Math.cos(rotation.y)
	// 	]);
	// 	vertices = Matrix.mulAtoB(rotateY, vertices);

		

	// 	vertices = vertices.tp();
	// 	vertices = vertices.data;

	// 	// Compute the normals for the vertices
	// 	const normal = this.computeNormal(vertices);

	// 	// Add the vertices, colors and normals to the buffers
	// 	this.add(vertices, vertexBuffer);
	// 	this.add(color, colorBuffer, 3);
	// 	this.add(normal, normalBuffer, 3);
	// }


	// static addPolygon(vertexBuffer, vertices, colorBuffer = [], color = [], normalBuffer = [], offsetBuffer = [], offset = new Vector(0.0, 0.0, 0.0), rotationBuffer = [], rotation = new Vector(0.0, 0.0, 0.0), scaleBuffer = [], scale = 1.0) {		
	static addPolygon(vertexBuffer, vertices, colorBuffer = [], color = [], normalBuffer = [], offset = new Vector(0.0, 0.0, 0.0), rotation = new Vector(0.0, 0.0, 0.0), scale = 1.0) {		
		if(scale === 0.0) scale = 1.0;
		
		// Scale the vertices
		for (let i = 0; i < 3; i++) {
			vertices.data[i * 3 + 0] *= scale;
			vertices.data[i * 3 + 1] *= scale;
			vertices.data[i * 3 + 2] *= scale;
		}
		
		// Rotate around the X
		vertices = vertices.tp();
		const rotateX = Matrix.new(3, 3, [
			1, 0, 0,
			0, Math.cos(rotation.x), -Math.sin(rotation.x),
			0, Math.sin(rotation.x), Math.cos(rotation.x)
		]);
		vertices = Matrix.mulAtoB(rotateX, vertices);
		vertices = vertices.tp();
		
		// Offset the vertices
		for (let i = 0; i < 3; i++) {
			vertices.data[i * 3 + 0] += offset.x;
			vertices.data[i * 3 + 1] += offset.y;
			vertices.data[i * 3 + 2] += offset.z;
		}
		
		// Rotate the vertices
		vertices = vertices.tp();

		// Rotate around the Z
		const rotateZ = Matrix.new(3, 3, [
			Math.cos(rotation.z), -Math.sin(rotation.z), 0,
			Math.sin(rotation.z), Math.cos(rotation.z), 0,
			0, 0, 1
		]);

		vertices = Matrix.mulAtoB(rotateZ, vertices);

		// Rotate around the X
		// const rotateX = Matrix.new(3, 3, [
		// 	1, 0, 0,
		// 	0, Math.cos(rotation.x), -Math.sin(rotation.x),
		// 	0, Math.sin(rotation.x), Math.cos(rotation.x)
		// ]);
		// vertices = Matrix.mulAtoB(rotateX, vertices);

		// Rotate around the Y
		const rotateY = Matrix.new(3, 3, [
			Math.cos(rotation.y), 0, -Math.sin(rotation.y),
			0, 1, 0,
			Math.sin(rotation.y), 0, Math.cos(rotation.y)
		]);
		vertices = Matrix.mulAtoB(rotateY, vertices);

		vertices = vertices.tp();
		vertices = vertices.data;

		// Compute the normals for the vertices
		const normal = this.computeNormal(vertices);

		// Add the vertices, colors and normals to the buffers
		this.add(vertices, vertexBuffer);
		this.add(color, colorBuffer, 3);
		this.add(normal, normalBuffer, 3);

		// this.add(offset, offsetBuffer, 3);
		// this.add(rotation, rotationBuffer, 3);
		// this.add([scale], scaleBuffer, 3);
	}
	

	/**
	 * Add image to buffer
	 */
	static addImage(vertices, textureCoordinates, x, y, w, h, sx, sy, sw, sh, image = null, angle = 0.0, mirrored) {
		this.add2DRectangle(vertices, x, y, w, h, angle);
		if (mirrored) {
			this.add2DTextureCoordinates(textureCoordinates, sx + sw, sy, -sw, sh, image);
		} else {
			this.add2DTextureCoordinates(textureCoordinates, sx, sy, sw, sh, image);
		}
	}

	// Add a coloured rectangle
	static addRectangle(vertices, colors, x, y, w, h, angle, r, g, b, a) {
		this.add2DRectangle(vertices, x, y, w, h, angle);
		this.add2DColors(colors, r, g, b, a);
	}


	// Add a coloured triangle
	static addTriangle(vertices, colors, x, y, w, h, angle, r, g, b, a) {
		this.add2DTriangle(vertices, x, y, w, h, angle);
		this.add2DTriangleColors(colors, r, g, b, a);
	}


	// Computes the normal vector to three vertices
	static computeNormal(vertices) {
		const vector1 = [vertices[3] - vertices[0], vertices[4] - vertices[1], vertices[5] - vertices[2]];
		const vector2 = [vertices[6] - vertices[3], vertices[7] - vertices[4], vertices[8] - vertices[5]];

		const normal = [vector1[1] * vector2[2] - vector1[2] * vector2[1], vector1[2] * vector2[0] - vector1[0] * vector2[2], vector1[0] * vector2[1] - vector1[1] * vector2[0]];
		const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);

		normal[0] = normal[0] / length;
		normal[1] = normal[1] / length;
		normal[2] = normal[2] / length;

		return normal;
	}


	// Add an array to a buffer
	static add(array, buffer, repeats = 1) {
		for (let j = 0; j < repeats; j++) {
			for (let i in array) buffer.push(array[i]);
		}
	}
}
