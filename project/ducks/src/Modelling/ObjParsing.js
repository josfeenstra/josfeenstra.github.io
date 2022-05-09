class ObjParsing {

    /**
     * Useful for when you just want one mesh from an OBJ.
     * Not useful if you want explicit material info
     * This makes many assumptions, and many of those assumptions are incorrect in many cases...
     */
    static parse(text="") {
        // This is not a full .obj parser.
        // see http://paulbourke.net/dataformats/obj/
        // INDEXES ORIGINALLY REFER TO LINES, so -1 is needed
    
        // run through all lines, and temporarely store
        // all data in raw number lists, since we dont know how
        // many vertices or faces well get.
        let vertList = []; // 3 long float
        let normList = []; // 3 long float
        let uvList   = []; // 2 long float
        
        let faceList = []; // 3 long ints, u16's should suffice.
        let allUvIds = []; // 3 long ints, u16's should suffice.
        let allNormIds = []; // 3 long ints, u16's should suffice.
        
        let faceType = 3;

        // note : this is very inefficient, but it'll have to do for now...
        const keywordRE = /(\w*)(?: )*(.*)/;
        const lines = text.split("\n");
    
        for (let i = 0; i < lines.length; ++i) {
            const line = lines[i].trim();
    
            // filter out comments
            if (line === "" || line.startsWith("#")) {
                continue;
            }
            const m = keywordRE.exec(line);
            if (!m) {
                continue;
            }
            const [, keyword, unparsedArgs] = m;
            const parts = line.split(/\s+/).slice(1);
    
            switch (keyword) {
                case "v":
                    for (const part of parts) {
                        vertList.push(parseFloat(part));
                    }
                    break;
                case "vn":
                    for (const part of parts) {
                        normList.push(parseFloat(part));
                    }
                    break;
                case "vt":
                    for (const part of parts) {
                        uvList.push(parseFloat(part));
                    }
                    break;
                case "f":
                    let [vertIds, normIds, uvIds] = this._processObjFace(parts);
                    faceType = vertIds.length;
                    faceList.push(...vertIds);
                    allNormIds.push(...normIds);
                    allUvIds.push(...uvIds);
                    break;
                default:
                    // console.warn("unhandled keyword:", keyword);
                    continue;
            }
        }

        // listify the four lists.
        const linearize = true;
        if (linearize && faceList.length == allNormIds.length && faceList.length == allUvIds.length) {

            let count = faceList.length;

            let verts = Matrix.fromList(vertList, 3);
            let norms = Matrix.fromList(normList, 3);
            let uvs = Matrix.fromList(uvList, 2);

            let linVerts = Matrix.new(3, count);
            let linNorms = Matrix.new(3, count);
            let linUvs = Matrix.new(2, count);

            for (let i = 0 ; i < count; i++) {
                linVerts.setVector(i, verts.getVector(faceList[i]));
                // linNorms.setVector(i, norms.getVector(normList[i]));
                // linUvs.setVector(i, uvs.getVector(uvList[i]));
            }            

            let links = Matrix.fromList(range(count), 3);
            let theUvIds = Matrix.fromList(range(count), 3);
            let theNormLinks = Matrix.fromList(range(count), 3);

            return new Mesh(linVerts, links, linUvs, linNorms, theUvIds, theNormLinks);
        }
        
        let verts = Matrix.fromList(vertList, 3);
        let norms = Matrix.fromList(normList, 3);
        let uvs = Matrix.fromList(uvList, 2);
        let links = Matrix.fromList(faceList, 3);
        let theUvIds = Matrix.fromList(theUvIds, 3);
        let theNormLinks = Matrix.fromList(theNormLinks, 3);
        
        return new Mesh(verts, links, uvs, norms, theUvIds, theNormLinks);
    }

    // verbose way of processing one single vertex/normal/uv combination in a face.
    static _processObjFaceVertex(part="") {
        // make sure data always has length: 3
        let data = [];
        let dataNorm = [];
        let dataUv = [];
    
        // cut string apart and process it
        let subparts = part.split("/");
        if (subparts.length == 1) {
            data.push(parseInt(subparts[0]) - 1);
            // data.push(0);
            // data.push(0);
        } else if (subparts.length == 3) {
            data.push(parseInt(subparts[0]) -1);
            dataNorm.push(parseInt(subparts[1]) -1);
            dataUv.push(parseInt(subparts[2]) -1);
        } else {
            throw "invalid face found when processing";
        }
        return [data, dataNorm, dataUv];
    }
    
    // process a face entry in an obj file
    static _processObjFace(parts=["","",""]) {
        let vertIds = [];
        let normIds = [];
        let uvIds = [];
    
        if (parts.length == 4) {
            // i dont want to deal with quads for now, create 2 faces from a quad
            let [a, aa, aaa] = this._processObjFaceVertex(parts[0]);
            let [b, bb, bbb] = this._processObjFaceVertex(parts[1]);
            let [c, cc, ccc] = this._processObjFaceVertex(parts[2]);
            let [d, dd, ddd] = this._processObjFaceVertex(parts[3]);
    
            vertIds.push(...a, ...b, ...c, ...a, ...c, ...d);
            normIds.push(...aa, ...bb, ...cc, ...aa, ...cc, ...dd);
            uvIds.push(...aaa, ...bbb, ...ccc, ...aaa, ...ccc, ...ddd);
        } else if (parts.length == 3) {
            // as normal
            let [a, aa, aaa] = this._processObjFaceVertex(parts[0]);
            let [b, bb, bbb] = this._processObjFaceVertex(parts[1]);
            let [c, cc, ccc] = this._processObjFaceVertex(parts[2]);
            vertIds.push(...a, ...b, ...c);
            normIds.push(...aa, ...bb, ...cc);
            uvIds.push(...aaa, ...bbb, ...ccc);
        } else {
            console.warn("HELP, I can only parse quads or triangles, n-gons not yet implemented!!");
        }
    
        // data always has length 9 or 18
        return [vertIds, normIds, uvIds];
    }
}

function range(length=100) {
    let list = new Array(length);
    for (let i = 0 ; i < length ; i++) {
        list[i] = i;
    }
    return list;
}