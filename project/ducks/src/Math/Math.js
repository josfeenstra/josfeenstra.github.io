class BamiMath {

    static isRougly(value, check, tolerance) {
        return Math.abs(value - check) < tolerance;
    }

    // make sure 'value' is more than 'lower', and less than 'upper'
    static clamp(value, lower, upper) {
        return Math.min(Math.max(value, lower), upper);
    }

    static smooth(t) {
        // Fade function as defined by Ken Perlin.  This eases coordinate values
        // so that they will ease towards integral values.  This ends up smoothing
        // the final output.
        return t * t * t * (t * (t * 6 - 15) + 10); // 6t^5 - 15t^4 + 10t^3
    }

    /**
     *  get `value` as a fraction between `min` and `max`.
     */
    static fraction(value, min, max) {
        return (value - min) / (max - min);
    }

    static lerp(a, b, x) {
        return a + x * (b - a);
    }

    static radToDeg(r) {
        return (r * 180) / Math.PI;
    }

    static degToRad(d) {
        return (d * Math.PI) / 180;
    }

    static factorial(n) {
        let prod = 1;
        for (let i = 1; i < n + 1; i++) {
            prod *= i;
        }
        return prod;
    }

    static stack(n) {
        let prod = 0;
        for (let i = 1; i < n + 1; i++) {
            prod += i;
        }
        return prod;
    }

    // on the edge of math & utility...

    static sample(values=[], t) {
        let count = values.length - 1;

        let p = t * count;
        let idxA = Math.floor(p);
        let idxB = Math.ceil(p);

        return this.lerp(values[idxA], values[idxB], p - idxA);
    }

    static sampleSmooth(data, t) {
        let count = data.length - 1;

        let p = t * count;
        let idxA = Math.floor(p);
        let idxB = Math.ceil(p);

        return this.lerp(data[idxA], data[idxB], this.smooth(p - idxA));
    }

    /**
     * binary search to figure out between which two values this sample is
     * assumes data is sorted!!
     */
    static between(data=[], sample) {
        let start = 0;
        let end = data.length - 1;

        for (let _ = 0; _ < data.length; _++) {
            if (start > end) {
                // its between these values
                console.log("start", start, "end", end);
                let temp = end;
                end = start;
                start = temp;
                break;
            }

            let mid = Math.round((end - start) / 2);
            if (sample < data[mid]) {
                // lower | on the left
                start = mid;
            } else if (sample > data[mid]) {
                // higher | on the right
                end = mid;
            } else {
                // same!
                start = mid;
                end = mid;
                break;
            }
        }
        return [start, end];
    }

    // /**
    //  * return true if a is rougly the same value as b.
    //  * uses the predefined tolerance
    //  */
    // static isRoughly(a: number, b: number) : boolean {
    // 	if (((a - b) < Const.TOLERANCE || (a - b) < Const.TOLERANCE))
    // 		return true;
    // 	return false;
    // }
}