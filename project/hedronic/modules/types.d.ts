export declare class Vector {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    static vector(x?: number, y?: number, z?: number): Vector;
}
export declare class Line {
    a: Vector;
    b: Vector;
    constructor(a: Vector, b: Vector);
    static line(a?: Vector, b?: Vector): Line;
}
