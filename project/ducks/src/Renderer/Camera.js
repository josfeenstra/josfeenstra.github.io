/*
 	Camera.js
 	Handles the properties of a 3D operating camera and computes its projection matrix
 	Author: Ward van der Velden
 	Bamimoth
*/


class Camera {
	constructor(game) {
		this.game = game;

		this.pos = new Vector(640.0, 360.0, -300.0);
		this.rot = new Vector(0.0, 0.0, 0.0);

		this.scalar = new Vector(1.0, 1.0, 1.0);

		this._screenWidth = game.canvas.width;
		this._screenHeight = game.canvas.height;

		this._aspect = this._screenWidth / this._screenHeight;
		this._fov = Math.PI / 3; // [rad]
		this._fustrumNear = 0.0;
		this._fustrumFar = 1000.0;

		this._fudgeFactor = 0.4;
		this._screenDepth = 2000.0;

		// transitions
		this.destination = null;
		this.time = 0;
	}


	update(dt) {
		// only update if there is some destination
		if (this.destination) {
			const towardsDest = this.destination.subtract(this.pos);
			const distance = towardsDest.length();
			const distanceToMove = dt/this.time * distance;
			const vectorToMove = towardsDest.normalize().scale(distanceToMove);

			this.pos = this.pos.add(vectorToMove);
			this.time = Math.max(0, this.time - dt);

			if (this.time == 0) {
				this.pos = this.destination;
			}
		}

		if (this.pos == this.destination) {
			this.destination = null;
			this.time = 0;
		}
	}


	// Return on the duck
	center() {
		const duck = this.game.duck;
		
		let [theta, phi] = duck.pos.polarAngles();

		// Introduce a deadzone at the top
		if (Math.abs(theta) > Math.PI * 0.4) theta = Math.sign(theta) * Math.PI * 0.4;

		this.rot.x = Math.sin(phi) * theta;
		this.rot.y = phi + Math.PI / 2;
		this.rot.z = -Math.cos(phi) * theta;
	}


	// Returns the projection matrix for the camera
	project() {
		let matrix = this.perspective();
		matrix = this._multiplyMatrix(matrix, this._translate());
		matrix = this._multiplyMatrix(matrix, this._rotateY());
		matrix = this._multiplyMatrix(matrix, this._rotateX());
		matrix = this._multiplyMatrix(matrix, this._rotateZ());
		matrix = this._multiplyMatrix(matrix, this._scale());

		return matrix;
	}


	// transitions the camera to this destination in the given time
	transition(destination = new Vector(0.0, 0.0, 0.0), time = 1000) {
		this.destination = destination;
		this.time = time;
	}


	// Returns the light direction based on the camera rotation
	lightDirection() {
		const duck = this.game.duck;

		const lightDirection = duck.pos.normalize();
		return [-lightDirection.x, -lightDirection.y, -lightDirection.z];
	}


	// Compute the translation matrix
	_translate() {
		return [
			1,          0,          0,          0,
			0,          1,          0,          0,
			0,          0,          1,          0,
			this.pos.x, this.pos.y, this.pos.z, 1,
		];
	}


	// Compute the rotation matrix in the x axis
	_rotateX() {
		let c = Math.cos(this.rot.x);
		let s = Math.sin(this.rot.x);

		return [
			1,  0, 0, 0,
			0,  c, s, 0,
			0, -s, c, 0,
			0,  0, 0, 1,
		];
	}


	// Compute the rotation matrix in the y axis
	_rotateY() {
		let c = Math.cos(this.rot.y);
		let s = Math.sin(this.rot.y);

		return [
			c,  0, -s, 0,
			0,  1,  0, 0,
			s,  0,  c, 0,
			0,  0,  0, 1,
		];
	}


	// Compute the rotation matrix in the z axis
	_rotateZ() {
		let c = Math.cos(this.rot.z);
		let s = Math.sin(this.rot.z);

		return [
			 c, s, 0, 0,
			-s, c, 0, 0,
			 0, 0, 1, 0,
			 0, 0, 0, 1,
		];
	}


	// Compute the scaling matrix
	_scale() {
		return [
			this.scalar.x, 0,             0,             0,
			0,             this.scalar.y, 0,             0,
			0,             0,             this.scalar.z, 0,
			0,             0,             0,             1,
		];
	}


	// Compute the matrix to project points from pixel to clip space
	projection() {
		return [
	    	 2 / this._screenWidth, 0,                      0,                    0,
	    	 0, 		           -2 / this._screenHeight, 0,                    0,
	    	 0,                    0,                      2 / this._screenDepth, 0,
	    	-1,                    1,                      0,                    1,
	    ];
	}


