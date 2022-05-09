/*
    World.js
    Handling of the terrain, water, terrain collision etc
    Bamimoth
*/

class WorldDetail {
    constructor(game, mesh, pos, color = new Vector(255, 255, 255), scale = 1.0) {
        this.game = game;

        this.mesh = game.resources.models[mesh];
        this.pos = pos;

        this.angle = 2 * Math.random() * Math.PI 

        this.color = color;
        this.scale = scale;
    }
}


class World {
    constructor(game) {
        this.game = game;

        this.details = [];

        // Generate the mesh
        this.generateMeshes();
        this.generateDetails();
    }

    generateMeshes() {
        this.terrainMesh = this.generateSphere(true, 150, 100 * Math.random(), WORLD_RADIUS * 0.725);
        this.waterMesh = this.generateSphere(false, 0);

        this.heightMap = this.generateHeightMap(this.terrainMesh);
    }

    
    generateSphere(useNoise = true, amplitude = 50, offset = 0, radius = WORLD_RADIUS) {
        let perlin = Perlin.new();
        let scale = 0.004;
        let octaves = 1;
        let octaveBlend = 0.5;
        let tiers = 10;

        let mesh = Mesh.newIcosahedron(200, 3);
        mesh.verts.transformVectors((v) => {
            const normal = v.normalize();
            let noise = 0;
            if (useNoise) noise = perlin.tieredNoise(v, scale, amplitude, offset, octaves, octaveBlend, tiers);

            v = normal.scale(radius + noise);
            return v;
        })

        return mesh;
    }


    generateHeightMap(mesh) {

        let width = 1024;
        let height = 512;

        let waterLevel = 300;

        // use this to normalize the height
        // let minHeight = 210;
        // let maxHeight = 400;
        
        let image = ImageProcessing.paintImage(width, height, (canvas, ctx) => {

            ctx.imageSmoothingEnabled = false;
            // ctx.
            ctx.fillStyle = "#ffffffff";
            ctx.strokeWidth = 0;
            ctx.fillRect(0,0,width,height);

            // get uvs from a mesh
            for (let i = 0 ; i < mesh.links.height; i++) {
                let face = mesh.links.getRow(i);
                let uvs = [];
                let verts = [];
                let heights = []
                for (let j = 0; j < face.length; j++) {
                    let vert = mesh.verts.getVector(face[j]);
                    verts.push(vert);
                    let length = vert.length();

                    // let normHeight = (length - minHeight) / (maxHeight - minHeight); 
                    heights.push(length);

                    let uv = threeToTwo(vert, width, height);
                    uvs.push(uv);
                }
            
                drawTriangle(ctx, verts, uvs, heights, waterLevel, width, height);
            }
        });



        return image;
    }


    generateDetails() {
        // Generate trees
        for (let i = 0; i < WORLD_DETAIL_TREE_COUNT; i++) {
            const pos = this.getPositionSatisfyingCondition(h => h > 0.5);
            this.details.push(new WorldDetail(this.game, "tree", pos, new Vector(90, 189, 62), 1.0));
        }

        // Generate logs
        for (let i = 0; i < WORLD_DETAIL_LOG_COUNT; i++) {
            const pos = this.getPositionSatisfyingCondition(h => h < 0.1);
            this.details.push(new WorldDetail(this.game, "timber", pos, new Vector(189, 151, 62), 1.0));
        }
    }


    getPositionSatisfyingCondition(condition) {
        while (true) {
            let pos = new Vector(2 * Math.random() * WORLD_RADIUS - WORLD_RADIUS, 2 * Math.random() * WORLD_RADIUS - WORLD_RADIUS, 2 * Math.random() * WORLD_RADIUS - WORLD_RADIUS);
            pos = pos.normalize().scale(WORLD_RADIUS);

            if (this.heightMapSatisfies(pos, condition)) return pos;
        }
    }


    getHeight(pos) {
        let [theta, phi] = pos.polarAngles();
        phi = phi + Math.PI;

        const mapPos = new Vector(phi * this.heightMap.width / (2 * Math.PI), (theta + Math.PI / 2) * this.heightMap.height / Math.PI).floor();
        const index = (mapPos.y * this.heightMap.width + mapPos.x) * 4;

        const height = 1.0 - (this.heightMap.data[index] / 255);

        return height;
    }


