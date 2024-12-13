
let wasm;

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
/**
*/
export function start() {
    wasm.start();
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

function getArrayF64FromWasm0(ptr, len) {
    return getFloat64Memory0().subarray(ptr / 8, ptr / 8 + len);
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8);
    getFloat64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
export const GeoType = Object.freeze({ Void:0,"0":"Void",Int:1,"1":"Int",Float:2,"2":"Float",Point:3,"3":"Point",Vector:4,"4":"Vector",Plane:5,"5":"Plane",Transform:6,"6":"Transform",MultiPoint:7,"7":"MultiPoint",Json:8,"8":"Json", });
/**
*/
export const GeoShaderType = Object.freeze({ Point:0,"0":"Point",MultiPoint:1,"1":"MultiPoint",PointCloud:2,"2":"PointCloud",BoundingBox:3,"3":"BoundingBox",Plane:4,"4":"Plane",Mesh:5,"5":"Mesh", });
/**
*
* * A generic two dimensional array / matrix.
* * NOTE: using 'array2' instead of 2dVec or Matrix or something, to not confuse this one with Matrix4 and Vec3 types.
* * NOTE: under construction
*
*/
export class Array2 {

    toJSON() {
        return {
            width: this.width,
            height: this.height,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_array2_free(ptr);
    }
    /**
    */
    get width() {
        var ret = wasm.__wbg_get_array2_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set width(arg0) {
        wasm.__wbg_set_array2_width(this.ptr, arg0);
    }
    /**
    */
    get height() {
        var ret = wasm.__wbg_get_array2_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set height(arg0) {
        wasm.__wbg_set_array2_height(this.ptr, arg0);
    }
}
/**
*/
export class Basics {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_basics_free(ptr);
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    static add(a, b) {
        var ret = wasm.basics_add(a, b);
        return ret;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    static sub(a, b) {
        var ret = wasm.basics_sub(a, b);
        return ret;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    static mul(a, b) {
        var ret = wasm.basics_mul(a, b);
        return ret;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    static div(a, b) {
        var ret = wasm.basics_div(a, b);
        return ret;
    }
    /**
    * @param {number} a
    * @returns {number}
    */
    static sin(a) {
        var ret = wasm.basics_sin(a);
        return ret;
    }
    /**
    * @param {number} a
    * @returns {number}
    */
    static cos(a) {
        var ret = wasm.basics_cos(a);
        return ret;
    }
    /**
    * @param {number} a
    * @returns {number}
    */
    static tan(a) {
        var ret = wasm.basics_tan(a);
        return ret;
    }
}
/**
*/
export class BoundingBox {

    static __wrap(ptr) {
        const obj = Object.create(BoundingBox.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_boundingbox_free(ptr);
    }
    /**
    * @param {Point} min
    * @param {Point} max
    * @returns {BoundingBox}
    */
    static new(min, max) {
        _assertClass(min, Point);
        var ptr0 = min.ptr;
        min.ptr = 0;
        _assertClass(max, Point);
        var ptr1 = max.ptr;
        max.ptr = 0;
        var ret = wasm.boundingbox_new(ptr0, ptr1);
        return BoundingBox.__wrap(ret);
    }
    /**
    * @param {number} x1
    * @param {number} y1
    * @param {number} z1
    * @param {number} x2
    * @param {number} y2
    * @param {number} z2
    * @returns {BoundingBox}
    */
    static new_from_bounds(x1, y1, z1, x2, y2, z2) {
        var ret = wasm.boundingbox_new_from_bounds(x1, y1, z1, x2, y2, z2);
        return BoundingBox.__wrap(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @returns {BoundingBox}
    */
    static new_from_radii(x, y, z) {
        var ret = wasm.boundingbox_new_from_radii(x, y, z);
        return BoundingBox.__wrap(ret);
    }
}
/**
*/
export class Logic {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_logic_free(ptr);
    }
    /**
    * @param {boolean} a
    * @param {boolean} b
    * @returns {boolean}
    */
    static and(a, b) {
        var ret = wasm.logic_and(a, b);
        return ret !== 0;
    }
    /**
    * @param {boolean} a
    * @param {boolean} b
    * @returns {boolean}
    */
    static or(a, b) {
        var ret = wasm.logic_or(a, b);
        return ret !== 0;
    }
    /**
    * @param {boolean} a
    * @returns {boolean}
    */
    static not(a) {
        var ret = wasm.logic_not(a);
        return ret !== 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {boolean}
    */
    static equals(a, b) {
        var ret = wasm.logic_equals(a, b);
        return ret !== 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {boolean}
    */
    static smaller(a, b) {
        var ret = wasm.logic_smaller(a, b);
        return ret !== 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {boolean}
    */
    static greater(a, b) {
        var ret = wasm.logic_greater(a, b);
        return ret !== 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {boolean}
    */
    static smaller_or_equals(a, b) {
        var ret = wasm.logic_smaller_or_equals(a, b);
        return ret !== 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {boolean}
    */
    static greater_or_equals(a, b) {
        var ret = wasm.logic_greater_or_equals(a, b);
        return ret !== 0;
    }
}
/**
*/
export class Misc {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_misc_free(ptr);
    }
    /**
    * @param {Float64Array} verts
    * @param {Uint32Array} faces
    * @returns {string}
    */
    static write_obj(verts, faces) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passArrayF64ToWasm0(verts, wasm.__wbindgen_malloc);
            var len0 = WASM_VECTOR_LEN;
            var ptr1 = passArray32ToWasm0(faces, wasm.__wbindgen_malloc);
            var len1 = WASM_VECTOR_LEN;
            wasm.misc_write_obj(retptr, ptr0, len0, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {Float64Array} positions
    * @returns {Uint8Array}
    */
    static write_las(positions) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passArrayF64ToWasm0(positions, wasm.__wbindgen_malloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.misc_write_las(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {Float64Array}
    */
    static load_las(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.misc_load_las(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class MultiPoint {

    static __wrap(ptr) {
        const obj = Object.create(MultiPoint.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_multipoint_free(ptr);
    }
    /**
    * @returns {MultiPoint}
    */
    static new() {
        var ret = wasm.multipoint_new();
        return MultiPoint.__wrap(ret);
    }
    /**
    * @param {Float64Array} data
    * @returns {MultiPoint}
    */
    static new_from_array(data) {
        var ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.multipoint_new_from_array(ptr0, len0);
        return MultiPoint.__wrap(ret);
    }
    /**
    * @param {Pointcloud} pc
    * @returns {MultiPoint}
    */
    static new_from_pointcloud(pc) {
        _assertClass(pc, Pointcloud);
        var ret = wasm.multipoint_new_from_pointcloud(pc.ptr);
        return MultiPoint.__wrap(ret);
    }
    /**
    * @param {Point} pt
    */
    push_pt(pt) {
        _assertClass(pt, Point);
        var ptr0 = pt.ptr;
        pt.ptr = 0;
        wasm.multipoint_push_pt(this.ptr, ptr0);
    }
    /**
    * @param {number} scalar
    */
    scale(scalar) {
        wasm.multipoint_scale(this.ptr, scalar);
    }
    /**
    *
    *     * Get a copy of the data array within
    *
    * @returns {Float64Array}
    */
    get_data() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.multipoint_get_data(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {BoundingBox}
    */
    calc_bounding_box() {
        var ret = wasm.multipoint_calc_bounding_box(this.ptr);
        return BoundingBox.__wrap(ret);
    }
    /**
    * @returns {boolean}
    */
    static gf_has_trait_renderable() {
        var ret = wasm.multipoint_gf_has_trait_renderable();
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    static gf_get_shader_type() {
        var ret = wasm.multipoint_gf_get_shader_type();
        return ret >>> 0;
    }
    /**
    * @returns {any}
    */
    gf_get_bounding_box() {
        var ret = wasm.multipoint_gf_get_bounding_box(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {any}
    */
    gf_get_buffers() {
        var ret = wasm.multipoint_gf_get_buffers(this.ptr);
        return takeObject(ret);
    }
}
/**
*/
export class Point {

    static __wrap(ptr) {
        const obj = Object.create(Point.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_point_free(ptr);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @returns {Point}
    */
    static new(x, y, z) {
        var ret = wasm.point_new(x, y, z);
        return Point.__wrap(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} z
    */
    add_num(x, y, z) {
        wasm.point_add_num(this.ptr, x, y, z);
    }
    /**
    * @returns {boolean}
    */
    static gf_has_trait_typed() {
        var ret = wasm.point_gf_has_trait_typed();
        return ret !== 0;
    }
    /**
    * @param {number} gt
    * @returns {boolean}
    */
    static gf_is_convertable_to(gt) {
        var ret = wasm.point_gf_is_convertable_to(gt);
        return ret !== 0;
    }
    /**
    * @returns {Point}
    */
    static gf_default() {
        var ret = wasm.point_gf_default();
        return Point.__wrap(ret);
    }
    /**
    * @returns {any}
    */
    gf_to_json() {
        var ret = wasm.point_gf_to_json(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} val
    * @returns {Point}
    */
    static gf_from_json(val) {
        try {
            var ret = wasm.point_gf_from_json(addBorrowedObject(val));
            return Point.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {boolean}
    */
    static gf_has_trait_descriptive() {
        var ret = wasm.point_gf_has_trait_descriptive();
        return ret !== 0;
    }
    /**
    * @returns {any}
    */
    static gf_get_description() {
        var ret = wasm.point_gf_get_description();
        return takeObject(ret);
    }
    /**
    * @returns {boolean}
    */
    static gf_has_trait_iterable() {
        var ret = wasm.point_gf_has_trait_iterable();
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    static gf_get_base_type() {
        var ret = wasm.point_gf_get_base_type();
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    gf_get_length() {
        var ret = wasm.point_gf_get_length(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} index
    * @returns {number | undefined}
    */
    gf_get_item(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.point_gf_get_item(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r2 = getFloat64Memory0()[retptr / 8 + 1];
            return r0 === 0 ? undefined : r2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class Pointcloud {

    static __wrap(ptr) {
        const obj = Object.create(Pointcloud.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pointcloud_free(ptr);
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {Pointcloud}
    */
    static new_from_buffer(buffer) {
        var ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.pointcloud_new_from_buffer(ptr0, len0);
        return Pointcloud.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    version() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pointcloud_version(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Float64Array}
    */
    bounds() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pointcloud_bounds(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Float64Array}
    */
    to_array() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pointcloud_to_array(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {number}
    */
    static length_of_buffer(buffer) {
        var ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.pointcloud_length_of_buffer(ptr0, len0);
        return ret;
    }
    /**
    * @returns {boolean}
    */
    static gf_has_trait_renderable() {
        var ret = wasm.pointcloud_gf_has_trait_renderable();
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    static gf_get_shader_type() {
        var ret = wasm.pointcloud_gf_get_shader_type();
        return ret >>> 0;
    }
    /**
    * @returns {any}
    */
    gf_get_bounding_box() {
        var ret = wasm.pointcloud_gf_get_bounding_box(this.ptr);
        return takeObject(ret);
    }
}
/**
*
* * Basic rng
*
*/
export class Random {

    static __wrap(ptr) {
        const obj = Object.create(Random.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_random_free(ptr);
    }
    /**
    * @returns {Random}
    */
    static new() {
        var ret = wasm.random_new();
        return Random.__wrap(ret);
    }
    /**
    * @param {number} n
    * @returns {Random}
    */
    static new_from_seed(n) {
        var ret = wasm.random_new_from_seed(n);
        return Random.__wrap(ret);
    }
    /**
    * @param {number} count
    * @param {BoundingBox} bounds
    * @returns {MultiPoint}
    */
    spawn_points(count, bounds) {
        _assertClass(bounds, BoundingBox);
        var ret = wasm.random_spawn_points(this.ptr, count, bounds.ptr);
        return MultiPoint.__wrap(ret);
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('std_gf_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
        var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = JSON.stringify(obj === undefined ? null : obj);
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_new_693216e109162396 = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_process_e56fd54cf6319b6c = function(arg0) {
        var ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        var ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_versions_77e21455908dad33 = function(arg0) {
        var ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_0dd25d832e4785d5 = function(arg0) {
        var ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        var ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_require_0db1598d9ccecb30 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_crypto_b95d7173266618a9 = function(arg0) {
        var ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_msCrypto_5a86d77a66230f81 = function(arg0) {
        var ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getRandomValues_b14734aa289bc356 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_static_accessor_NODE_MODULE_26b231378c1be7dd = function() {
        var ret = module;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_91e2b39becca6147 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_newnoargs_f579424187aa1717 = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_89558c3e96703ca1 = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_self_e23d74ae45fb17d1 = function() { return handleError(function () {
        var ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_b4be7f48b24ac56e = function() { return handleError(function () {
        var ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_d61b1f48a57191ae = function() { return handleError(function () {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_e7669da72fd7f239 = function() { return handleError(function () {
        var ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_buffer_5e74a88a1424a2e0 = function(arg0) {
        var ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_e3b800e570795b3c = function(arg0) {
        var ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_5b8081e9d002f0df = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_length_30803400a8f15c59 = function(arg0) {
        var ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_5f4ce114a24dfe1e = function(arg0) {
        var ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_a68f835ca2af506f = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        var ret = wasm.memory;
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    wasm.__wbindgen_start();
    return wasm;
}

export default init;

