export declare function add(a: number, b: number): number;
export declare function substract(a: number, b: number): number;
export declare function multiply(a: number, b: number): number;
export declare function divide(a: number, b: number): number;
export declare function power(a: number, b: number): number;
/**
 * Pseudo random number generator. based on simple fast counter (sfc32)
 * https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
 */
export declare class RNG {
    private a;
    private b;
    private c;
    private d;
    private constructor();
    static new(): RNG;
    static newFromSeed(n: number): RNG;
    static newFromHash(seed: string): RNG;
    /**
     * number in between 0 and 1
     */
    number(): number;
    array(length: number): Float64Array;
}