    heightMapSatisfies(pos, condition) {
        const h = this.getHeight(pos);
        return condition(h);
    }
}

function drawSomeTriangle(ctx, v1=Vector.new(0,180), v2=Vector.new(200,180), v3=Vector.new(300,180), heights) {
    // reordered to make the same as OP's image
    // var v1 = { x: 0, y: 180 };
    // var v2 = { x: 200, y: 180 };
    // var v3 = { x: 100, y: 0 };

    let c1 = Color.fromHSL(0.0, 0, heights[0]);
    let c2 = Color.fromHSL(0.0, 0, heights[1]);
    let c3 = Color.fromHSL(0.0, 0, heights[2]);

    var radius = 180;

    var grd1 = ctx.createRadialGradient(v1.x, v1.y, 0, v1.x, v1.y, radius);
    grd1.addColorStop(0, c1.toHex8());
    c1.data[3] = 0;
    grd1.addColorStop(1, c1.toHex8());

    var grd2 = ctx.createRadialGradient(v2.x, v2.y, 0, v2.x, v2.y, radius);
    grd2.addColorStop(0, c2.toHex8());
    c2.data[3] = 0;
    grd2.addColorStop(1, c2.toHex8());

    var grd3 = ctx.createRadialGradient(v3.x, v3.y, 0, v3.x, v3.y, radius);
    grd3.addColorStop(0, c3.toHex8());
    c3.data[3] = 0;
    grd3.addColorStop(1, c3.toHex8());

    ctx.beginPath();

    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);

    ctx.closePath();

    // fill with black
    // ctx.fillStyle = color.toHex8();
    // ctx.fill();

    // set blend mode
    ctx.globalCompositeOperation = "lighter";
    // console.log(ctx.globalCompawositeOperation);

    ctx.fillStyle = grd1;
    ctx.fill();

    ctx.fillStyle = grd2;
    ctx.fill();

    ctx.fillStyle = grd3;
    ctx.fill();

    // if you need to draw something else, don't forget to reset the gCO
    // ctx.globalCompositeOperation = "source-over";
}


function attemptFix(ctx, verts, uvs, heights, waterLevel, width, height, i, transform, transformBack) {
    // make a counterTriangle that gets transformed in reverse
    uvsNew = [];
    uvsCounter = [];
    for (let k = 0 ; k < 3; k++) {
        uvsNew[k]     = uvs[k].clone();
        uvsCounter[k] = uvs[k].clone();

        if (k == i) {
            uvsNew[k] = transform(uvsNew[k]);
        } else {
            uvsCounter[k] = transformBack(uvsCounter[k]);
        }
    }

    drawTriangle(ctx, verts, uvsNew, heights, waterLevel, width, height, true);
    drawTriangle(ctx, verts, uvsCounter, heights, waterLevel, width, height, true);
}


function tryToFixEdgeTriangle(ctx, verts, uvs, heights, waterLevel, width, height) {
    
    // try to change vertex 1, 2 and 3
    for (let i = 0; i < 3; i++) {

        attemptFix(ctx, verts, uvs, heights, waterLevel, width, height, 
            i,
            v => v.addN(-width),
            v => v.addN(width));

        attemptFix(ctx, verts, uvs, heights, waterLevel, width, height, 
            i,
            v => v.addN(width),
            v => v.addN(-width));

        let mid = (width / 2);
        

        attemptFix(ctx, verts, uvs, heights, waterLevel, width, height, 
            i,
            (v) => {
                let distanceFromMid = Math.abs(mid - v.x);
                // v.x = mid + distanceFromMid;
                v.y = -v.y;
                return v;
            },
            (v) => {
                let distanceFromMid = Math.abs(mid - v.x);
                // v.x = mid - distanceFromMid;
                v.y = -v.y;
                return v;
            });
    }

    // let edgeLength1 = v1.distance(v2);
    // let edgeLength2 = v2.distance(v3);
    // let edgeLength3 = v3.distance(v1);

    // if (edgeLength1 > edgeLength2 || edgeLength1 > edgeLength3) {
    //     // edge1 is largest

    // }
    // if (edgeLength2 > edgeLength1 || edgeLength2 > edgeLength3) {
    //     // edge2 is largest

    // }

    // if (edgeLength3 > edgeLength1 || edgeLength3 > edgeLength2) {
    //     // edge3 is largest

    // }
}


