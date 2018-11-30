/////////////////////////////////////////////////
// VisibleObject.js______________________________
// osnovni parent class za vse, kar vidimo v igri
/////////////////////////////////////////////////

function VisibleObject() {

	//vertices will in the end still be some sort of array...
	//Vertices are loaded in the actual game object, probably from file
	this.vertices = [];
	this.colors = [1.0, 1.0, 1.0, 1.0];
	this.nVertices = 0;
	this.dynamicVertices = false;
	this.vertexIndices = [];
	this.nVertexIndices = 0;
	this.vertexNormals = [];
	this.hasTextures = false;
	this.textureCoords = [];
	this.texture;
	this.vertexPositionBuffer;
	this.vertexColorBuffer;
	this.vertexNormalsBuffer;
	this.vertexTextureCoordBuffer;
	this.vertexIndexBuffer;

	this.scale = 1.0;
	this.position = [0.0, 0.0, 0.0];
	this.yaw = 0.0;
	this.pitch = 0.0;

	//Creating an end object
	////////////////////////
	//Because js inheritance and OOP in general seems...wack, here is a guide on
	//creating an instantiatable gameObject:
	//
	//constructor():
	//	all of the things that need to be in the constructor should be implemented
	//	in some kind of a loadVertices() function, so that CONSTRUCTOR only
	//	contains the gameplay stuff
	//loadVertices():
	//	-fill this.vertices with vertices
    //	-set this.nVertices to n of vertices
	//	-parse colors into this.colors; even if the object uses textures,
	//	 this.colors needs to have at least one color in it
	//	-fill this.vertexNormals with normals (length is nVertices)
	//	-fill this.textureCoords; even if the objects only uses colors,
	//	 this.textureCoords needs to be a valid array of exactly length
	//	 nVertices * 2 (fill it with 0, if no actual textures)
	//	-call GRAPHICS.loadTexture(this, texturePath) if (and only if) object has a texture
	//	-fill this.vertexIndices
	//	-set this.nVertexIndices to n of vert indices
	//	-call this.findHeight() and this.findRadius() if object is collidable
	//	-GRAPHICS.loadObjectVertices(this)
	///////////////////////////////////////////////////////////////////////////////////////
}

VisibleObject.prototype.loadModel = function (path) {

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

VisibleObject.prototype.loadColors = function (colorsArray, verticesByColor) {

    this.colors = [];
    for (var n = 0; n < verticesByColor.length; n++) {
        for (let i = 0; i < verticesByColor[n]; i++) {
            this.colors = this.colors.concat(colorsArray[n]);
        }
    }
};

VisibleObject.prototype.setPosition = function (newPosition) {
	this.position = newPosition;
};

VisibleObject.prototype.setYaw = function (newAngle) {
	this.yaw = newAngle;
};

VisibleObject.prototype.moveForVector = function (moveVector) {
	for (var i = 0; i < 3; i++) {
		this.position[i] += moveVector[i];
	}
};

VisibleObject.prototype.getPosition = function () {
	return this.position;
};

VisibleObject.prototype.getYaw = function () {
	return this.yaw;
};

VisibleObject.prototype.draw = function (elapsedTime) {
	GRAPHICS.drawObject(this);
};