export async function fetchJson(path) {
    let data = await fetch(path);
    return await data.json();
}
export async function fetchText(path) {
    let data = await fetch(path);
    return await data.text();
}
export function asNumber(n) {
    return Number(n);
}
export function asBoolean(n) {
    return Boolean(n);
}
export function asString(n) {
    return String(n);
}
export function toJson(text) {
    return JSON.parse(text);
}
export function decode(text) {
    return JSON.parse(text);
}
export function encode(json) {
    return JSON.stringify(json);
}
export function stringify(json) {
    return JSON.stringify(json);
}
export function asList(any) {
    return any;
}
export function log(data) {
    console.log(data);
}
export function numberFromBinary(a, b, c, d, e, f, g, h) {
    let n = 0;
    let bools = [a, b, c, d, e, f, g, h];
    for (let i = 0; i < 8; i++) {
        n += (bools[i] ? 1 : 0) * Math.pow(2, i);
    }
    return n;
}
export function toBinary(n) {
    let binify = (i) => {
        let val = Math.pow(2, i);
        if (n >= val) {
            n = n - val;
            return true;
        }
        else {
            ;
            return false;
        }
        ;
    };
    let h = binify(7);
    let g = binify(6);
    let f = binify(5);
    let e = binify(4);
    let d = binify(3);
    let c = binify(2);
    let b = binify(1);
    let a = binify(0);
    return [a, b, c, d, e, f, g, h];
}