function drawTriangle(ctx, verts, uvs, heights, waterLevel, width, height, shallow=false) {

    let v1 = uvs[0];
    let v2 = uvs[1];
    let v3 = uvs[2];

    // detect edge triangles
    let color = null;
    // let edgeLength1 = v1.distance(v2);
    // let edgeLength2 = v2.distance(v3);
    // let edgeLength3 = v3.distance(v1);
    let edges = [[v1, v2], [v2, v3], [v3, v1]];
    for (let i = 0 ; i < 3; i++) {
        let edgeLength = edges[i][0].distance(edges[i][1]);
        if (edgeLength > 300) {
            // for all edges with long edges, we must check if they make sense
            if (shallow == false) {
                tryToFixEdgeTriangle(ctx, verts, uvs, heights, waterLevel, width, height)
            }
            return;
        }
    }

    //NOW FINALLY, DO SOME USEFUL SHIT!
    let lowers = 0;
    for (let i = 0 ; i < 3; i++) {
        if (heights[i] < waterLevel) {
            lowers+=1;;
        }
    }

    let theColor = null;
    if (lowers == 3) {
        // its all the way at the bottom there!
        theColor = 'white';
    } else if (lowers == 0) {
        // its high up there!
        theColor = 'black';
    } else {
        theColor = 'grey';
        // Color.fromHSL(0.0, 0, lowers / 3).toHex8();
    }

    // draw the triangle
    ctx.fillStyle = theColor;
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.fill();


    // if you need to draw something else, don't forget to reset the gCO
    // ctx.globalCompositeOperation = "source-over";
}


function drawDots(ctx, verts, uvs,  heights, waterLevel, width, height) {

    // let v1 = uvs[0];
    // let v2 = uvs[1];
    // let v3 = uvs[2];

    let triangle = new Triangle(verts[0], verts[1], verts[2]);

    let stride = 0.4;
    for (let i = 0; i < 1; i += stride) {
        for (let j = 0; j < i; j += stride) {
            let k = 1 - j;
            let middleVert = triangle.fromBarycentric(Vector.new(i, j, k));
            let center = threeToTwo(middleVert, width, height);
            let length = middleVert.length();

            console.log(length);
            let normHeight = (length - 200) / (500 - 200); 
        
            ctx.fillStyle = Color.fromHSL(0,0,normHeight, 1).toHex8();
            ctx.beginPath();
            ctx.arc(center.x, center.y, 10, 0, TWO_PI);
            ctx.fill()
        }
    }    

    // let area = areaTriangle(uvs);
    // let middleVert = verts[0].add(verts[1]).add(verts[2]).scale(1 / 3);
    // let center = threeToTwo(middleVert, width, height);

    // let length = middleVert.length();
    // let normHeight = (length - 200) / (400 - 200); 

    // ctx.fillStyle = Color.fromHSL(0,0,normHeight, 1).toHex8();
    // ctx.beginPath();
    // ctx.arc(center.x, center.y, 10, 0, TWO_PI);
    // ctx.fill()
}


function threeToTwo(vert, width, height) {
    let rawUV = vert.polarAngles();
    let yNorm = (rawUV[0] + HALF_PI) / Math.PI;
    let xNorm = (rawUV[1] + Math.PI) / TWO_PI;
    
    let uv = Vector.new(
        Math.floor(xNorm * width), 
        Math.floor(yNorm * height));
    return uv;
}


function areaTriangle(verts) {

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let vert of verts) {
        if (vert.x < minX) minX = vert.x;
        if (vert.x > maxX) maxX = vert.x;
        if (vert.y < minY) minY = vert.y;
        if (vert.y > maxY) maxY = vert.y;
    }

    let width = maxX - minX;
    let height = maxY - minY;

    return 0.5 * width * height;
}