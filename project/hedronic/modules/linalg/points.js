export class XYZ {
    trait;
    header;
    width;
    height;
    buffer;
}
export class MultiVector3 {
    trait;
    buffer;
}
export class MyVector {
    x;
    y;
    z;
}
export function readXYZ(text) {
    const lines = text.split("\n");
    if (lines.length == 0)
        throw new Error("File is empty");
    const header = lines[0].trim().split(' ');
    const width = header.length;
    const data = new Float32Array((lines.length - 1) * width);
    let height = 0;
    for (let i = 0; i < lines.length - 1; i++) {
        const str = lines[i + 1].trim();
        if (str == "")
            continue;
        const parts = str.split(' ');
        for (let [j, part] of parts.entries()) {
            data[i * width + j] = parseFloat(part);
        }
        height += 1;
    }
    return { trait: "table", buffer: data.slice(0, width * height), width, height, header };
}
export function xyzToMultiVector3(xyz) {
    const { header, width, buffer, height } = xyz;
    // see if we can do a direct pass-through
    if (header.length == 3 &&
        header[0] == 'x' &&
        header[1] == 'y' &&
        header[2] == 'z') {
        return { trait: "multi-vector-3", buffer: buffer };
    }
    // if not, stitch a new buffer together from the right columns
    const newBuffer = new Float32Array(height * 3);
    let xindex = header.indexOf('x');
    let yindex = header.indexOf('y');
    let zindex = header.indexOf('z');
    if (xindex == -1 && yindex == -1 && zindex == -1)
        throw new Error("No x, y or z found in .xyz file");
    for (let row = 0; row < height; row++) {
        let slice = buffer.slice(row * width, (row + 1) * width);
        if (xindex != -1)
            newBuffer[row * 3 + 0] = slice[xindex];
        if (yindex != -1)
            newBuffer[row * 3 + 1] = slice[yindex];
        if (zindex != -1)
            newBuffer[row * 3 + 2] = slice[zindex];
    }
    return { trait: "multi-vector-3", buffer: newBuffer };
}
export function MultiVector3ToXYX(mv) {
    return {
        trait: "table",
        header: ['x', 'y', 'z'],
        width: 3,
        height: mv.buffer.length / 3,
        buffer: mv.buffer,
    };
}
export function writeXYZ(xyz) {
    let lines = [];
    const { header, width, buffer, height } = xyz;
    lines.push(header.join(" "));
    for (let i = 0; i < height; i++) {
        let values = [];
        for (let j = 0; j < width; j++) {
            values.push(buffer[i * width + j]);
        }
        lines.push(values.join(" "));
    }
    return lines.join("\n");
}
export function iterate(multiVector) {
    const { buffer } = multiVector;
    let list = [];
    let height = buffer.length / 3;
    for (let i = 0; i < height; i++) {
        list.push({
            x: buffer[i * 3 + 0],
            y: buffer[i * 3 + 1],
            z: buffer[i * 3 + 2]
        });
    }
    return list;
}
/**
 * Add two Vectors
 */
export function add(a, b) {
    console.log(a, b);
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z
    };
}
/**
 * How to deal with generics / traits ?
 */
export function move(geometry, mover) {
    // return geometry + mover
}
export function aggregate(vectorList) {
    let buffer = new Float32Array(vectorList.length * 3);
    for (let [i, vector] of vectorList.entries()) {
        buffer[i * 3 + 0] = vector.x;
        buffer[i * 3 + 1] = vector.y;
        buffer[i * 3 + 2] = vector.z;
    }
    return { trait: "multi-vector-3", buffer };
}
