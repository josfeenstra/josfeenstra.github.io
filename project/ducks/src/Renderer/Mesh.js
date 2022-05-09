/*
    Mesh.js
*/

class Mesh {
    verts = Matrix.new();
    uvs = Matrix.new();
    normals = Matrix.new();
    
    links = Matrix.new();
    uvLinks = Matrix.new();
    normLinks = Matrix.new();

    constructor(
        verts = Matrix.new(),
        links = Matrix.new(),
        uvs = Matrix.new(),
        normals = Matrix.new(),
        uvLinks = Matrix.new(),
        normLinks = Matrix.new(),
    ) {
        this.verts = verts;
        this.links = links;
        this.uvs = uvs;
        this.normals = normals;
        this.uvLinks = uvLinks;
        this.normLinks = normLinks;
    }

    
    static fromLists(verts=[], faces=[], uvs=[], normals=[]) {
        return new Mesh(Matrix.fromVectors(verts), Matrix.fromList(faces, 3), Matrix.fromList(uvs,2), Matrix.fromList(normals,3));
    }

    // TODO remove center. Just move afterwards
    static newSphere(center, radius=1, numRings=10, resolution=10) {
        let vertCount = numRings * resolution + 2;
        let verts = new Matrix(3, vertCount);

        let setVert = function(i, vector) {
            verts.setRow(i, vector.scale(radius).add(center).toArray());
        };

        setVert(0, new Vector(0, 0, 1));
        for (let ring = 0; ring < numRings; ring++) {
            for (let perRing = 0; perRing < resolution; perRing++) {
                let alpha = (Math.PI * (ring + 1)) / (numRings + 1);
                let beta = (2 * Math.PI * perRing) / resolution;

                let x = Math.sin(alpha) * Math.cos(beta);
                let y = Math.sin(alpha) * Math.sin(beta);
                let z = Math.cos(alpha);

                const index = 1 + ring * resolution + perRing;
                const pos = new Vector(x, y, z);
                setVert(index, pos);
            }
        }
        setVert(vertCount - 1, new Vector(0, 0, -1));

        // faces
        let faceCount = resolution * numRings * 2;
        let links = new Matrix(3, faceCount);
        links.fill(-1);

        let setFace = function (i, row=[1,2,3]) {
            links.setRow(i, row);
        };

        // faces top
        for (let i = 0; i < resolution; i++) setFace(i, [0, i + 1, ((i + 1) % resolution) + 1]);

        // faces middle
        // we are at this cursor
        // console.log("faces", faceCount);
        for (let ring = 0; ring < numRings - 1; ring++) {
            let vertCursor = resolution * ring + 1;
            let vertCursorBelow = vertCursor + resolution;

            for (let perRing = 0; perRing < resolution; perRing++) {
                let a = vertCursor + perRing;
                let b = vertCursor + ((perRing + 1) % resolution);

                let c = vertCursorBelow + perRing;
                let d = vertCursorBelow + ((perRing + 1) % resolution);

                let iFace = resolution + resolution * ring * 2 + perRing * 2;

                setFace(iFace, [a, c, b]);
                setFace(iFace + 1, [c, d, b]);
            }
        }

        // faces bottom
        for (let i = 0; i < resolution; i++) {
            let iNext = (i + 1) % resolution;
            let last = vertCount - 1;

            let iFace = faceCount - resolution + i;

            let zero = vertCount - resolution - 1;
            let vertI = zero + i;
            let vertINext = zero + iNext;

            setFace(iFace, [last, vertINext, vertI]);
        }

        return new Mesh(verts, links);
    }


