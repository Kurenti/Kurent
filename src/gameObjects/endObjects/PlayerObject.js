///////////////////////////////
// PlayerObject.js_____________
// A controllable player object
///////////////////////////////

function PlayerObject (controls) {
	this.controls = controls;

	//Scale to original model - this is used on load, not when drawing
	this.scale = 0.15;

	this.loadModel("assets/models/kurent.json");

	this.setPosition([40.0*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64.0),
                       0.0,
                      18.0*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64.0)]);
	this.setAngle(120.0);
	this.setYaw(120.0);
    this.setSpeed(8.0);
    this.setAngularSpeed(100.0);

    this.autoMelting = false;

    //gameplay variables (proto states...)
    this.bestDance = 4; //current known best dance - starts with zero (no dances)
    this.dancing = 0;   //this is 0 (false) if not dancing or 1-4 according to dance power
    this.danceTime = 0.0;   //current dance time
    this.danceTimes = [ //dance times in sec - ordered by dance power
        2.5, 2.0, 1.0, 1.0
    ]

}
PlayerObject.prototype = new CollidableObject();

PlayerObject.prototype.handleLoadedModel = function (data) {

	this.vertices = data.vertices.map( function (x) {
                        return x*this.scale;
                    }.bind(this));
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
    this.vertexNormals = data.vertexNormals;

    //Get triangles
    this.vertexIndices = data.faces;
	this.nVertexIndices = this.vertexIndices.length;

    this.findHeight();
    this.objHeight = 0.9*this.objHeight;    //height must be fixed a little here,
                                            //no time to fix the actual model loading sadly
    this.findRadius();
    GRAPHICS.loadObjectVertices(this);
    GAME_OBJECT_MANAGER.loaded = true;
};

PlayerObject.prototype.update = function (elapsedTime) {

    if (GAME_OBJECT_MANAGER.getSnow()) {
        //Automatic snow melting under feet
        if (this.autoMelting) {
            GAME_OBJECT_MANAGER.getSnow().meltAt(this.getPosition(), 2, elapsedTime);
        }

        //Cover stuff to do while not dancing
        if (!this.dancing) {
            //Only move when not dancing
            this.control(elapsedTime);

            //Check if need to start dancing
            if (this.controls.attack && this.controls.attack <= this.bestDance) {
                this.dancing = this.controls.attack;
            }
        //If dancing:
        } else {
            //Only rotate and move down
            this.control(elapsedTime, 0);
            //Check if done dancing
            if (this.danceTime > this.danceTimes[this.dancing - 1]) {
                this.dancing = 0;
                this.danceTime = 0.0;
            } else {
                GAME_OBJECT_MANAGER.getSnow().meltAt(this.getPosition(), this.dancing, elapsedTime);
                this.danceTime += (elapsedTime / 1000); //elapsed time in ms
            }
        }
    } else {
        //Move whether there's snow or not I guess...
        this.control(elapsedTime);
    }
};

PlayerObject.prototype.control = function (elapsedTime, movementFix = 1) {

    if (this.onSnow) {
        //If on snow, move more slowly
        movementFix = 0.5*movementFix;
    }

	this.moveInDirection(elapsedTime,
						 this.controls.yRotation,
						 this.controls.speed*movementFix);

	this.controlCamera();
};

PlayerObject.prototype.controlCamera = function () {

	// Set up relative position of camera and rotate around player by yaw
	var cameraPosition = vec3.fromValues(0.0, 4.0, -7.0);
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
    this.vertexNormals = [
        // Front face
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        // Back face
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,

        // Top face
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,

        // Bottom face
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        // Right face
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,

        // Left face
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
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