///////////////////////////////////////
// Landscape.js________________________
// Object that represents the landscape
///////////////////////////////////////

function Landscape () {

	this.landscapeWidth = 0;
	this.landscapeDepth = 0;
	this.loadLandscape();
}
Landscape.prototype = new VisibleObject();

Landscape.prototype.loadLandscape = function () {

	//JSON implemented but I need to do the Webstorm thing first...
	//
	//var request = new XMLHttpRequest();
	//request.open("GET", "assets/heightmap/testHeightmap.json");
	//var onReadyFunc = function () {
    //    if (request.readyState == 4) {
    //    	this.handleLoadedLandscape(request.responseText);
    //    }
    //};
    //request.onreadystatechange = onReadyFunc.call(this);
	//request.send();

	//Running from local (non-server) will trigger CORS, JSON.parse
	//will fail on an empty request.responseText string with SintaxError
	//Fallback to this shite for now...

	// Load map width and depth
	this.landscapeWidth = testHeightmapWidth;
	this.landscapeDepth = testHeightmapDepth;

	// Load vertex data
	this.vertices = testHeightmapVertices;
	this.colors = [[0.33, 0.67, 0.26, 1.0]];
	this.nVertices = this.vertices.length / 3;
	this.vertexNormals = null;
	this.loadVertexIndices();

	GRAPHICS.loadObjectVertices(this);
};

Landscape.prototype.handleLoadedLandscape = function (responseText) {
	var landscapeData = JSON.parse(responseText);

	// Load map width and depth
	this.landscapeWidth = landscapeData.heightmapWidth;
	this.landscapeDepth = landscapeData.heightmapDepth;

	// Load vertex data
	this.vertices = landscapeData.heightmapVertices;
	this.colors = [[0.33, 0.67, 0.26, 1.0]];
	this.nVertices = this.vertices.length / 3;
	this.loadVertexIndices();

	GRAPHICS.loadObjectVertices(this);
};

Landscape.prototype.loadVertexIndices = function (landscapeData) {
	
	//Walk over grid even though the this.vertices is a 1D array (and so
	//will be this.vertexIndices)
	for (var i = 0; i < this.landscapeDepth - 1; i++) {
		for (var j = 0; j < this.landscapeWidth - 1; j++) {

			//Transform 2D location to position in 1D array
			var nVertex = i * this.landscapeWidth + j

			//Append the 2 triangles
			this.vertexIndices = this.vertexIndices.concat(
				[nVertex, nVertex + 1, nVertex + this.landscapeWidth,							//Upper-left triangle
				 nVertex + 1, nVertex + this.landscapeWidth, nVertex + this.landscapeWidth + 1]	//Lower-right triangle
			);
			//Increment n of vertex indices by 6 (2*triangle)
			this.nVertexIndices += 6;
		}
	}
};

Landscape.prototype.getHeight = function (x, z) {
	//Interpolacija na trikotniku v baricentricnih koordinatah

	if (x < 0 ||
		z < 0 ||
		x > this.landscapeWidth - 1 ||
		z > this.landscapeDepth - 1) {
		return false;
	}

	var P1x = Math.floor(x);
	var P1z = Math.ceil(z);
	var P2x = Math.ceil(x);
	var P2z = Math.floor(z);
	if ((x % 1) + (z % 1) < 1) {
		var P3x = Math.floor(x);
		var P3z = Math.floor(z);
	} else {
		var P3x = Math.ceil(x);
		var P3z = Math.ceil(z);
	}

	var height1 = this.getPixelHeight(P1x, P1z);
	var height2 = this.getPixelHeight(P2x, P2z);
	var height3 = this.getPixelHeight(P3x, P3z);

	//Implementirano interpoliranje z baricentricnimi koordinatami - klasicno
	//interpoliranje po weight = 1/dist se je izkazalo za neprimerno, clipping
	//ob vzponih in padcih

	if (((P2z - P3z)*(P1x - P3x) + (P3x - P2x)*(P1z - P3z)) === 0 ||
		((P2z - P3z)*(P1x - P3x) + (P3x - P2x)*(P1z - P3z)) === 0) {
		return false;
	}

	var weight1 = ((P2z - P3z)*(x - P3x) + (P3x - P2x)*(z - P3z)) /
				  ((P2z - P3z)*(P1x - P3x) + (P3x - P2x)*(P1z - P3z));
	var weight2 = ((P3z - P1z)*(x - P3x) + (P1x - P3x)*(z - P3z)) /
				  ((P2z - P3z)*(P1x - P3x) + (P3x - P2x)*(P1z - P3z));
	var weight3 = 1 - weight1 - weight2;

	return ((1.0*height1 * weight1) + (1.0*height2 * weight2) + (1.0*height3 * weight3)) /
		   (weight1 + weight2 + weight3);
};

Landscape.prototype.getPixelHeight = function (x, z) {
	return this.vertices[
		z * this.landscapeWidth * 3 + 	//z
		x * 3 +							//x
		1								//height value
	];
};