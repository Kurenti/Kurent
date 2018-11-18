/////////////////////////////////////////////////
// VisibleObject.js______________________________
// osnovni parent class za vse, kar vidimo v igri
/////////////////////////////////////////////////

function VisibleObject() {

	//vertices will in the end still be some sort of array...
	//Vertices are loaded in the actual game object, probably from file
	this.vertices = [];
	this.colors = [];
	this.nVertices = 0;
	this.vertexIndices = [];
	this.nVertexIndices = 0;
	this.vertexPositionBuffer;
	this.vertexColorBuffer;
	this.vertexIndexBuffer;

	this.position = [0.0, 0.0, 0.0];
	this.rotation = 0.0;
	// currently only rotation about vertical axis, implement other as necessary

}

VisibleObject.prototype.setPosition = function (newPosition) {
	this.position = newPosition;
};

VisibleObject.prototype.setRotation = function (newAngle) {
	this.rotation = newAngle;
};

VisibleObject.prototype.move = function (moveVector) {
	// this is useless, TODO: use some kind of sleek and slim 3D vector
	for (var i = 0; i < 3; i++) {
		this.position[i] += moveVector[i];
	}
};

VisibleObject.prototype.rotate = function (angle) {
	this.rotation += angle;
};

VisibleObject.prototype.getPosition = function () {
	return this.position;
};

VisibleObject.prototype.getRotation = function () {
	return this.rotation;
};

VisibleObject.prototype.update = function (elapsedTime) {
	// To be overriden in children
	console.log("parent");
};

VisibleObject.prototype.draw = function (elapsedTime) {
	GRAPHICS.drawObject(this.vertexPositionBuffer,
						this.vertexColorBuffer,
						this.vertexIndexBuffer,
						this.position,
						this.rotation);
};