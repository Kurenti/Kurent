////////////////////////////////////////////
// Ice.js___________________________________
// Object controling the deathly ice in game
////////////////////////////////////////////

function Ice (position, width) {


    this.width = width*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth / 64.0);

    this.loadVertices(position);
}
Ice.prototype = new VisibleObject();

Ice.prototype.loadVertices = function (position) {

    // Load vertex data
    this.vertices = [
        -this.width, 0.0, -this.width,
        -this.width, 0.0,  this.width, //*of top left triangle
        this.width, 0.0, -this.width,  //*of top left triangle
        this.width, 0.0,  this.width,
        -this.width, 0.0,  this.width, //*of bot right triangle
        this.width, 0.0, -this.width,  //*of bot right triangle
    ];
    this.nVertices = 6;
    //Set up normals
    this.vertexNormals = [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ];
    //Make light blue
    this.colors = [[0.72, 0.8, 1.0, 1.0]];
    this.textureCoords = new Array(this.nVertices * 2).fill(0.0);
    //Set up indices
    this.vertexIndices = [
        0, 1, 2, 3, 4, 5,
    ];
    this.nVertexIndices = 6;
    //Set position
    this.setPosition(position);

    //Introduce the snowCubicle to GRAPHICS
    GRAPHICS.loadObjectVertices(this);
};