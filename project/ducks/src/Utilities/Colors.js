/**
 * A [0 - 1] float based RGBA representation of color, so it can be loaded directly into webgl
 * 
 * Contains a variety of conversion functions
 */
 class Color {

    data;

    constructor(
        data=[0,0,0,0],
    ) {
        this.data = data;
    }

    get r() { return this.data[0] }
    get g() { return this.data[1] }
    get b() { return this.data[2] }
    get a() { return this.data[3] }

    set r(value) { this.data[0] = value }
    set g(value) { this.data[1] = value }
    set b(value) { this.data[2] = value }
    set a(value) { this.data[3] = value }

    static new() {
        return new Color([1, 1, 1, 1]);
    }
        
    static fromHex(str) {
        str = str.replace('#', '');
        let parts = str.match(/.{1,2}/g);
        if (!parts) {
            console.warn(`couldnt convert hex ${str} to color`);
            return undefined;
        }
        let values = [];
        for (let p of parts) {
            let integer = parseInt(p, 16);
            if (integer === undefined) {
                console.warn(`couldnt convert hex ${p} to color`);
                return undefined;
            }
            values.push(integer / 255);
        }
        return Color.fromRGB(...values);
    }

    static fromRGB(r=1, g=1, b=1, a=1) {
        return new Color([r,g,b,a]);
    }

    static fromList(list) {
        if (list.length != 3) {
            return undefined;
        }
        return new Color(list);
    }

    static fromHSL(h=0.5, s = 1, l = 0.5, a = 1) {
        let r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            let hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
    
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
    
        return Color.fromRGB(r,g,b,a)
    }

    static fromInt(list=[]) {
        return new Color(list.map(v => v / 255));
    }

    /**
     * This is very dirty
     */
    static isTheSame(a=[], b=[]) {
        return a[0] == b[0] && a[1] == b[1] && a[2] == b[2];
    }

    toInt() {
        let process = (n) => {
            return Math.round(n * 255);
        }
        return [process(this.r), process(this.g), process(this.b), process(this.a)]
    }

    toHex8() {
        let process = (n) => {
            let str = Math.round(n * 255).toString(16);
            str = (str.length==1) ? "0"+str : str;
            return str;
        }
        
        return `#${process(this.r)}${process(this.g)}${process(this.b)}${process(this.a)}`
    }

    toHex6() {
        let process = (n) => {
            let str = Math.round(n * 255).toString(16);
            str = (str.length==1) ? "0"+str : str;
            return str;
        }
        return `#${process(this.r)}${process(this.g)}${process(this.b)}`
    }
}