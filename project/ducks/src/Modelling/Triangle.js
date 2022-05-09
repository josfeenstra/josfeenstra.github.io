class Triangle {
    a=Vector.new();
    b=Vector.new();
    c=Vector.new();

    constructor(a=Vector.new(), b=Vector.new(), c=Vector.new()) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    points() {
        return [this.a, this.b, this.c];
    }

    // closestPoint(point) {
    //     let plane = this.getPlane();
    //     let [cp, _] = plane.closestPoint(point);
    //     let planeCP = plane.pullToPlane(cp);
    //     let planeTriangle = this.to2D(plane);

    //     return point;
    // }

    // Transcribed from Christer Ericson's Real-Time Collision Detection:
    // http://realtimecollisiondetection.net/
    toBarycentric(point) {
        let v0 = this.b.subtract(this.a);
        let v1 = this.c.subtract(this.a);
        let v2 = point.subtract(this.a);
        let d00 = v0.dot(v0);
        let d01 = v0.dot(v1);
        let d11 = v1.dot(v1);
        let d20 = v2.dot(v0);
        let d21 = v2.dot(v1);
        let denom = d00 * d11 - d01 * d01;
        let v = (d11 * d20 - d01 * d21) / denom;
        let w = (d00 * d21 - d01 * d20) / denom;
        let u = 1.0 - v - w;

        return new Vector3(u, v, w);
    }

    fromBarycentric(bari) {
        let a = this.a.scale(bari.x);
        let b = this.b.scale(bari.y);
        let c = this.c.scale(bari.z);

        return a.add(b).add(c);
    }
}
