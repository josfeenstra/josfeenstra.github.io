/* tslint:disable */
/* eslint-disable */
/**
*/
export enum GeoType {
  Void,
  Int,
  Float,
  Point,
  Vector,
  Plane,
  Transform,
  MultiPoint,
  Json,
}
/**
*/
export enum GeoShaderType {
  Point,
  MultiPoint,
  PointCloud,
  BoundingBox,
  Plane,
  Mesh,
}
/**
*
* * A generic two dimensional array / matrix.
* * NOTE: using 'array2' instead of 2dVec or Matrix or something, to not confuse this one with Matrix4 and Vec3 types.  
* * NOTE: under construction
* 
*/
export class Array2 {
  free(): void;
/**
*/
  height: number;
/**
*/
  width: number;
}
/**
*/
export class Basics {
  free(): void;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
  static add(a: number, b: number): number;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
  static sub(a: number, b: number): number;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
  static mul(a: number, b: number): number;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
  static div(a: number, b: number): number;
/**
* @param {number} a
* @returns {number}
*/
  static sin(a: number): number;
/**
* @param {number} a
* @returns {number}
*/
  static cos(a: number): number;
/**
* @param {number} a
* @returns {number}
*/
  static tan(a: number): number;
}
/**
*/
export class BoundingBox {
  free(): void;
/**
* @param {Point} min
* @param {Point} max
* @returns {BoundingBox}
*/
  static new(min: Point, max: Point): BoundingBox;
/**
* @param {number} x1
* @param {number} y1
* @param {number} z1
* @param {number} x2
* @param {number} y2
* @param {number} z2
* @returns {BoundingBox}
*/
  static new_from_bounds(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): BoundingBox;
/**
* @param {number} x
* @param {number} y
* @param {number} z
* @returns {BoundingBox}
*/
  static new_from_radii(x: number, y: number, z: number): BoundingBox;
}
/**
*/
export class Logic {
  free(): void;
/**
* @param {boolean} a
* @param {boolean} b
* @returns {boolean}
*/
  static and(a: boolean, b: boolean): boolean;
/**
* @param {boolean} a
* @param {boolean} b
* @returns {boolean}
*/
  static or(a: boolean, b: boolean): boolean;
/**
* @param {boolean} a
* @returns {boolean}
*/
  static not(a: boolean): boolean;
/**
* @param {number} a
* @param {number} b
* @returns {boolean}
*/
  static equals(a: number, b: number): boolean;
/**
* @param {number} a
* @param {number} b
* @returns {boolean}
*/
  static smaller(a: number, b: number): boolean;
/**
* @param {number} a
* @param {number} b
* @returns {boolean}
*/
  static greater(a: number, b: number): boolean;
/**
* @param {number} a
* @param {number} b
* @returns {boolean}
*/
  static smaller_or_equals(a: number, b: number): boolean;
/**
* @param {number} a
* @param {number} b
* @returns {boolean}
*/
  static greater_or_equals(a: number, b: number): boolean;
}
/**
*/
export class Misc {
  free(): void;
/**
* @param {Float64Array} verts
* @param {Uint32Array} faces
* @returns {string}
*/
  static write_obj(verts: Float64Array, faces: Uint32Array): string;
/**
* @param {Float64Array} positions
* @returns {Uint8Array}
*/
  static write_las(positions: Float64Array): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {Float64Array}
*/
  static load_las(buffer: Uint8Array): Float64Array;
}
/**
*/
export class MultiPoint {
  free(): void;
/**
* @returns {MultiPoint}
*/
  static new(): MultiPoint;
/**
* @param {Float64Array} data
* @returns {MultiPoint}
*/
  static new_from_array(data: Float64Array): MultiPoint;
/**
* @param {Pointcloud} pc
* @returns {MultiPoint}
*/
  static new_from_pointcloud(pc: Pointcloud): MultiPoint;
/**
* @param {Point} pt
*/
  push_pt(pt: Point): void;
/**
* @param {number} scalar
*/
  scale(scalar: number): void;
/**
*
*     * Get a copy of the data array within
*     
* @returns {Float64Array}
*/
  get_data(): Float64Array;
/**
* @returns {BoundingBox}
*/
  calc_bounding_box(): BoundingBox;
/**
* @returns {boolean}
*/
  static gf_has_trait_renderable(): boolean;
/**
* @returns {number}
*/
  static gf_get_shader_type(): number;
/**
* @returns {any}
*/
  gf_get_bounding_box(): any;
/**
* @returns {any}
*/
  gf_get_buffers(): any;
}
/**
*/
export class Point {
  free(): void;
/**
* @param {number} x
* @param {number} y
* @param {number} z
* @returns {Point}
*/
  static new(x: number, y: number, z: number): Point;
/**
* @param {number} x
* @param {number} y
* @param {number} z
*/
  add_num(x: number, y: number, z: number): void;
/**
* @returns {boolean}
*/
  static gf_has_trait_typed(): boolean;
/**
* @param {number} gt
* @returns {boolean}
*/
  static gf_is_convertable_to(gt: number): boolean;
/**
* @returns {Point}
*/
  static gf_default(): Point;
/**
* @returns {any}
*/
  gf_to_json(): any;
/**
* @param {any} val
* @returns {Point}
*/
  static gf_from_json(val: any): Point;
/**
* @returns {boolean}
*/
  static gf_has_trait_descriptive(): boolean;
/**
* @returns {any}
*/
  static gf_get_description(): any;
/**
* @returns {boolean}
*/
  static gf_has_trait_iterable(): boolean;
/**
* @returns {number}
*/
  static gf_get_base_type(): number;
/**
* @returns {number}
*/
  gf_get_length(): number;
/**
* @param {number} index
* @returns {number | undefined}
*/
  gf_get_item(index: number): number | undefined;
}
/**
*/
export class Pointcloud {
  free(): void;
/**
* @param {Uint8Array} buffer
* @returns {Pointcloud}
*/
  static new_from_buffer(buffer: Uint8Array): Pointcloud;
/**
* @returns {Uint8Array}
*/
  version(): Uint8Array;
/**
* @returns {Float64Array}
*/
  bounds(): Float64Array;
/**
* @returns {Float64Array}
*/
  to_array(): Float64Array;
/**
* @param {Uint8Array} buffer
* @returns {number}
*/
  static length_of_buffer(buffer: Uint8Array): number;
/**
* @returns {boolean}
*/
  static gf_has_trait_renderable(): boolean;
/**
* @returns {number}
*/
  static gf_get_shader_type(): number;
/**
* @returns {any}
*/
  gf_get_bounding_box(): any;
}
/**
*
* * Basic rng
* 
*/
export class Random {
  free(): void;
/**
* @returns {Random}
*/
  static new(): Random;
/**
* @param {number} n
* @returns {Random}
*/
  static new_from_seed(n: number): Random;
/**
* @param {number} count
* @param {BoundingBox} bounds
* @returns {MultiPoint}
*/
  spawn_points(count: number, bounds: BoundingBox): MultiPoint;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_logic_free: (a: number) => void;
  readonly logic_and: (a: number, b: number) => number;
  readonly logic_or: (a: number, b: number) => number;
  readonly logic_not: (a: number) => number;
  readonly logic_equals: (a: number, b: number) => number;
  readonly logic_smaller: (a: number, b: number) => number;
  readonly logic_greater: (a: number, b: number) => number;
  readonly logic_smaller_or_equals: (a: number, b: number) => number;
  readonly logic_greater_or_equals: (a: number, b: number) => number;
  readonly start: () => void;
  readonly __wbg_boundingbox_free: (a: number) => void;
  readonly boundingbox_new: (a: number, b: number) => number;
  readonly boundingbox_new_from_bounds: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly boundingbox_new_from_radii: (a: number, b: number, c: number) => number;
  readonly __wbg_basics_free: (a: number) => void;
  readonly basics_add: (a: number, b: number) => number;
  readonly basics_sub: (a: number, b: number) => number;
  readonly basics_mul: (a: number, b: number) => number;
  readonly basics_div: (a: number, b: number) => number;
  readonly basics_sin: (a: number) => number;
  readonly basics_cos: (a: number) => number;
  readonly basics_tan: (a: number) => number;
  readonly __wbg_pointcloud_free: (a: number) => void;
  readonly pointcloud_new_from_buffer: (a: number, b: number) => number;
  readonly pointcloud_version: (a: number, b: number) => void;
  readonly pointcloud_bounds: (a: number, b: number) => void;
  readonly pointcloud_to_array: (a: number, b: number) => void;
  readonly pointcloud_length_of_buffer: (a: number, b: number) => number;
  readonly pointcloud_gf_has_trait_renderable: () => number;
  readonly pointcloud_gf_get_shader_type: () => number;
  readonly pointcloud_gf_get_bounding_box: (a: number) => number;
  readonly __wbg_point_free: (a: number) => void;
  readonly point_new: (a: number, b: number, c: number) => number;
  readonly point_add_num: (a: number, b: number, c: number, d: number) => void;
  readonly point_gf_has_trait_typed: () => number;
  readonly point_gf_is_convertable_to: (a: number) => number;
  readonly point_gf_default: () => number;
  readonly point_gf_to_json: (a: number) => number;
  readonly point_gf_from_json: (a: number) => number;
  readonly point_gf_has_trait_descriptive: () => number;
  readonly point_gf_get_description: () => number;
  readonly point_gf_has_trait_iterable: () => number;
  readonly point_gf_get_base_type: () => number;
  readonly point_gf_get_length: (a: number) => number;
  readonly point_gf_get_item: (a: number, b: number, c: number) => void;
  readonly __wbg_misc_free: (a: number) => void;
  readonly misc_write_obj: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly misc_write_las: (a: number, b: number, c: number) => void;
  readonly misc_load_las: (a: number, b: number, c: number) => void;
  readonly __wbg_array2_free: (a: number) => void;
  readonly __wbg_get_array2_width: (a: number) => number;
  readonly __wbg_set_array2_width: (a: number, b: number) => void;
  readonly __wbg_get_array2_height: (a: number) => number;
  readonly __wbg_set_array2_height: (a: number, b: number) => void;
  readonly __wbg_random_free: (a: number) => void;
  readonly random_new: () => number;
  readonly random_new_from_seed: (a: number) => number;
  readonly random_spawn_points: (a: number, b: number, c: number) => number;
  readonly __wbg_multipoint_free: (a: number) => void;
  readonly multipoint_new: () => number;
  readonly multipoint_new_from_array: (a: number, b: number) => number;
  readonly multipoint_new_from_pointcloud: (a: number) => number;
  readonly multipoint_push_pt: (a: number, b: number) => void;
  readonly multipoint_scale: (a: number, b: number) => void;
  readonly multipoint_get_data: (a: number, b: number) => void;
  readonly multipoint_calc_bounding_box: (a: number) => number;
  readonly multipoint_gf_has_trait_renderable: () => number;
  readonly multipoint_gf_get_shader_type: () => number;
  readonly multipoint_gf_get_bounding_box: (a: number) => number;
  readonly multipoint_gf_get_buffers: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_start: () => void;
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
