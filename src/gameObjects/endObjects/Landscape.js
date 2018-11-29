///////////////////////////////////////
// Landscape.js________________________
// Object that represents the landscape
///////////////////////////////////////

function Landscape () {

	this.landscapeWidth = 0;
	this.landscapeDepth = 0;
	this.stripDepth = 30;
	this.yScale = 15;
	this.landscapeStrips = [];
	this.loadModel("assets/heightmap/testHeightmap.json");
}

Landscape.prototype.draw = function () {
	//Iterate over all landscape strips and draw them
	this.landscapeStrips.forEach( function(strip) {
		strip.draw();
	});
};

// Improve GameObjectManager so as not to need this
Landscape.prototype.update = function () {};

// Conundrum: inherit from VisibleObject and have a bunch of unused vars and arrays for drawing
// (Landscape itself is not a drawable object, it implements its own .draw) or just copy
// .loadModel from VisibleObject?
Landscape.prototype.loadModel = function (path) {

    var heightmap = new Image();
    heightmap.onload = function() {

		var imCanvas = document.createElement("canvas");

        // Load map width and depth
        imCanvas.width = heightmap.width;
        imCanvas.height = heightmap.height;
        this.landscapeWidth = heightmap.width;
        this.landscapeDepth += heightmap.height;

		var imContext = imCanvas.getContext("2d");
		imContext.drawImage(heightmap, 0, 0);

		//Traverse the map by querying handleLandscapeStrip that returns false
		//when it reaches end of heightmap
		var kStrip = 0;
		while(this.handleLandscapeStrip(imContext, kStrip)) {
			kStrip += 1;
		}

		//After the landscape is loaded, cover it with snow!
        GAME_OBJECT_MANAGER.add(new Snow(), ObjectTypes.Snow);

	}.bind(this);
    heightmap.src = "assets/heightmap/testHeightmap64.bmp";
};

Landscape.prototype.handleLandscapeStrip = function (context, k) {

	// Flag that tells function that is calling this to keep making strips
	var moreStrips = true;

	// Read image strip data (limit upper y to stripDepth + 1 or less if at end of image)
    var stripData = context.getImageData(0, k*this.stripDepth,
		this.landscapeWidth, Math.min(this.stripDepth + 1, this.landscapeDepth - k*this.stripDepth + 1));

    // Create a new generic visibleObject
    var landscapeStrip = new VisibleObject();
    landscapeStrip.vertexNormals = [];

    // Move strip to appropriate Z
    landscapeStrip.setPosition([0, 0, k*this.stripDepth]);
    // Set color
    landscapeStrip.colors = [[0.33, 0.67, 0.26, 1.0]];

    //Traverse the strip of image
    for (var i = 0; i < this.stripDepth; i++) {

		//If image over, exit and set moreStrips to false
		if (k*this.stripDepth + i >= this.landscapeDepth) {
            moreStrips = false;
            break;
		}

        for (var j = 0; j < this.landscapeWidth - 1; j++) {
            //Define vertices, we will need them later for normals
			var vert1 = [j,   stripData.data[(i    *this.landscapeWidth + j)*4]/this.yScale, i];	//Upper left vert
            var vert2 = [j+1, stripData.data[(i    *this.landscapeWidth + j+1)*4]/this.yScale, i];	//Upper right vert
            var vert3 = [j+1, stripData.data[((i+1)*this.landscapeWidth + j+1)*4]/this.yScale, i+1];//Lower right vert
            var vert4 = [j,   stripData.data[((i+1)*this.landscapeWidth + j)*4]/this.yScale, i+1];	//Lower left vert

            //Add upper left triangle and lower right triangle vertices
            landscapeStrip.vertices = landscapeStrip.vertices.concat(
            	vert1.concat(vert2.concat(vert4.concat(vert2.concat(vert3.concat(vert4.concat())))))
			);
            landscapeStrip.nVertices += 6;

            //Add the two triangles
            landscapeStrip.vertexIndices = landscapeStrip.vertexIndices.concat([
            //((i reduced for previous strips)*(strip length) + position in row) * (6=vertices per square) + n of vertex in square
				//Upper left triangle
				(i*(this.landscapeWidth-1) + j)*6,
				(i*(this.landscapeWidth-1) + j)*6 + 1,
				(i*(this.landscapeWidth-1) + j)*6 + 2,
				//Lower right triangle
				(i*(this.landscapeWidth-1) + j)*6 + 3,
				(i*(this.landscapeWidth-1) + j)*6 + 4,
				(i*(this.landscapeWidth-1) + j)*6 + 5
			]);
            landscapeStrip.nVertexIndices += 6;

            //Calculate the normals of two triangles
            var ULtriangleNormal = vec3.cross(vec3.create(),
            								  vec3.sub(vec3.create(), vert4, vert1),
											  vec3.sub(vec3.create(), vert2, vert1));
            vec3.normalize(ULtriangleNormal, ULtriangleNormal);
            var LRtriangleNormal = vec3.cross(vec3.create(),
                							  vec3.sub(vec3.create(), vert2, vert3),
											  vec3.sub(vec3.create(), vert4, vert3));
            vec3.normalize(LRtriangleNormal, LRtriangleNormal);
            if (isNaN(ULtriangleNormal[0])) {
            	console.log(i, j);
            }

            //Add one of two triangle normals to each vertex
			landscapeStrip.vertexNormals = landscapeStrip.vertexNormals.concat([
				ULtriangleNormal[0], ULtriangleNormal[1], ULtriangleNormal[2],
                ULtriangleNormal[0], ULtriangleNormal[1], ULtriangleNormal[2],
                ULtriangleNormal[0], ULtriangleNormal[1], ULtriangleNormal[2],
                LRtriangleNormal[0], LRtriangleNormal[1], LRtriangleNormal[2],
                LRtriangleNormal[0], LRtriangleNormal[1], LRtriangleNormal[2],
                LRtriangleNormal[0], LRtriangleNormal[1], LRtriangleNormal[2]
        	]);
        }
	}

    landscapeStrip.nNormals = landscapeStrip.vertexNormals.length / 3;

    //This is a last resort measure: to avoid double shaders for textured/untextured
    //every object needs a valid array object.textureCoords of length nVertices * 2
    landscapeStrip.textureCoords = new Array(landscapeStrip.nVertices * 2).fill(0.0);

    // Introduce the visibleObject representing a landscape strip to GRAPHICS
    GRAPHICS.loadObjectVertices(landscapeStrip);

    // Finally save it for future use (drawing)
    this.landscapeStrips.push(landscapeStrip);

    return moreStrips;
};

