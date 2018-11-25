///////////////////////////////
// PlayerObject.js_____________
// A controllable player object
///////////////////////////////

function PlayerObject (controls) {
	this.controls = controls;

	this.loadModel("assets/models/kurent.json");

	this.setPosition([5.0, 1.0, 3.0]);
	this.setAngle(0.0);
	this.setYaw(0.0);
    this.setSpeed(8.0);
    this.setAngularSpeed(100.0);
}
PlayerObject.prototype = new CollidableObject();

PlayerObject.prototype.handleLoadedModel = function (data) {
	
	this.vertices = data.vertices;
    this.colors = [
        [0.937, 0.902, 0.827, 1.0] // Beige
    ];
    this.nVertices = this.vertices.length / 3;

    this.vertexIndices = data.faces;
	this.nVertexIndices = this.vertexIndices.length;

    this.findHeight();
    this.findRadius();
    GRAPHICS.loadObjectVertices(this);
};

PlayerObject.prototype.update = function (elapsedTime) {

	this.control(elapsedTime);
	
	// Gameplay stuff
};

PlayerObject.prototype.control = function (elapsedTime) {

	this.moveInDirection(elapsedTime,
						 this.controls.yRotation,
						 this.controls.speed);

	this.controlCamera();

	// Other controls follow here
};

PlayerObject.prototype.controlCamera = function () {

	// Set up relative position of camera and rotate around player by yaw
	var cameraPosition = vec3.fromValues(0.0, 20.0, -25.0);
	var cameraYaw = 180.0;

	if (!document.getElementById("fixCamera").checked){
		vec3.rotateY(cameraPosition, cameraPosition,
					[0.0, 0.0, 0.0], degToRad(this.getYaw()));

		// Move to character
		vec3.add(cameraPosition, cameraPosition, this.getPosition());

		cameraYaw -= this.getYaw();
	}

	// Move on top of terrain if camera is inside terrain
	var landscapeCameraHeight = GAME_OBJECT_MANAGER.getLandscape().getHeight(cameraPosition[0], cameraPosition[2]);
	var landscapePlayerHeight = GAME_OBJECT_MANAGER.getLandscape().getHeight(this.getPosition()[0], this.getPosition()[2]);
	if (landscapeCameraHeight - landscapePlayerHeight > 5.0) {
		cameraPosition[1] = landscapeCameraHeight + 1;
	}

	// Set viewport
	vec3.negate(cameraPosition, cameraPosition);
	GRAPHICS.viewport.setPosition(cameraPosition);
	GRAPHICS.viewport.setYaw(cameraYaw);
	GRAPHICS.viewport.setPitch(15.0);

};