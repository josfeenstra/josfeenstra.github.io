/* tslint:disable */
/* eslint-disable */
/**
*/
export class CityJsonValidator {
  free(): void;
/**
* @param {string} schema_string
* @returns {CityJsonValidator}
*/
  static new_from_string(schema_string: string): CityJsonValidator;
/**
* @param {string} instance_string
* @returns {boolean}
*/
  validate_from_str(instance_string: string): boolean;
/**
* TODO: this would spit out the gathered errors in an ideal world. 
*
* [JF]: Haven't done it yet, since rust's borrow checker doesnt like it if I gather errors during non-mutable function calls. 
* @returns {string}
*/
  static get_errors(): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_cityjsonvalidator_free: (a: number) => void;
  readonly cityjsonvalidator_new_from_string: (a: number, b: number) => number;
  readonly cityjsonvalidator_validate_from_str: (a: number, b: number, c: number) => number;
  readonly cityjsonvalidator_get_errors: (a: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
