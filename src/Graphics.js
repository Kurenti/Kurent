///////////////////////////////////////
// Graphics.js_________________________
// V tem filu se nahaja vse potrebno za
// prikazovanje grafike na canvasu
// class Graphics : displaying graphics
// class Viewport : camera data
///////////////////////////////////////

function Graphics() {

    this.initSuccess = false;
    this.canvas = null;
    this.gl = null;
    this.shaderProgram;

    this.mvMatrix = mat4.create();
    this.mvMatrixStack = [];
    this.pMatrix = mat4.create();

    this.viewport = new Viewport();

	this.canvas = document.getElementById("canvas");
    this.initWebGl();
    this.initShaders();

    if (this.gl) {
	    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);    // Set clear color to black, fully opaque
	    this.gl.clearDepth(1.0);                                    // Clear everything
	    this.gl.enable(this.gl.DEPTH_TEST);                                // Enable depth testing
	    this.gl.depthFunc(this.gl.LEQUAL);                                 // Near things obscure far things
	
	    this.initSuccess = true;
	}
}

// Functions that set up the WebGL environment
//////////////////////////////////////////////

// Funkcija, ki iz canvasa inicializira webgl
Graphics.prototype.initWebGl = function () {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        this.gl.viewportWidth = this.canvas.width;
        this.gl.viewportHeight = this.canvas.height;
    } catch (e) {
        console.log(e);
    }

    // If we don't have a GL context, give up now
    if (!this.gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
};

Graphics.prototype.getShader = function (gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType === 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type === "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type === "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
};

Graphics.prototype.initShaders = function () {
    var fragmentShader = this.getShader(this.gl, "shader-fs");
    var vertexShader = this.getShader(this.gl, "shader-vs");

    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    this.gl.linkProgram(this.shaderProgram);

    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
    this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

    this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

    this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
    this.shaderProgram.useTexturesUniform = this.gl.getUniformLocation(this.shaderProgram, "uUseTextures");

    this.gl.useProgram(this.shaderProgram);
};

// Utility functions used in drawing objects
////////////////////////////////////////////

Graphics.prototype.mvPushMatrix = function () {
    var copy = mat4.create();
    mat4.copy(copy, this.mvMatrix);
    this.mvMatrixStack.push(copy);
};

Graphics.prototype.mvPopMatrix = function () {
    if (this.mvMatrixStack.length === 0) {
        throw "Invalid popMatrix!";
    }
    this.mvMatrix = this.mvMatrixStack.pop();
};

Graphics.prototype.setMatrixUniforms = function () {
    this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
    this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
};

Graphics.prototype.setUpDraw = function () {
// Function that at the start of each frame sets ups the canvas
// and prepares this class to draw game objects 

	// clear canvas
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Move to camera class when implemented?
    mat4.perspective (this.pMatrix, 45.0, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0);
};

// Functions used by visible game objects
/////////////////////////////////////////

// Function that initializes a visible objects GL graphics data
Graphics.prototype.loadObjectVertices = function (object) {

	// Vertices
	object.vertexPositionBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.vertexPositionBuffer);
	if (object.dynamicVertices) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.vertices), this.gl.DYNAMIC_DRAW);
    } else {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.vertices), this.gl.STATIC_DRAW);
    }
    object.vertexPositionBuffer.itemSize = 3;
    object.vertexPositionBuffer.numItems = object.nVertices;

    // Textures
    object.vertexTextureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.vertexTextureCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.textureCoords), this.gl.STATIC_DRAW);
    object.vertexTextureCoordBuffer.itemSize = 2;
    object.vertexTextureCoordBuffer.numItems = object.nVertices;

    // Colours
    object.vertexColorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.vertexColorBuffer);

    if (object.nVertices % object.colors.length !== 0) {
        console.log("Can't load vertex colors: colors array wrong size");
    }

    //Serious models have the colors list already of appropriate length
    var unpackedColors = [];
    if (object.nVertices === object.colors.length) {
        unpackedColors = object.colors;
    } else {
    //For other objects use the exercise way of unpacking colors
    //(usually colors will just be an array of one color)
        for (var i in object.colors) {
            var color = object.colors[i];
            for (var j = 0; j < object.nVertices / object.colors.length; j++) {
                unpackedColors = unpackedColors.concat(color);
            }
        }
    }
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(unpackedColors), this.gl.STATIC_DRAW);
    object.vertexColorBuffer.itemSize = 4;
    object.vertexColorBuffer.numItems = object.nVertices;

    // Vertex indices
    object.vertexIndexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, object.vertexIndexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.vertexIndices), this.gl.STATIC_DRAW);
    object.vertexIndexBuffer.itemSize = 1;
    object.vertexIndexBuffer.numItems = object.nVertexIndices;

    //When normals implemented: allow DYNAMIC_DRAW like with vertices!
};

// Function that loads an image to objects texture
Graphics.prototype.loadTexture = function (object, path) {

    object.texture = this.gl.createTexture();
    object.texture.image = new Image();
    object.texture.image.onload = function () {
        this.handleLoadedTexture(object.texture);
    }.bind(this);
    object.texture.image.src = path;

    object.hasTextures = true;
};

// Function that handles GL side of texture handling after the image is loaded
Graphics.prototype.handleLoadedTexture = function (texture) {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);

    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};

// Function that rebinds new vertex positions in case  of dynamic vertices
Graphics.prototype.moveVertices = function (vertexBuffer, vertices) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
};

// Function that lets a visible object draw itself
Graphics.prototype.drawObject = function (object) {

    this.gl.uniform1i(this.shaderProgram.useTexturesUniform, object.hasTextures);

	// Init to origin
    mat4.identity(this.mvMatrix);

    // Move to camera coords
    mat4.rotate(this.mvMatrix, this.mvMatrix,
        degToRad(this.viewport.pitch), [1, 0, 0]);
    mat4.rotate(this.mvMatrix, this.mvMatrix,
        degToRad(this.viewport.yaw), [0, 1, 0]);
    mat4.translate(this.mvMatrix, this.mvMatrix, this.viewport.position);

	// Move
	mat4.translate(this.mvMatrix, this.mvMatrix, object.getPosition());

    this.mvPushMatrix();

    // Rotate
    mat4.rotate(this.mvMatrix, this.mvMatrix, degToRad(object.getYaw()), [0.0, 1.0, 0.0]);

    // Scale?
    //implement if needed//

    // Vertex positions
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.vertexPositionBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, object.vertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    // Vertex textures
    //Attribute needs to be set, as it has been set up, even if there is no texture
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.vertexTextureCoordBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, object.vertexTextureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    //Only bind texture if needed though
    if (object.hasTextures) {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, object.texture);
        this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);
    }

    // Vertex colors
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.vertexColorBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, object.vertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    // Faces
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, object.vertexIndexBuffer);
    this.setMatrixUniforms();
    this.gl.drawElements(this.gl.TRIANGLES, object.vertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);

    // Normals
    //TODO//

    this.mvPopMatrix();
}



///////////////////////
// Viewport
///////////////////////

function Viewport () {
    this.position = [0.0, 0.0, 0.0];
    this.pitch = 0.0;
    this.yaw = 0.0;
}

Viewport.prototype.setPosition = function (newPosition) {
    this.position = newPosition;
};

Viewport.prototype.setPitch = function (newPitch) {
    this.pitch = newPitch;
};

Viewport.prototype.setYaw = function (newYaw) {
    this.yaw = newYaw;
};