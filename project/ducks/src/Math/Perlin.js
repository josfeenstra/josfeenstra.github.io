// name:        perlin-noise.ts
// author:      Jos Feenstra
// purpose:     Generate Perin Noise

// @ts-check

// a javascript implementation of:
// Ref : https://adrianb.io/2014/08/09/perlinnoise.html

// Hash lookup table as defined by Ken Perlin.  This is a randomly
// arranged array of all numbers from 0-255 inclusive.
class Perlin {

    _permutation = [
        151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69,
        142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252,
        219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168,
        68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
        133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80,
        73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100,
        109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82,
        85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248,
        152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
        108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238,
        210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
        181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205,
        93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ];

    p=[]; // Doubled permutation to avoid overflow

    repeat = 0;

    constructor() {
        this.repeat = 0;
        this.p = new Array(512);
        for (let x = 0; x < 512; x++) {
            this.p[x] = this._permutation[x % 256];
        }
    }

    static new() {
        return new Perlin();
    }

    _grad(hash=0, x=0, y=0, z=0) {
        switch (hash & 0xf) {
            case 0x0:
                return x + y;
            case 0x1:
                return -x + y;
            case 0x2:
                return x - y;
            case 0x3:
                return -x - y;
            case 0x4:
                return x + z;
            case 0x5:
                return -x + z;
            case 0x6:
                return x - z;
            case 0x7:
                return -x - z;
            case 0x8:
                return y + z;
            case 0x9:
                return -y + z;
            case 0xa:
                return y - z;
            case 0xb:
                return -y - z;
            case 0xc:
                return y + x;
            case 0xd:
                return -y + z;
            case 0xe:
                return y - x;
            case 0xf:
                return -y - z;
            default:
                return 0; // never happens
        }
    }

    _inc(num=0) {
        num++;
        if (this.repeat > 0) num %= this.repeat;

        return num;
    }

    tieredNoise(vector, scale, amplitude, offset, octaves, persistence, tiers) {
        let noise = this.octaveNoise(
            vector.x * scale + offset, 
            vector.y * scale + offset, 
            vector.z * scale + offset, 
            octaves, 
            persistence);
        
        noise = Math.floor(noise * tiers) / tiers;

        return noise * amplitude;
    }
    
    calcNoise(vector, scale, amplitude, offset, octaves, persistence) {
        return this.octaveNoise(
            vector.x * scale + offset, 
            vector.y * scale + offset, 
            vector.z * scale + offset, 
            octaves, 
            persistence) * amplitude;
    }

    octaveNoise(x=0, y=0, z=0, octaves=0, persistence=0.5) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;  // Used for normalizing result to 0.0 - 1.0
        for (let i=0 ; i<octaves ; i++) {
            total += this.noise(x * frequency, y * frequency, z * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }
        
        return total/maxValue;
    }

    noise(x=0, y=0, z=0) {
        // If we have any repeat on, change the coordinates to their "local" repetitions
        if (this.repeat > 0) {
            x = x % this.repeat;
            y = y % this.repeat;
            z = z % this.repeat;
        }

        let xi = Math.floor(x) & 255; // Calculate the "unit cube" that the point asked will be located in
        let yi = Math.floor(y) & 255; // The left bound is ( |_x_|,|_y_|,|_z_| ) and the right bound is that
        let zi = Math.floor(z) & 255; // plus 1.  Next we calculate the location (from 0.0 to 1.0) in that cube.

        let xf = x - Math.floor(x);
        let yf = y - Math.floor(y);
        let zf = z - Math.floor(z);

        let p = this.p;
        let aaa = p[p[p[xi] + yi] + zi];
        let aba = p[p[p[xi] + this._inc(yi)] + zi];
        let aab = p[p[p[xi] + yi] + this._inc(zi)];
        let abb = p[p[p[xi] + this._inc(yi)] + this._inc(zi)];
        let baa = p[p[p[this._inc(xi)] + yi] + zi];
        let bba = p[p[p[this._inc(xi)] + this._inc(yi)] + zi];
        let bab = p[p[p[this._inc(xi)] + yi] + this._inc(zi)];
        let bbb = p[p[p[this._inc(xi)] + this._inc(yi)] + this._inc(zi)];

        let u = BamiMath.smooth(xf);
        let v = BamiMath.smooth(yf);
        let w = BamiMath.smooth(zf);

        let x1, x2, y1, y2;
        x1 = BamiMath.lerp(
            this._grad(aaa, xf, yf, zf), // The gradient function calculates the dot product between a pseudorandom
            this._grad(baa, xf - 1, yf, zf), // gradient vector and the vector from the input coordinate to the 8
            u,
        ); // surrounding points in its unit cube.
        x2 = BamiMath.lerp(
            this._grad(aba, xf, yf - 1, zf), // This is all then lerped together as a sort of weighted average based on the faded (u,v,w)
            this._grad(bba, xf - 1, yf - 1, zf), // values we made earlier.
            u,
        );
        y1 = BamiMath.lerp(x1, x2, v);

        x1 = BamiMath.lerp(this._grad(aab, xf, yf, zf - 1), this._grad(bab, xf - 1, yf, zf - 1), u);
        x2 = BamiMath.lerp(
            this._grad(abb, xf, yf - 1, zf - 1),
            this._grad(bbb, xf - 1, yf - 1, zf - 1),
            u,
        );
        y2 = BamiMath.lerp(x1, x2, v);

        return (BamiMath.lerp(y1, y2, w) + 1) / 2;
    }
}
