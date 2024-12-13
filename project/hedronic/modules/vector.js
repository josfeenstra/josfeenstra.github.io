export class Vector {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static newVector(x = 0.0, y = 0.0, z = 0.0) {
        return new Vector(x, y, z);
    }
    decompose() {
        return [this.x, this.y, this.z];
    }
}
export class Line {
    a;
    b;
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
    static newLine(a = Vector.newVector(), b = Vector.newVector()) {
        return new Line(a, b);
    }
    decompose() {
        return [this.a, this.b];
    }
}
