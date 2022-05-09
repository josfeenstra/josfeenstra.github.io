// note: this wont always work, but it does in most cases
// todo: implement proper hashtable
class HashTable {
    data;

    constructor() {
        this.data = new Map();
    }

    _stringify(key) {
        return key.toString();
    }

    set(key, value) {
        return this.data.set(this._stringify(key), value);
    }

    has(key) {
        return this.data.has(this._stringify(key));
    }

    get(key) {
        return this.data.get(this._stringify(key));
    }
}
