// name:    app.js
// author:  Jos Feenstra
// purpose: small helper class to do some perf testing

export class Stopwatch {
    constructor(oldTime) {
        this.oldTime = oldTime;
    }

    static new() {
        let s = new Stopwatch(0);
        s.time();
        return s;
    }

    time() {
        
        let newTime = this._getTime();
        let timePast = newTime - this.oldTime;
        this.oldTime = newTime;
        return timePast;
    }

    log(event) {
        console.log(`${event} took: ${this.time()} ms`);
    }

    _getTime() {
        return performance.now();
    }
}
