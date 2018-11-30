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
    ////////////////////
    // Dancing
    this.bestDance = 0; //current known best dance - starts with zero (no dances)
    this.dancing = 0;   //this is 0 (false) if not dancing or 1-4 according to dance power
    this.danceTime = 0.0;   //current dance time
    this.danceTimes = [ //dance times in sec - ordered by dance power
        2.5, 2.0, 1.0, 1.2
    ];
    this.bell = null;   //Set to bell object when received

    // Falling in lake
    this.fallenInLake = false;

    //Interaction - implemented very unscalably, lack time for more
    this.nearBell = false;
    this.nearVillager = false;
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

    //Movement
    //////////
    //If dead just drift into lake
    if (this.fallenInLake) {
        this.moveInDirection(elapsedTime, 0,0.3);
        return;
    }

    if (GAME_OBJECT_MANAGER.getSnow()) {
        //Automatic snow melting under feet
        if (this.autoMelting) {
            GAME_OBJECT_MANAGER.getSnow().meltAt(this.getPosition(), 2, elapsedTime);
        }

        //Cover stuff to do while not dancing
        if (!this.dancing) {
            //Only move when not dancing
            this.control(elapsedTime);

            //Check if need to start dancing (only if given dance already unlocked)
            if (this.controls.attack && this.controls.attack <= this.bestDance) {
                this.dancing = this.controls.attack;
            }

        //Stuff to do while dancing (not much):
        } else {
            //Only rotate and move down
            this.control(elapsedTime, 0);

            //Check if done dancing
            if (this.danceTime > this.danceTimes[this.dancing - 1]) {
                this.dancing = 0;
                this.danceTime = 0.0;
            } else {
                //else DANCE!
                GAME_OBJECT_MANAGER.getSnow().meltAt(this.getPosition(), this.dancing, elapsedTime);
                this.danceTime += (elapsedTime / 1000); //elapsed time in ms
            }
        }
    } else {
        //Move whether there's snow or not I guess...
        this.control(elapsedTime);
    }

    //Check for event proximity
    ///////////////////////////
    // First bell
    if (this.nearBell && this.bestDance === 0) {
        console.log("I main Alistair");
    }
    // Villager
    if (this.nearVillager && this.bestDance < 3) {
        console.log("Talking to villager");
    }

    //Control bell
    if (this.bell) {
        this.bell.update(this.getPosition(), this.getYaw());
    }

    //Reset interaction flags
    this.nearBell = false;
    this.nearVillagers = false;
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

	// Set viewport
	vec3.negate(cameraPosition, cameraPosition);
	GRAPHICS.viewport.setPosition(cameraPosition);
	GRAPHICS.viewport.setYaw(cameraYaw);
	GRAPHICS.viewport.setPitch(15.0);

};

//Function that deals with death - this happens during collision!
PlayerObject.prototype.fallInLake = function () {
    console.log("umrl");
    this.fallenInLake = true;
};