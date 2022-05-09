class Util {
    
    static range(n=10) {
        let array = [];
        for (let i = 0; i < n; i++) {
            array.push(i);
        }
        return array;
    }

    static collect(gen) {
        let arr = new Array();
        for (let item of gen) {
            arr.push(item);
        }
        return arr;
    }
}