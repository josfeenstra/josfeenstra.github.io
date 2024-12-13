export class Vector {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static vector(x = 0.0, y = 0.0, z = 0.0) {
        return new Vector(x, y, z);
    }
}
export class Line {
    a;
    b;
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
    static line(a = Vector.vector(), b = Vector.vector()) {
        return new Line(a, b);
    }
}
