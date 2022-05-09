export function point(x, y, z) {
    return { x, y, z };
}
export function distance(a, b) {
    let dx = (a.x - b.x);
    let dy = (a.y - b.y);
    let dz = (a.z - b.z);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
