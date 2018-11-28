///////////////////////////////
// PlayerObject.js_____________
// A controllable player object
///////////////////////////////

function PlayerObject (controls) {
	this.controls = controls;

	//this.loadModel("assets/models/kurent.json");
	this.loadVertices();

	this.setPosition([5.0, 0.0, 3.0]);	//Y position is set appropriately only after objHeight is calculated
	this.setAngle(0.0);
	this.setYaw(0.0);
    this.setSpeed(8.0);
    this.setAngularSpeed(100.0);
}
PlayerObject.prototype = new CollidableObject();

PlayerObject.prototype.handleLoadedModel = function (data) {

	this.vertices = data.vertices;
    this.nVertices = this.vertices.length / 3;
	//Construct colors list from data["verticesByColor"] numbers and by manually reading .mtl file
    this.loadColors([
            [0.413866, 0.392996, 0.252348, 1.0],
            [0.640000, 0.005496, 0.022123, 1.0],
            [0.031744, 0.007907, 0.017131, 1.0],
            [0.529491, 0.451677, 0.437904, 1.0]
        ],
        data.verticesByColor);
    //This is a last resort measure: to avoid double shaders for textured/untextured
	//every object needs a valid array object.textureCoords of length nVertices * 2
    this.textureCoords = new Array(this.nVertices * 2).fill(0.0);

    //Get normals
    var vertexNormals = data.vertexNormals;

    //Get triangles
    this.vertexIndices = data.faces;
	this.nVertexIndices = this.vertexIndices.length;

    this.findHeight();
    this.findRadius();
    GRAPHICS.loadObjectVertices(this);
};

PlayerObject.prototype.update = function (elapsedTime) {

	this.control(elapsedTime);

	// Gameplay stuff
    if (GAME_OBJECT_MANAGER.getSnow()) {
        GAME_OBJECT_MANAGER.getSnow().meltAt(this.getPosition(), 1, elapsedTime);
    }
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
	var cameraPosition = vec3.fromValues(0.0, 10.0, -20.0);
	var cameraYaw = 180.0;

	if (!document.getElementById("fixCamera").checked){
		vec3.rotateY(cameraPosition, cameraPosition,
					[0.0, 0.0, 0.0], degToRad(this.getYaw()));

		// Move to character
		vec3.add(cameraPosition, cameraPosition, this.getPosition());

		cameraYaw -= this.getYaw();

		// Move on top of terrain if camera is inside terrain
		const landscapeCameraHeight = GAME_OBJECT_MANAGER.getLandscape().getHeight(cameraPosition[0], cameraPosition[2]);
		if (cameraPosition[1] < landscapeCameraHeight) {
			cameraPosition[1] = landscapeCameraHeight + 1;
		}
	}

	// Set viewport
	vec3.negate(cameraPosition, cameraPosition);
	GRAPHICS.viewport.setPosition(cameraPosition);
	GRAPHICS.viewport.setYaw(cameraYaw);
	GRAPHICS.viewport.setPitch(15.0);

};

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
    this.textureCoords = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
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