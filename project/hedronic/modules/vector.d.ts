export declare class Vector {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    static newVector(x?: number, y?: number, z?: number): Vector;
    decompose(): [number, number, number];
}
export declare class Line {
    a: Vector;
    b: Vector;
    constructor(a: Vector, b: Vector);
    static newLine(a?: Vector, b?: Vector): Line;
    decompose(): [Vector, Vector];
}
