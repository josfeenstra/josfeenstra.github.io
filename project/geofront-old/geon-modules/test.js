export function toNumber(n) {
    n = Number(n);
    return [n];
}

export function toBoolean(n) {
    n = Boolean(n);
    return [n];
}

export function toString(n) {
    n = String(n);
    return [n];
}

export function numberFromBinary(a,b,c,d,e,f,g,h) {
    let n = 0;
    let bools = [a,b,c,d,e,f,g,h];
    for (let i = 0 ; i < 8; i++) {
        n += bools[i] * Math.pow(2, i);
    } 
    return [n];
}

export function toBinary(n) {
    let binify = (i) => { let val = Math.pow(2, i);
        console.log(val, n);
        if (n >= val) { n = n - val;
            return true;
        } else { ;
            return false;
        };
    };
    let h = binify(7);
    let g = binify(6);
    let f = binify(5);
    let e = binify(4);
    let d = binify(3);
    let c = binify(2);
    let b = binify(1);
    let a = binify(0);
    return [a,b,c,d,e,f,g,h];
}