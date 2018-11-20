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

	//Load heightmap
	var srcImg = document.getElementById("heightmap");
	var heightmapCanvas = document.createElement("canvas");
	var img = new Image();
	img.crossOrigin = "Anonymous";

	img.src = srcImg.src;
	heightmapCanvas.width = img.width;
	heightmapCanvas.height = img.height;
	var heightmapContext  = heightmapCanvas.getContext('2d');
	heightmapContext.drawImage(img, 0, 0, img.width, img.height);

	//Walk over the heightmap and save each vertex into this.vertices
	for (var i = 0; i < img.height; i++) {
		for (var j = 0; j < img.width; j++) {
			var vertexHeight = heightmapContext.getImageData(j, i, 1, 1).data[0];
			//this.vertices.concat([j, vertexHeight, i]);
		}
	}

	this.landscapeWidth = testHeightmapWidth;
	this.landscapeDepth = testHeightmapDepth;

	// Load vertex data
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