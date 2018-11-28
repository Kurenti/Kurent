////////////////////////////////////
// Snow.js__________________________
// Object that controls snow in game
////////////////////////////////////

function Snow () {

    //snow parts are called snowCubes throughout class even though they are planes
    this.snowWidth = 0;
    this.snowDepth = 0;
    this.snowThickness = 2; //Bit of a misnomer - snowWidth x snowDepth == x * z; thickness == height (y)
    this.snowCubeWidth = 3;
    this.snowCubes = [];
    this.spawnSnow();
}

Snow.prototype.draw = function () {
    this.snowCubes.forEach( function (snowCube) {
        snowCube.draw();
    });
};

// Improve GameObjectManager so as not to need this
Snow.prototype.update = function () {};

Snow.prototype.meltAt = function (position, strength, elapsedTime) {

    const change = strength*elapsedTime/4000;
    const radius = (strength + 0.5)*this.snowCubeWidth;

    const changedCubes = [];
    for (var i = 0; i < 2*strength+1; i++) {
        for (var j = 0; j < 2*strength+1; j++) {

            const changedCube = this.getSnowCubeAt([position[0] + ((j-strength) * this.snowCubeWidth),
                                                            position[1],
                                                            position[2] + ((i-strength) * this.snowCubeWidth)]);
            if (changedCube) {
                for (var vert = 1; vert < 17; vert += 3) {
                    if ((i === 0 && (vert === 1 || vert === 10 || vert === 16)) ||
                        (i === 2*strength && (vert === 4 || vert === 7|| vert === 13)) ||
                        (j === 0 && (vert === 1 || vert === 4 || vert === 13)) ||
                        (j === 2*strength && (vert === 7 || vert === 10 || vert === 16))) {
                        continue;
                    }
                    const vertX = changedCube.getPosition()[0] + changedCube.vertices[vert - 1];
                    const vertZ = changedCube.getPosition()[2] + changedCube.vertices[vert + 1];

                    var vertDistance = vec3.create();
                    vec3.sub(vertDistance, [vertX, 0, vertZ], [position[0], 0, position[2]]);
                    vertDistance = vec3.len(vertDistance);

                    if (changedCube.vertices[vert] >
                        GAME_OBJECT_MANAGER.getLandscape().getHeight(vertX, vertZ)
                                - this.snowThickness / 2.0) {
                        changedCube.vertices[vert] -= change * (1 - vertDistance / radius);
                    }
                }

                //Recalculate normals
                var vertexNormals = this.makeNormals(changedCube);

                //This needs to also move normals in the future
                GRAPHICS.moveVertices(changedCube.vertexPositionBuffer, changedCube.vertices);
            }
        }
    }
};

Snow.prototype.getSnowCubeAt = function (position) {

    const cubeZ = Math.floor(position[0]/this.snowCubeWidth );
    const cubeX = Math.floor(position[2]/this.snowCubeWidth );

    if (cubeX < 0 ||
        cubeX > this.snowWidth - 1 ||
        cubeZ < 0 ||
        cubeZ > this.snowDepth - 1) {
        return false;
    }

    return this.snowCubes[cubeZ*this.snowWidth + cubeX];
};

Snow.prototype.getHeight = function (x, z) {

    const snowCube = this.getSnowCubeAt([x, 0, z]);

    //This does not follow point numbering in this.meltAt, but point numbering at landscape.getHeight!
    const height1 = snowCube.vertices[4];
    const height2 = snowCube.vertices[10];
    var height3 = 0;

    const P1x = -this.snowCubeWidth / 2;
    const P1z = this.snowCubeWidth / 2;
    const P2x = this.snowCubeWidth / 2;
    const P2z = -this.snowCubeWidth / 2;
    var P3x = 0;
    var P3z = 0;
    var posX = x % (this.snowCubeWidth / 2);
    var posZ = z % (this.snowCubeWidth / 2);

    var dhBYdx = 0;
    var dhBYdz = 0;

    if (posX + posZ < 1) {
        height3 = snowCube.vertices[1];
        P3x = -this.snowCubeWidth / 2;
        P3z = -this.snowCubeWidth / 2;

        //classic interpolation
        //dhBYdx = P2x - P3x != 0 ? (height2 - height3)/(P2x - P3x) : 0;
        //dhBYdz = P1x - P3x != 0 ? (height1 - height3)/(P1x - P3x) : 0;
    } else {
        height3 = snowCube.vertices[7];
        P3x = this.snowCubeWidth / 2;
        P3z = this.snowCubeWidth / 2;

        //classic interpolation
        //dhBYdx = P3x - P1x != 0 ? (height3 - height1)/(P3x - P1x) : 0;
        //dhBYdz = P3x - P2x != 0 ? (height3 - height2)/(P3x - P2x) : 0;
    }

    //classic interpolation
    //return height1 + dhBYdx*(posX - P1x) + dhBYdz*(posZ - P1z);

    //Implementirano interpoliranje z baricentricnimi koordinatami

    //Do not divide by 0
    if (((P2z - P3z)*(P1x - P3x) + (P3x - P2x)*(P1z - P3z)) === 0 ||
        ((P2z - P3z)*(P1x - P3x) + (P3x - P2x)*(P1z - P3z)) === 0) {
        return false;
    }

    //This will always result in a float, as x and z are floats (also, division)
    const weight1 = ((P2z - P3z) * (posX - P3x) + (P3x - P2x) * (posZ - P3z)) /
                    ((P2z - P3z) * (P1x - P3x) + (P3x - P2x) * (P1z - P3z));
    const weight2 = ((P3z - P1z) * (posX - P3x) + (P1x - P3x) * (posZ - P3z)) /
                    ((P2z - P3z) * (P1x - P3x) + (P3x - P2x) * (P1z - P3z));
    const weight3 = 1 - weight1 - weight2;

    return ((height1 * weight1) + (height2 * weight2) + (height3 * weight3)) /
            (weight1 + weight2 + weight3);
};

