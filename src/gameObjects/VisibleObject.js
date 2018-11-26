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
	this.vertexIndices = [];
	this.nVertexIndices = 0;
	this.hasTextures = false;
	this.textureCoords = [];
	this.texture;
	this.vertexPositionBuffer;
	this.vertexColorBuffer;
	this.vertexTextureCoordBuffer;
	this.vertexIndexBuffer;

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
	//	-parse colors into this.colors; even if the object uses textures,
	//	 this.colors needs to have at least one color in it
	//	-fill this.textureCoords; even if the objects only uses colors,
	//	 this.textureCoords needs to be a valid array of exactly length
	//	 nVertices * 2 (fill it with 0, if no actual textures)
	//	-set this.nVertices to n of vertices
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

VisibleObject.prototype.setPosition = function (newPosition) {
	this.position = newPosition;
};

VisibleObject.prototype.setYaw = function (newAngle) {
	this.yaw = newAngle;
};

VisibleObject.prototype.moveForVector = function (moveVector) {
	// this is useless, TODO: use some kind of sleek and slim 3D vector
	for (var i = 0; i < 3; i++) {
		this.position[i] += moveVector[i];
	}
};

VisibleObject.prototype.rotateYaw = function (angle) {
	this.yaw += angle;
    this.yaw = this.yaw % 360.0;
};

VisibleObject.prototype.getPosition = function () {
	return this.position;
};

VisibleObject.prototype.getYaw = function () {
	return this.yaw;
};

VisibleObject.prototype.update = function (elapsedTime) {
	// To be overriden in children
};

VisibleObject.prototype.draw = function (elapsedTime) {
	GRAPHICS.drawObject(this);
};