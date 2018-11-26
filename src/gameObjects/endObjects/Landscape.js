///////////////////////////////////////
// Landscape.js________________________
// Object that represents the landscape
///////////////////////////////////////

function Landscape () {

	this.landscapeWidth = 0;
	this.landscapeDepth = 0;
	this.loadModel("assets/heightmap/testHeightmap.json");
}
Landscape.prototype = new VisibleObject();

Landscape.prototype.handleLoadedModel = function (landscapeData) {
	//Handle data read from file - landscapeData must be an object

	// Load map width and depth
	this.landscapeWidth = landscapeData.heightmapWidth;
	this.landscapeDepth = landscapeData.heightmapDepth;

	// Load vertex data
	this.vertices = landscapeData.heightmapVertices;
	//Color data should somehow be received from the .json object
	this.colors = [[0.33, 0.67, 0.26, 1.0]];
	this.nVertices = this.vertices.length / 3;
	//This is a last resort measure: to avoid double shaders for textured/untextured
    //every object needs a valid array object.textureCoords of length nVertices * 2
	//If it turns out landscape does need real texture coords, parse that in the
	//Python heightmap reader!
    this.textureCoords = new Array(this.nVertices * 2).fill(0.0);
	
	// Calculate faces
	//Walk over grid even though the this.vertices is a 1D array (and so
	//will be this.vertexIndices)
	//TODO:save this somewhere, it makes no sense to recalculate
	//every time (especially for higher resolution maps)
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

	GRAPHICS.loadObjectVertices(this);
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