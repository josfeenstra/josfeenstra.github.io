export function AND(a, b) { 
    return [a && b];
}

export function NOT(a) {
    return [!a];
}

export function OR(a, b) { 
    return [a || b];
}

export function NAND(a, b) { 
    let [c] = boolean.AND(a, b);
    let [d] = boolean.NOT(c);
    return [d]; 
}

export function XOR(a, b) { 
    let [c] = boolean.NAND(a, b);
    let [d] = boolean.OR(a, b);
    let [e] = boolean.AND(c, d); 
    return [e]; 
}