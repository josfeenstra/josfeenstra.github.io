// generic all-pupose matrix of floats
class Matrix {
    data = null; // Float32Array;
    width = 0;
    height = 0;

    constructor(width=1, height=1, data) {
        this.width = width;
        this.height = height;
        
        this.data = new Float32Array(this.width * this.height);
        if (data) {
            for (let i in data) this.data[i] = data[i];
        } else {
            //this.fill(0.0);
        }
    }

    static new(width=1, height=1, data = []) {
        return new Matrix(width, height, data);
    }

    static mulBtoA(A=Matrix.new(), B=Matrix.new()) {
        // / matrix multiplications are weird. Sometimes, A*B is noted in some book, when they mean B*A in actuality
        
        // console.log(`attempting to multiply A [${A.width}x${A.height}] to B [${B.width}x${B.height}]`)
        
        return B.mul(A);
    }

    static mulAtoB(A=Matrix.new(), B=Matrix.new()) {
        // / matrix multiplications are weird. Sometimes, A*B is noted in some book, when they mean B*A in actuality
        //console.log(`attempting to multiply A [${A.width}x${A.height}] to B [${B.width}x${B.height}]`)
        return A.mul(B);
    }

    static multiply(a=Matrix.new(), b=Matrix.new()) {
        return b.mul(a);
    }

    static zeros(width=1, height=1) {
        return new Matrix(width, height);
    }

    /**
     * stack a bunch of equal-length arrays horizontally
     */
    /*static vstack(...arrays=[[],[]]) {
        if (arrays.length == 0) throw new Error("need minimum of one array...");

        let height = arrays.length;
        let width = arrays[0].length;
        let matrix = Matrix.zeros(width, height);
        for (let i = 0; i < height; i++) {
            if (arrays[i].length != width) throw new Error("all arrays need to be the same length");
            for (let j = 0; j < width; j++) {
                matrix.set(i, j, arrays[i][j]);
            }
        }
    }*/

    static fromVectors(vectors) {
        let list = [];
        for (let v of vectors) {
            list.push(v.x, v.y, v.z);
        }
        return new Matrix(3, vectors.length, list);
    }

    static fromList(list=[1], width=1) {
        let height = list.length / width;
        return new Matrix(width, height, list);
    }
    

    static fromNative(native=[[],[]]) {
        // assume all subarrays have the same shape!!
        let height = native.length;
        let width = native[0].length;
        let matrix = new Matrix(width, height);
        for (var i = 0; i < native.length; i++) {
            for (var j = 0; j < native[0].length; j++) {
                matrix.set(i, j, native[i][j]);
            }
        }
        return matrix;
    }

    clone() {
        let clone = new Matrix(this.width, this.height);
        for (let i = 0; i < this.data.length; i++) {
            clone.data[i] = this.data[i];
        }
        return clone;
    }

    // [GETTING & SETTING]

    print() {
        let strings = [];
        const WIDTH = 8;
        for (var i = 0; i < this.height; i++) {
            strings.push("|");
            for (var j = 0; j < this.width; j++) {
                let str = this.get(i, j).toFixed(2); // TODO THIS IS INCORRECT
                str = str.padStart(WIDTH, " ");
                strings.push(str);

                if (j < this.width - 2) {
                    strings.push("  ");
                }
            }
            strings.push("  |\n");
        }
        console.log(strings.join(""));
    }

    setData(data=[1,2,3]) {
        if (data.length != this.height * this.width) throw "data.length does not match width * height " + data.length.toString();
        this.data.set(data);
    }

    count() {
        // number of entries / rows.
        // when derrived classes ask for 'how many of x?' they usually mean this.
        return this.height;
    }

    get size() {
        return this.width * this.height;
    }

    getDimensions() {
        return [this.height, this.width];
    }

    fill(value=1.0) {
        let size = this.height * this.width;
        for (let i = 0; i < size; i++) {
            this.data[i] = value;
        }
    }