Landscape.prototype.getHeight = function (x, z) {
	//Interpolacija na trikotniku v baricentricnih koordinatah

	if (x < 0 ||
		z < 0 ||
		x > this.landscapeWidth - 1 ||
		z > this.landscapeDepth - 1) {
		return false;
	}

	const P1x = Math.floor(x);
    const P1z = Math.ceil(z);
    const P2x = Math.ceil(x);
    const P2z = Math.floor(z);
	var P3x = 0;
    var P3z = 0;
    const height1 = this.getPixelHeight(P1x, P1z);
    const height2 = this.getPixelHeight(P2x, P2z);
    var   height3 = 0;
    var dhBYdx = 0;
    var dhBYdz = 0;
    if ((x % 1) + (z % 1) < 1) {
		P3x = Math.floor(x);
		P3z = Math.floor(z);
        height3 = this.getPixelHeight(P3x, P3z);

        //classic interpolation
        //dhBYdx = P2x - P3x != 0 ? (height2 - height3)/(P2x - P3x) : 0;
        //dhBYdz = P1x - P3x != 0 ? (height1 - height3)/(P1x - P3x) : 0;
	} else {
		P3x = Math.ceil(x);
		P3z = Math.ceil(z);
        height3 = this.getPixelHeight(P3x, P3z);

        //classic interpolation
        //dhBYdx = P3x - P1x != 0 ? (height3 - height1)/(P3x - P1x) : 0;
        //dhBYdz = P3x - P2x != 0 ? (height3 - height2)/(P3x - P2x) : 0;
	}

    //classic interpolation
    //const landscapeHeight = height1 + dhBYdx*(x - P1x) + dhBYdz*(z - P1z);

	//Implementirano interpoliranje z baricentricnimi koordinatami - klasicno
	//interpoliranje po weight = 1/dist se je izkazalo za neprimerno, clipping
	//ob vzponih in padcih

    //Do not divide by 0
	if (((P2z - P3z)*(P1x - P3x) + (P3x - P2x)*(P1z - P3z)) === 0 ||
    	((P2z - P3z)*(P1x - P3x) + (P3x - P2x)*(P1z - P3z)) === 0) {
    	return false;
    }

	//This will always result in a float, as x and z are floats
    const weight1 = ((P2z - P3z)*(x - P3x) + (P3x - P2x)*(z - P3z)) /
					((P2z - P3z)*(P1x - P3x) + (P3x - P2x)*(P1z - P3z));
    const weight2 = ((P3z - P1z)*(x - P3x) + (P1x - P3x)*(z - P3z)) /
					((P2z - P3z)*(P1x - P3x) + (P3x - P2x)*(P1z - P3z));
    const weight3 = 1 - weight1 - weight2;

    const landscapeHeight = ((height1 * weight1) + (height2 * weight2) + (height3 * weight3)) /
    						(weight1 + weight2 + weight3);

    var snowHeight = 0;

    //If landscape is covered with snow, return height at landscape + snow cover
	if (GAME_OBJECT_MANAGER.getSnow()) {
		snowHeight = GAME_OBJECT_MANAGER.getSnow().getHeight(x, z);
	}

	return Math.max(landscapeHeight, snowHeight);
};

Landscape.prototype.getPixelHeight = function (x, z) {
	//x and z are integers

	const k = Math.floor(z / this.stripDepth);

    return this.landscapeStrips[k].vertices[
		(z - k*this.stripDepth) * (this.landscapeWidth - 1) * 3 * 6 +	//z
    	x * 3 * 6 +														//x
    	1																//height value in x, y, z triplet
    ];
};