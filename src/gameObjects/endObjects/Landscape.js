///////////////////////////////////////
// Landscape.js________________________
// Object that represents the landscape
///////////////////////////////////////

function Landscape () {

	this.landscapeWidth = 0;
	this.landscapeDepth = 0;
	this.stripDepth = 0;
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

    var request = new XMLHttpRequest();
    request.open("GET", path);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            this.handleLoadedModel(JSON.parse(request.responseText));
        }
    }.bind(this);
    request.send();

    //Running from local (non-server) will trigger CORS, JSON.parse
    //will fail on an empty request.responseText string with SintaxError
};

Landscape.prototype.handleLoadedModel = function (landscapeData) {
	//Handle data read from file - landscapeData must be an object of landscape strips

	//Walk over strips in the json landscape data file
	for (var k in landscapeData) {
		//for each key gotten check if it's really a key (not a method of the object)
		if (landscapeData.hasOwnProperty(k)) {
			this.handleLandscapeStrip(landscapeData[k]);
		}
	}

	//After the landscape is loaded, cover it with snow!
    GAME_OBJECT_MANAGER.add(new Snow(), ObjectTypes.Snow);
};

Landscape.prototype.handleLandscapeStrip = function (landscapeStripData) {

    // Load map width and depth
    this.landscapeWidth = landscapeStripData.heightmapWidth;
    this.landscapeDepth += landscapeStripData.heightmapDepth;
    // Set stripDepth to depth of first strip
	if (!this.stripDepth) {
		this.stripDepth = landscapeStripData.heightmapDepth;
	}

    // Create a new generic visibleObject
	var landscapeStrip = new VisibleObject();

	//It is either vertex coordinates in heightmapReader are set to image origin (not strip origin) or this!
	//landscapeStrip.setPosition([landscapeStripData.heightmapX, 0, landscapeStripData.heightmapZ]);

	// Populate it with stripData
    // Load vertex data
    landscapeStrip.vertices = landscapeStripData.heightmapVertices;
    landscapeStrip.nVertices = landscapeStripData.heightmapNVertices;
    //Color data should somehow be received from the .json object
    landscapeStrip.colors = [[0.33, 0.67, 0.26, 1.0]];
    //This is a last resort measure: to avoid double shaders for textured/untextured
    //every object needs a valid array object.textureCoords of length nVertices * 2
    //If it turns out landscape does need real texture coords, parse that in the
    //Python heightmap reader!
    landscapeStrip.textureCoords = new Array(landscapeStrip.nVertices * 2).fill(0.0);

    landscapeStrip.vertexIndices = landscapeStripData.heightmapVertexIndices;
    landscapeStrip.nVertexIndices = landscapeStripData.heightmapNVertexIndices;

    // Introduce the visibleObject representing a landscape strip to GRAPHICS
    GRAPHICS.loadObjectVertices(landscapeStrip);

    // Finally save it for future use (drawing)
	this.landscapeStrips.push(landscapeStrip);
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

        //dhBYdx = P2x - P3x != 0 ? (height2 - height3)/(P2x - P3x) : 0;
        //dhBYdz = P1x - P3x != 0 ? (height1 - height3)/(P1x - P3x) : 0;
	} else {
		P3x = Math.ceil(x);
		P3z = Math.ceil(z);
        height3 = this.getPixelHeight(P3x, P3z);

        //dhBYdx = P3x - P1x != 0 ? (height3 - height1)/(P3x - P1x) : 0;
        //dhBYdz = P3x - P2x != 0 ? (height3 - height2)/(P3x - P2x) : 0;
	}

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