/////////////////////////////////////
// Villager.js_______________________
// A simple AI character that can be
// interacted with and moves randomly
/////////////////////////////////////

function Villager (position, trigger) {

    this.scale = 0.6;
    this.loadVertices();

    this.startingPosition = position;   //this limits movement to around starting position
    this.setPosition(position); //y is set by this.getHeight
    this.setYaw(0.0);
    this.setAngle(0.0);
    this.maxSpeed = 0.5;
    this.setAngularSpeed(Math.random() * 61 - 30);

    // Gameplay
    ///////////
    //AI
    this.sinceLastTurn = 0.0;
    this.movementPeriod = 3.0;
    //Bell
    this.bell = new BellObject(this.getPosition(), 0.25, [0.41, -0.4, 0.0]);
    GAME_OBJECT_MANAGER.add(this.bell);
    //Interaction trigger
    this.intTrigger = trigger;
}
Villager.prototype = new CollidableObject();

Villager.prototype.update = function (elapsedTime) {

    // Randomize movement every this.movementPeriod seconds
    if (this.sinceLastTurn > this.movementPeriod) {
        this.sinceLastTurn = 0.0;

        this.setAngle(Math.random() * 366);
        this.setSpeed(Math.random() * this.maxSpeed);
    }

    // Move
    this.moveInDirection(elapsedTime,0,1);
    this.sinceLastTurn += elapsedTime / 1000;

    // limit movement to around house (starting point)
    if (vec3.len(vec3.sub(vec3.create(), this.getPosition(), this.startingPosition)) > 14) {
        this.setSpeed(0.0);
        this.sinceLastTurn = this.movementPeriod - 0.5;
    }

    // Make bell and interaction trigger box follow villager
    if (this.bell) {
        this.bell.update(this.getPosition(), this.getYaw());
    }
    this.intTrigger.setPosition(this.getPosition());
};

Villager.prototype.looseBell = function () {
    const bellTemp = this.bell;
    this.bell = null;
    return bellTemp;
};

Villager.prototype.loadVertices = function () {

    //Load simple cube vertices
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
    // rescale
    this.vertices = this.vertices.map( function (x) {
        return x*this.scale;
    }.bind(this));
    // load normals
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
    // six colors, one for each face
    this.colors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [1.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 1.0, 0.0, 1.0], // Top face
        [1.0, 0.5, 0.5, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 0.0, 1.0, 1.0]  // Left face
    ];
    // texture coords - textures are implemented, but not used
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

    // set up triangles
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