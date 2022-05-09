// Vector class

class Vector {
	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	static zero() {
		return new Vector(0,0,0);
	}

	static new(x,y,z) {
		return new Vector(x, y, z);
	}

	static unitX() {
		return new Vector(1,0,0);
	}

	static unitY() {
		return new Vector(0,1,0);
	}

    static fromLerp(v1=Vector.new(0,0,0), v2=Vector.new(0,0,0), alpha=0.5) {
        return new Vector(
            v1.x + (v2.x - v1.x) * alpha,
            v1.y + (v2.y - v1.y) * alpha,
            v1.z + (v2.z - v1.z) * alpha,
        );
    }

	// this is needed for graph things
	static calculateWheelOrder(vectors=[Vector.new(0,0,0)], ihat=Vector.new(0,0,0), jhat=Vector.new(0,0,0)) {

        let angles = [];
        vectors.forEach((v) => {
            angles.push(new Vector(v.dot(ihat), v.dot(jhat)).angle());
        });

        // @ts-ignore
        let ids = Util.range(vectors.length);
        ids.sort((a, b) => {
            return angles[a] - angles[b];
        });
        return ids;
    }

	angle() {
        // computes the angle in radians with respect to the positive x-axis
        const angle = Math.atan2(-this.y, -this.x) + Math.PI;
        return angle;
    }

	normalize() {
		const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		return new Vector(this.x / length, this.y / length, this.z / length);
	}


	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}


	distance(vector) {
		if (vector.equals(this)) return 0;
		return Math.sqrt((this.x - vector.x) * (this.x - vector.x) + (this.y - vector.y) * (this.y - vector.y) + (this.z - vector.z) * (this.z - vector.z));
	}


	add(other) {
		return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
	}


	addN(x=0, y=0, z=0) {
		return new Vector(this.x + x, this.y + y, this.z + z);
	}

	subtract(other) {
		return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
	}


	multiply(scalar) {
		return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
	}


	scale(scalar) {
		return this.multiply(scalar)
	}


	scaleWithVector(vector) {
		return new Vector(this.x * vector.x, this.y * vector.y, this.z * vector.z);
	}


	inverse() {
		return new Vector(-this.x, -this.y, -this.z);
	}


	rotate(pivot, beta) {
	  let diff = this.add(pivot.inverse());

	  let rotated = new Vector(
	      Math.cos(beta) * diff.x - Math.sin(beta) * diff.y,
	      Math.sin(beta) * diff.x + Math.cos(beta) * diff.y,
	  );

	  return pivot.add(rotated);
	}


	clone() {
		return new Vector(this.x, this.y, this.z);
	}


	round() {
		return new Vector(Math.round(this.x), Math.round(this.y), Math.round(this.z));
	}


	floor() {
		return new Vector(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
	}


	ceil() {
		return new Vector(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
	}


	equals(other) {
		return this.x === other.x && this.y === other.y && this.z === other.z;
	}


	dot(other) {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}


	cross(other) {
		return new Vector(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
	}

  
	project(other) {
		return other.scale(this.dot(other));
	}


	toRadians() {
		return new Vector(this.x / 180.0 * Math.PI, this.y / 180.0 * Math.PI);
	}

	polarAngles() {
		const normal = new Vector(0.0, 1.0, 0.0);
		let projection = this.subtract(normal.scale(normal.dot(this)));
		
		const phi = Math.atan2(projection.z, projection.x);
		const phiNormal = new Vector(Math.cos(phi), 0.0, Math.sin(phi));

		const theta = Math.atan2(normal.dot(this), phiNormal.dot(this));

		return [theta, phi];
	}

  
	toArray() {
		return [this.x, this.y, this.z];
	}
}
