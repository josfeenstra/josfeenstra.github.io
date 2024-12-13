/* tslint:disable */
/* eslint-disable */
/**
* @param {number} left
* @param {number} right
* @returns {number}
*/
export function add(left: number, right: number): number;
/**
*/
export class Point {
  free(): void;
/**
* @param {number} x
* @param {number} y
* @returns {Point}
*/
  static new(x: number, y: number): Point;
/**
* @param {Point} other
* @returns {number}
*/
  distance(other: Point): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly add: (a: number, b: number) => number;
  readonly __wbg_point_free: (a: number) => void;
  readonly point_new: (a: number, b: number) => number;
  readonly point_distance: (a: number, b: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
