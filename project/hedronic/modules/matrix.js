export class U16Matrix {
    width;
    height;
    data;
    constructor(width, height, data) {
        this.width = width;
        this.height = height;
        this.data = data;
    }
    static U16Matrix(width = 3, height = 3, setter) {
        let data = new Uint16Array(width * height);
        if (setter)
            data.set(setter);
        return new U16Matrix(width, height, data);
    }
}
export class F32Matrix {
    width;
    height;
    data;
    constructor(width, height, data) {
        this.width = width;
        this.height = height;
        this.data = data;
    }
    static F32Matrix(width = 3, height = 3, setter) {
        let data = new Float32Array(width * height);
        if (setter)
            data.set(setter);
        return new F32Matrix(width, height, data);
    }
}
export class Mesh {
    points;
    links;
    constructor(points, links) {
        this.points = points;
        this.links = links;
    }
}
