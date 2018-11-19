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
	this.yaw = 0.0;
	this.pitch = 0.0;
}

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
	GRAPHICS.drawObject(this.vertexPositionBuffer,
						this.vertexColorBuffer,
						this.vertexIndexBuffer,
						this.position,
						this.yaw);
};