Snow.prototype.spawnSnow = function () {
    const landscape = GAME_OBJECT_MANAGER.getLandscape();
    for (var i = 1; i < landscape.landscapeDepth; i += this.snowCubeWidth) {
        for (var j = 1; j < landscape.landscapeWidth; j += this.snowCubeWidth) {
            this.snowCubes.push(this.makeSnowCubicle([i, 0, j], this.snowCubeWidth / 2.0));
        }
        this.snowWidth = Math.round(j/this.snowCubeWidth);
    }
    this.snowDepth = Math.round(i/this.snowCubeWidth);
};

Snow.prototype.makeSnowCubicle = function (position, width) {

    var snowCubicle = new VisibleObject();
    const thickness = this.snowThickness/2.0;
    const landscape = GAME_OBJECT_MANAGER.getLandscape();

    var p1height = landscape.getHeight(position[0] + this.snowCubeWidth / 2.0,
                                         position[2] + this.snowCubeWidth / 2.0);
    if (!p1height) {p1height = 0}
    var p2height = landscape.getHeight(position[0] + this.snowCubeWidth / 2.0,
                                         position[2] - this.snowCubeWidth / 2.0);
    if (!p2height) {p2height = 0}
    var p3height = landscape.getHeight(position[0] - this.snowCubeWidth / 2.0,
                                         position[2] - this.snowCubeWidth / 2.0);
    if (!p3height) {p3height = 0}
    var p4height = landscape.getHeight(position[0] - this.snowCubeWidth / 2.0,
                                         position[2] + this.snowCubeWidth / 2.0);
    if (!p4height) {p4height = 0}

    // Load vertex data
    snowCubicle.vertices = [
        //                                  Y vertex
        -width, p3height+thickness, -width, //1
        -width, p4height+thickness,  width, //4       *of top left triangle
        width, p1height+thickness,  width,  //7
        width, p2height+thickness, -width,  //10      *of top left triangle

        //After snow all done added these two because of normals - -/+ and +/- of bot right triangle
        //This makes some vertex indexing unintuitive, fix if there is time
        -width, p4height+thickness,  width, //13      *of bot right triangle
        width, p2height+thickness, -width,  //16      *of bot right triangle
    ];
    snowCubicle.nVertices = 6;
    //Make dynamic
    snowCubicle.dynamicVertices = true;
    //Set up normals
    var vertexNormals = this.makeNormals(snowCubicle);
    //Make white, just white
    snowCubicle.colors = [[1.0, 1.0, 1.0, 1.0]];
    snowCubicle.textureCoords = new Array(snowCubicle.nVertices * 2).fill(0.0);
    //Set up indices
    snowCubicle.vertexIndices = [
        0, 1, 3,      4, 5, 2,    // Top face
    ];
    snowCubicle.nVertexIndices = 6;
    //Set position
    snowCubicle.setPosition(position);

    //Introduce the snowCubicle to GRAPHICS
    GRAPHICS.loadObjectVertices(snowCubicle);

    return snowCubicle;
};

Snow.prototype.makeNormals = function (snowCubicle) {
    const width = this.snowCubeWidth / 2.0;

    var normalTL = vec3.create();   //top-left
    var normalBR = vec3.create();   //bot-right
    vec3.cross(normalTL, vec3.fromValues(0.0,snowCubicle.vertices[4] - snowCubicle.vertices[1], width*2.0),
                         vec3.fromValues(width*2.0, snowCubicle.vertices[10] - snowCubicle.vertices[1], 0.0));
    vec3.cross(normalBR, vec3.fromValues(0.0, snowCubicle.vertices[16] - snowCubicle.vertices[7], width*2.0),
                         vec3.fromValues(width*2.0, snowCubicle.vertices[13] - snowCubicle.vertices[7], 0.0));
    vec3.normalize(normalTL, normalTL);
    vec3.normalize(normalBR, normalBR);
    var vertexNormals = [];
    vertexNormals.concat(normalTL);
    vertexNormals.concat(normalTL);
    vertexNormals.concat(normalBR);
    vertexNormals.concat(normalTL);
    vertexNormals.concat(normalBR);
    vertexNormals.concat(normalBR);
    return vertexNormals;
};