	// Compute a matrix that accounts for the fudge due to the z
	_fudgeZ() {
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, this._fudgeFactor,
			0, 0, 0, 1
		];
	}


	// Compute the perspective matrix to get everything in clip space
	perspective() {
		let matrix = this._fudgeZ();
		return this._multiplyMatrix(matrix, this.projection());
	}


	// Multiply two 4x4 matrices
	_multiplyMatrix(a, b) {
		let b00 = b[0 * 4 + 0];
	    let b01 = b[0 * 4 + 1];
	    let b02 = b[0 * 4 + 2];
	    let b03 = b[0 * 4 + 3];
	    let b10 = b[1 * 4 + 0];
	    let b11 = b[1 * 4 + 1];
	    let b12 = b[1 * 4 + 2];
	    let b13 = b[1 * 4 + 3];
	    let b20 = b[2 * 4 + 0];
	    let b21 = b[2 * 4 + 1];
	    let b22 = b[2 * 4 + 2];
	    let b23 = b[2 * 4 + 3];
	    let b30 = b[3 * 4 + 0];
	    let b31 = b[3 * 4 + 1];
	    let b32 = b[3 * 4 + 2];
	    let b33 = b[3 * 4 + 3];
	    let a00 = a[0 * 4 + 0];
	    let a01 = a[0 * 4 + 1];
	    let a02 = a[0 * 4 + 2];
	    let a03 = a[0 * 4 + 3];
	    let a10 = a[1 * 4 + 0];
	    let a11 = a[1 * 4 + 1];
	    let a12 = a[1 * 4 + 2];
	    let a13 = a[1 * 4 + 3];
	    let a20 = a[2 * 4 + 0];
	    let a21 = a[2 * 4 + 1];
	    let a22 = a[2 * 4 + 2];
	    let a23 = a[2 * 4 + 3];
	    let a30 = a[3 * 4 + 0];
	    let a31 = a[3 * 4 + 1];
	    let a32 = a[3 * 4 + 2];
	    let a33 = a[3 * 4 + 3];
	 
	    return [
			b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
			b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
			b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
			b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
			b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
			b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
			b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
			b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
			b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
			b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
			b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
			b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
			b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
			b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
			b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
			b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
	    ];
	}


	// Invert a 4x4 matrix
	_inverseMatrix(m) {
		let m00 = m[0 * 4 + 0];
	    let m01 = m[0 * 4 + 1];
	    let m02 = m[0 * 4 + 2];
	    let m03 = m[0 * 4 + 3];
	    let m10 = m[1 * 4 + 0];
	    let m11 = m[1 * 4 + 1];
	    let m12 = m[1 * 4 + 2];
	    let m13 = m[1 * 4 + 3];
	    let m20 = m[2 * 4 + 0];
	    let m21 = m[2 * 4 + 1];
	    let m22 = m[2 * 4 + 2];
	    let m23 = m[2 * 4 + 3];
	    let m30 = m[3 * 4 + 0];
	    let m31 = m[3 * 4 + 1];
	    let m32 = m[3 * 4 + 2];
	    let m33 = m[3 * 4 + 3];
	    let tmp_0  = m22 * m33;
	    let tmp_1  = m32 * m23;
	    let tmp_2  = m12 * m33;
	    let tmp_3  = m32 * m13;
	    let tmp_4  = m12 * m23;
	    let tmp_5  = m22 * m13;
	    let tmp_6  = m02 * m33;
	    let tmp_7  = m32 * m03;
	    let tmp_8  = m02 * m23;
	    let tmp_9  = m22 * m03;
	    let tmp_10 = m02 * m13;
	    let tmp_11 = m12 * m03;
	    let tmp_12 = m20 * m31;
	    let tmp_13 = m30 * m21;
	    let tmp_14 = m10 * m31;
	    let tmp_15 = m30 * m11;
	    let tmp_16 = m10 * m21;
	    let tmp_17 = m20 * m11;
	    let tmp_18 = m00 * m31;
	    let tmp_19 = m30 * m01;
	    let tmp_20 = m00 * m21;
	    let tmp_21 = m20 * m01;
	    let tmp_22 = m00 * m11;
	    let tmp_23 = m10 * m01;

	    let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
	        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
	    let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
	        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
	    let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
	        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
	    let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
	        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

	    let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

	    return [
			d * t0,
			d * t1,
			d * t2,
			d * t3,
			d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
			    (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
			d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
			    (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
			d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
			    (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
			d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
			    (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
			d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
			    (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
			d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
			    (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
			d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
			    (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
			d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
			    (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
			d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
			    (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
			d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
			    (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
			d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
			    (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
			d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
			    (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
	    ];
	}
}