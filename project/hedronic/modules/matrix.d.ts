export declare class U16Matrix {
    readonly width: number;
    readonly height: number;
    data: Uint16Array;
    constructor(width: number, height: number, data: Uint16Array);
    static U16Matrix(width?: number, height?: number, setter?: Uint16Array): U16Matrix;
}
export declare class F32Matrix {
    readonly width: number;
    readonly height: number;
    data: Float32Array;
    constructor(width: number, height: number, data: Float32Array);
    static F32Matrix(width?: number, height?: number, setter?: Float32Array): F32Matrix;
}
export declare class Mesh {
    points: F32Matrix;
    links: U16Matrix;
    constructor(points: F32Matrix, links: U16Matrix);
}
