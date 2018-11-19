//////////////////////////////
// PlayerObject.js____________
// A contollable player object
//////////////////////////////

function PlayerObject (controls) {
	this.controls = controls;

	this.loadVertices();

	this.setPosition([0.0, 0.0, 0.0]);
	this.setAngle(180.0);
	this.setYaw(180.0);
    this.setSpeed(3.0);
    this.setAngularSpeed(80.0);
}
PlayerObject.prototype = new CollidableObject();

PlayerObject.prototype.update = function (elapsedTime) {

	this.control(elapsedTime);
	
	// Gameplay stuff
};

PlayerObject.prototype.control = function (elapsedTime) {

	this.moveInDirection(elapsedTime,
						 this.controls.yRotation,
						 this.controls.speed);

	this.controlCamera();

	// Other controlls follow here
};

PlayerObject.prototype.controlCamera = function () {

	// Set up realative position of camera and rotate around player by yaw
	var cameraPosition = vec3.fromValues(0.0, 5.0, -8.0);
	vec3.rotateY(cameraPosition, cameraPosition,
				[0.0, 0.0, 0.0], degToRad(this.getYaw()));

	// Move to character
	vec3.add(cameraPosition, cameraPosition, vec3.fromValues(this.getPosition()[0],
															 this.getPosition()[1],
															 this.getPosition()[2]));
	vec3.scale(cameraPosition, cameraPosition, -1);

	// Set viewport
	GRAPHICS.viewport.setPosition(cameraPosition);
	GRAPHICS.viewport.setYaw(180.0 - this.getYaw());
	GRAPHICS.viewport.setPitch(15.0);

};

// This is bound to change
PlayerObject.prototype.loadVertices = function () {
	
	this.vertices = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];
    this.colors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [1.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 1.0, 0.0, 1.0], // Top face
        [1.0, 0.5, 0.5, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 0.0, 1.0, 1.0]  // Left face
    ];
    this.nVertices = 24;

    this.vertexIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];
	this.nVertexIndices = 36;

    this.findHeight();
    this.findRadius();
    GRAPHICS.loadObjectVertices(this);
};