    fillWith(data=[1,2,3], valuesPerEntry = this.width) {
        // values per entry can be used to setData which is not of the same shape.
        let vpe = valuesPerEntry;
        if (vpe > this.width)
            throw "values per entry is larger than this._width. This will spill over.";
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < vpe; j++) {
                this.set(i, j, data[i * vpe + j]);
            }
        }
    }

    fillFrom(other=Matrix.new()) {
        if (other.height < this.height || other.width < this.width) {
            throw new Error("need same dimentions");
        }

        for (let i = 0; i < other.height; i++) {
            for (let j = 0; j < 2; j++) {
                this.set(i, j, other.get(i, j));
            }
        }
        return this;
    }

    get(i, j) {
        return this.data[i * this.width + j];
    }

    transformVectors(transformer=(v=Vector.new())) {
        for (let i = 0 ; i < this.height; i++) {
            this.setVector(i, transformer(this.getVector(i)));
        }
    }

    getVector(i) {
        if (this.width != 3 || i < 0 || i > this.height) throw "column is out of bounds for FloatArray"
        return new Vector(this.get(i, 0), this.get(i, 1), this.get(i, 2));
    }

    setVector(i, vec) {
        this.set(i, 0, vec.x);
        this.set(i, 1, vec.y);
        this.set(i, 2, vec.z);
    }

    getRow(i) {
        // if (i < 0 || i > this.height) throw "column is out of bounds for FloatArray"
        let data = new Float32Array(this.width);
        for (let j = 0; j < this.width; j++) {
            data[j] = this.get(i, j);
        }
        return data;
    }

    getColumn(j=0) {
        // if (j < 0 || j > this.width) throw "column is out of bounds for FloatArray"
        let data = new Float32Array(this.height);
        for (let i = 0; i < this.height; i++) {
            let index = i * this.width + j;
            data[i] = this.data[index];
        }
        return data;
    }

    set(i=0, j=0, value=0) {
        this.data[i * this.width + j] = value;
    }

    setRow(rowIndex=0, row) {
        for (let j = 0; j < this.width; j++) {
            this.set(rowIndex, j, row[j]);
        }
    }

    forEachValue(callback=(self=0, other=1) => number) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] = callback(this.data[i], i);
        }
        return this;
    }

    takeRows(indices=[1,2,3]) {
        // create a new floatarray
        const count = indices.length;
        let array = new Matrix(count, this.width);
        for (let i = 0; i < count; i++) {
            let getIndex = indices[i];
            array.setRow(i, this.getRow(getIndex));
        }
        return array;
    }

    // create a new Matrix, processed by iterating
    mapWith(other, callback=(self=0, other=1) => number) {
        let result = this.clone();

        let width = Math.min(this.width, other.height);
        let height = Math.min(this.height, other.height);

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                result.set(i, j, callback(this.get(i, j), other.get(i, j)));
            }
        }

        return result;
    }

    toNative() {
        let native = [];
        for (var i = 0; i < this.height; i++) {
            native[i] = [];
            for (var j = 0; j < this.width; j++) {
                native[i][j] = this.get(i, j);
            }
        }
        return native;
    }

    // [CALCULATIONS]

    // generalized multiplication
    mul(b=Matrix.new()) {
        
        let a = this;
        if (b.height !== a.width) {
            throw new Error(
                `Columns in A should be the same as the number of rows in B
                a.width ${a.width},
                b.height ${b.height}`,
            );
        }
        let size = a.width;
        var product = new Matrix(b.width, a.height);

        for (var i = 0; i < product.height; i++) {
            for (var j = 0; j < product.width; j++) {
                let sum = 0;
                for (var k = 0; k < size; k++) {
                    sum += a.get(i, k) * b.get(k, j);
                }
                product.set(i, j, sum);
            }
        }

        return product;
    }

    tp() {
        let tp = Matrix.zeros(this.height, this.width);
        for (let i = 0 ; i < this.height; i++) {
            for (let j = 0 ; j < this.width; j++) {
                tp.set(j, i, this.get(i, j));
            }
        }
        return tp;
    }

    inv() {
        return Stat.pinv(this);
    }

    inv2() {
        return Stat.pinv2(this);
    }
}