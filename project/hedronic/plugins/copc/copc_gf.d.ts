/* tslint:disable */
/* eslint-disable */
/**
*/
export function start(): void;
/**
*/
export class Class {
  free(): void;
}
/**
*/
export class Copc {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {Copc}
*/
  static new_from_buffer(buffer: Uint8Array): Copc;
/**
* @param {number} classification
* @returns {Float64Array}
*/
  get_lod_zero(classification: number): Float64Array;
/**
*/
  header(): void;
/**
* @returns {bigint}
*/
  get_point_count(): bigint;
}
/**
*/
export class DumbHelpers {
  free(): void;
/**
* @param {Float64Array} arr
* @param {number} scalar
* @returns {Float64Array}
*/
  static scale_array(arr: Float64Array, scalar: number): Float64Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_copc_free: (a: number) => void;
  readonly copc_new_from_buffer: (a: number, b: number) => number;
  readonly copc_get_lod_zero: (a: number, b: number, c: number) => void;
  readonly copc_header: (a: number) => void;
  readonly copc_get_point_count: (a: number, b: number) => void;
  readonly __wbg_class_free: (a: number) => void;
  readonly __wbg_dumbhelpers_free: (a: number) => void;
  readonly dumbhelpers_scale_array: (a: number, b: number, c: number, d: number) => void;
  readonly start: () => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_start: () => void;
}

/**
* Synchronously compiles the given `bytes` and instantiates the WebAssembly module.
*
* @param {BufferSource} bytes
*
* @returns {InitOutput}
*/
export function initSync(bytes: BufferSource): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
