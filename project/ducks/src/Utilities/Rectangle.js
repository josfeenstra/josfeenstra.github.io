// Rectangle.js

class Rectangle {
	constructor(x, y, width, height, centerDefined = false) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		if (centerDefined) {
			this.x -= this.width / 2;
			this.y -= this.height / 2;
		}

		this.center = new Vector(this.x + this.width / 2, this.y + this.height / 2);
	}


	// Returns true if the vector is covered by the rectangle
	covers(vector, offset = 0) {
		if (vector == null) return false;

		if (vector.x > (this.x - offset) && vector.y > (this.y - offset) && vector.x < (this.x + this.width + offset) && this.y < (this.y + this.height + offset)) {
			return true;
		} else {
			return false;
		}
	}


	// Returns the center of the rectangle
	getCenter() {
		return new Vector(this.x + this.width / 2, this.y + this.height / 2);
	}
}