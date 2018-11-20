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

	this.landscapeWidth = testHeightmapWidth;
	this.landscapeDepth = testHeightmapDepth;

	// Load vertex data
	//TODO: this will be changed to reading a json file
	this.vertices = testHeightmapVertices;
	this.colors = [[0.33, 0.67, 0.26, 1.0]];
	this.nVertices = this.vertices.length / 3;
	this.loadVertexIndices();

    GRAPHICS.loadObjectVertices(this);
};

Landscape.prototype.loadVertexIndices = function () {
	
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
		x > this.landscapeWidth ||
		z > this.landscapeDepth - 1) {
		return 0;
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

	var dist1 = Math.sqrt((x - P1x)*(x - P1x) + (z - P1z)*(z - P1z));
	var dist2 = Math.sqrt((x - P2x)*(x - P2x) + (z - P2z)*(z - P2z));
	var dist3 = Math.sqrt((x - P3x)*(x - P3x) + (z - P3z)*(z - P3z));

	var height1 = this.getPixelHeight(P1x, P1z);
	var height2 = this.getPixelHeight(P2x, P2z);
	var height3 = this.getPixelHeight(P3x, P3z);

	return ((1.0*height1 / dist1) + (1.0*height2 / dist2) + (1.0*height3 / dist3)) /
		   ((1.0 / dist1) + (1.0 / dist2) + (1.0 / dist3));
};

Landscape.prototype.getPixelHeight = function (x, z) {
	return this.vertices[
		z * this.landscapeWidth * 3 + 	//z
		x * 3 +							//x
		1								//height value
	];
};