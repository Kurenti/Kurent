////////////////////////////////////////////
// Ice.js___________________________________
// Object controling the deathly ice in game
////////////////////////////////////////////

function Ice (position) {

    this.icePlate;
    this.collisionBoxes = [];

    this.width = 8*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth / 64.0);

    this.spawnIce(position);
    this.makeCollision();
}

Ice.prototype.spawnIce = function (position) {

    this.icePlate = new VisibleObject();

    // Load vertex data
    this.icePlate.vertices = [
        -this.width, 0.0, -this.width,
        -this.width, 0.0,  this.width, //*of top left triangle
        this.width, 0.0, -this.width,  //*of top left triangle
        this.width, 0.0,  this.width,
        -this.width, 0.0,  this.width, //*of bot right triangle
        this.width, 0.0, -this.width,  //*of bot right triangle
    ];
    this.icePlate.nVertices = 6;
    //Set up normals
    this.icePlate.vertexNormals = this.makeNormals();
    //Make light blue
    this.icePlate.colors = [[0.8, 0.9312, 1.0, 1.0]];
    this.icePlate.textureCoords = new Array(this.icePlate.nVertices * 2).fill(0.0);
    //Set up indices
    this.icePlate.vertexIndices = [
        0, 1, 2, 3, 4, 5,
    ];
    this.icePlate.nVertexIndices = 6;
    //Set position
    this.icePlate.setPosition(position);

    //Introduce the snowCubicle to GRAPHICS
    GRAPHICS.loadObjectVertices(this.icePlate);
};

Ice.prototype.makeNormals = function (snowCubicle) {

    var normalTL = vec3.create();   //top-left
    var normalBR = vec3.create();   //bot-right
    vec3.cross(normalTL, vec3.fromValues(0.0,0.0, this.width), vec3.fromValues(this.width, 0.0, 0.0));
    vec3.cross(normalBR, vec3.fromValues(0.0,0.0, this.width), vec3.fromValues(this.width, 0.0, 0.0));
    vec3.normalize(normalTL, normalTL);
    vec3.normalize(normalBR, normalBR);
    var vertexNormals = [];
    vertexNormals = vertexNormals.concat([normalTL[0], normalTL[1], normalTL[2]]);
    vertexNormals = vertexNormals.concat([normalTL[0], normalTL[1], normalTL[2]]);
    vertexNormals = vertexNormals.concat([normalBR[0], normalBR[1], normalBR[2]]);
    vertexNormals = vertexNormals.concat([normalTL[0], normalTL[1], normalTL[2]]);
    vertexNormals = vertexNormals.concat([normalBR[0], normalBR[1], normalBR[2]]);
    vertexNormals = vertexNormals.concat([normalBR[0], normalBR[1], normalBR[2]]);
    return vertexNormals;
};

Ice.prototype.makeCollision = function () {

};

Ice.prototype.update = function () {
    //Check if any collision box has been collided with. If it has - kill player.
    this.collisionBoxes.forEach(function(collisionBox) {

    });
};

Ice.prototype.draw = function () {
    //Iterate over all ice plates and draw them
    this.icePlate.draw();
};