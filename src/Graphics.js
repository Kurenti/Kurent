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
    //this.initBuffers();

    if (this.gl) {
	    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);                     // Set clear color to black, fully opaque
	    this.gl.clearDepth(1.0);                                    // Clear everything
	    this.gl.enable(this.gl.DEPTH_TEST);                         // Enable depth testing
	    this.gl.depthFunc(this.gl.LEQUAL);                          // Near things obscure far things
	
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
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
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

    this.gl.useProgram(this.shaderProgram);

    this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

    this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
};

// Utility functions used in drawing objects
////////////////////////////////////////////

Graphics.prototype.mvPushMatrix = function () {
    var copy = mat4.create();
    mat4.copy(copy, this.mvMatrix);
    this.mvMatrixStack.push(copy);
};

Graphics.prototype.mvPopMatrix = function () {
    if (this.mvMatrixStack.length == 0) {
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

// Function that initializes a visble objects GL graphics data
Graphics.prototype.loadObjectVertices = function (object) {

	// Vertices
	object.vertexPositionBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.vertexPositionBuffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.vertices), this.gl.STATIC_DRAW);
    object.vertexPositionBuffer.itemSize = 3;
    object.vertexPositionBuffer.numItems = object.nVertices;

    // Colours
    object.vertexColorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.vertexColorBuffer);

    var unpackedColors = [];
    for (var i in object.colors) {
        var color = object.colors[i];
        for (var j=0; j < 4; j++) {
            unpackedColors = unpackedColors.concat(color);
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
}

// Function that lets a visible object draw itself
Graphics.prototype.drawObject = function (vertexPositionBuffer,
										  vertexColorBuffer,
										  vertexIndexBuffer,
										  position,
										  yaw) {

	// Init to origin
    mat4.identity(this.mvMatrix);

    // Move to camera coords
    mat4.rotate(this.mvMatrix, this.mvMatrix,
        degToRad(this.viewport.pitch), [1, 0, 0]);
    mat4.rotate(this.mvMatrix, this.mvMatrix,
        degToRad(this.viewport.yaw), [0, 1, 0]);
    mat4.translate(this.mvMatrix, this.mvMatrix, this.viewport.position);

	// Move
	mat4.translate(this.mvMatrix, this.mvMatrix, position);

    this.mvPushMatrix();

    // Rotate
    mat4.rotate(this.mvMatrix, this.mvMatrix, degToRad(yaw), [0.0, 1.0, 0.0]);

    // Scale?
    //implement if needed//

    // Vertex positions
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexPositionBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    // vertex colors - this needs to be upgraded to textures
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexColorBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, vertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    // Faces
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
    this.setMatrixUniforms();
    this.gl.drawElements(this.gl.TRIANGLES, vertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);

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