// mulberry32 algorithm
// see https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
// and, for the JS version seen here
// see https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function mulberry32(a) {
    return function() {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

/**
 * Including min, including max;
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Including min, excluding max;
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
 function randomFloat(min, max) {
    return min + Math.random() * (max - min);
}

/**
 * get a random element from the array
 * @param {Array} array 
 */
function randomChoice(array) {
    return array[randomInt(0, array.length-1)]
}