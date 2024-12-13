export declare class XYZ {
    trait: "table";
    header: string[];
    width: number;
    height: number;
    buffer: Float32Array;
}
export declare class MultiVector3 {
    trait: "multi-vector-3";
    buffer: Float32Array;
}
export declare class MyVector {
    x: number;
    y: number;
    z: number;
}
export declare function readXYZ(text: string): XYZ;
export declare function xyzToMultiVector3(xyz: XYZ): MultiVector3;
export declare function MultiVector3ToXYX(mv: MultiVector3): XYZ;
export declare function writeXYZ(xyz: XYZ): string;
export declare function iterate(multiVector: MultiVector3): MyVector[];
/**
 * Add two Vectors
 */
export declare function add(a: MyVector, b: MyVector): {
    x: number;
    y: number;
    z: number;
};
/**
 * How to deal with generics / traits ?
 */
export declare function move(geometry: any, mover: MyVector): void;
export declare function aggregate(vectorList: MyVector[]): MultiVector3;