    // Add a polygon
    static newCube(center, radius) {
        const verts = new Matrix(3, 8);
        const links = new Matrix(3, 12);

        const setVert = function(i, vector) { verts.setRow(i, vector.toArray()); };
        const setFace = function (i, row=[1,2,3]) { links.setRow(i, row); };

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 4; j++) {
                const faceCenter = center.add(new Vector(0.0, -radius * Math.sqrt(2) * 0.5 + Math.sqrt(2) * radius * i, 0.0));

                const x = faceCenter.x + Math.cos(j * 0.5 * Math.PI + Math.PI / 4) * radius;
                const y = faceCenter.y;
                const z = faceCenter.z + Math.sin(j * 0.5 * Math.PI + Math.PI / 4) * radius;

                const index = i * 4 + j;
                setVert(index, new Vector(x, y, z));
            }
        }

        setFace(0, [0, 1, 2]);
        setFace(1, [0, 2, 3]);

        setFace(2, [0, 3, 7]);
        setFace(3, [7, 4, 0]);

        setFace(4, [1, 6, 2]);
        setFace(5, [1, 5, 6]);

        setFace(6, [2, 6, 3]);
        setFace(7, [3, 6, 7]);

        setFace(8, [7, 5, 4]);
        setFace(9, [7, 6, 5]);

        setFace(10, [0, 5, 1]);
        setFace(11, [0, 4, 5]);

        return new Mesh(verts, links);
    }

    static newIcosahedron(scale = 1, subd=0) {
        let graph = new Graph();

        let a = scale;
        let phi = (1 + 5 ** 0.5) / 2;
        let b = a * phi;

        let addVert = (v=Vector.new(0,0,0)) => {
            graph.addVert(v, v);
        };

        addVert(new Vector(-a, -b, 0));
        addVert(new Vector(a, -b, 0));
        addVert(new Vector(-a, b, 0));
        addVert(new Vector(a, b, 0));
        addVert(new Vector(0, -a, -b));
        addVert(new Vector(0, a, -b));
        addVert(new Vector(0, -a, b));
        addVert(new Vector(0, a, b));
        addVert(new Vector(-b, 0, -a));
        addVert(new Vector(-b, 0, a));
        addVert(new Vector(b, 0, -a));
        addVert(new Vector(b, 0, a));

        // build edges
        let addEdge = (a=0, b=0) => {
            graph.addEdge(a, b);
        };
        for (let i = 0; i < 12; i += 4) {
            addEdge(i + 0, i + 1);
            addEdge(i + 2, i + 3);

            let inext = (i + 4) % 12;

            addEdge(i + 0, inext + 2);
            addEdge(i + 0, inext + 0);
            addEdge(i + 1, inext + 2);
            addEdge(i + 1, inext + 0);

            addEdge(i + 2, inext + 3);
            addEdge(i + 2, inext + 1);
            addEdge(i + 3, inext + 3);
            addEdge(i + 3, inext + 1);
        }

        for (let i = 0 ; i < subd; i++) {
            graph.subdivide();
        }

        let m = this.fromGraph(graph);
        //console.log(m);
        return m;
    }

    static newTriangle(corners=[]) {
        return this.fromLists(corners, [0,1,2]);
    }

    static newQuad(corners=[]) {
        let faces = [...quadToTri(cubeFaces[0])];
        return this.fromLists(corners, faces);
    }

    static fromGraph(graph) {
        // NOTE : doesnt really work if the loops are not of size 3.

        let verts = Matrix.fromVectors(graph.allVertPositions());
        let loops = graph.allVertLoopsAsInts();
        let links = new Matrix(3, loops.length);
        loops.forEach((loop, i) => {
            if (loop.length == 3) {
                links.setRow(i, loop);
            } else {
                console.log("cant convert loop");
            }
        });
        return new Mesh(verts, links);
    }

    
    static fromJoin(meshes) {
        // join meshes, dont try to look for duplicate vertices
        // TODO : make this the trouble of Matrices and Arrays
        let vertCount = 0;
        let faceCount = 0;

        for (let mesh of meshes) {
            vertCount += mesh.verts.count;
            faceCount += mesh.links.count();
        }

        let verts = new Matrix(vertCount, 3);
        let links = new Matrix(faceCount, 3);

        let accVerts = 0;
        let accFaces = 0;

        for (let mesh of meshes) {
            for (let i = 0; i < mesh.verts.count; i++) {
                verts.set(accVerts + i, mesh.verts.get(i));
            }
            for (let i = 0; i < mesh.links.count(); i++) {
                let face = mesh.links.getRow(i);
                for (let j = 0; j < face.length; j++) {
                    face[j] = face[j] + accVerts;
                }
                links.setRow(accFaces + i, face);
            }
            accVerts += mesh.verts.count;
            accFaces += mesh.links.count();
        }

        return new Mesh(verts, links);
    }

    // ------- CONVERTERS

    getVerticesOfFace(f=0) {
        let verts = Matrix.new(this.links.width, 3);
        this.links.getRow(f).forEach((v, i) => {
            verts.setRow(i, this.verts.getRow(v));
        });
        return verts;
    }

    getFaceCount() {
        return this.links.height;
    }
}

function quadToTri(abcd=[]) {
    return [abcd[0], abcd[2], abcd[1], abcd[0], abcd[3], abcd[2]];
}

const cubeFaces = [
    [0, 1, 3, 2], // front
    [4, 0, 2, 6], // left
    [1, 0, 4, 5], // top
    [1, 5, 7, 3], // right
    [2, 3, 7, 6], // bottom
    [5, 4, 6, 7], // back
];

const cubeUVS = [
    [0.0, 0.0],
    [1.0, 0.0],
    [0.0, 1.0],
    [1.0, 1.0],
    [0.0, 0.0],
    [1.0, 0.0],
    [0.0, 1.0],
    [1.0, 1.0],
    [0.0, 0.0],
    [1.0, 0.0],
    [0.0, 1.0],
    [1.0, 1.0],
    [0.0, 0.0],
    [1.0, 0.0],
    [0.0, 1.0],
    [1.0, 1.0],
    [0.0, 0.0],
    [1.0, 0.0],
    [0.0, 1.0],
    [1.0, 1.0],
    [0.0, 0.0],
    [1.0, 0.0],
    [0.0, 1.0],
    [1.0, 1.0],
]
