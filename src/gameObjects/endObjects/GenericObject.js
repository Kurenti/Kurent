////////////////////////////////////////////
// GenericObject.js_________________________
// Generic static visible object constructed
// with input parameters
////////////////////////////////////////////

function GenericObject (modelPath, position, yaw, scale = 1.0) {

    //Scale to original model - this is used on load, not when drawing
    this.scale = scale;
    this.setPosition(position);	//Y position is set appropriately only after objHeight is calculated
    this.setYaw(yaw);

    this.loadModel(modelPath);
}
GenericObject.prototype = new CollidableObject();

GenericObject.prototype.handleLoadedModel = function (data) {

    this.vertices = data.vertices.map( function (x) {
        return x*this.scale;
    }.bind(this));
    this.nVertices = this.vertices.length / 3;

    //For now, assign generic brown
    this.colors = [[0.640625, 0.46875, 0.16796875, 1.0]];
    //This is a last resort measure: to avoid double shaders for textured/untextured
    //every object needs a valid array object.textureCoords of length nVertices * 2
    this.textureCoords = new Array(this.nVertices * 2).fill(0.0);

    //Get normals
    this.vertexNormals = data.vertexNormals;

    //Get triangles
    this.vertexIndices = data.faces;
    this.nVertexIndices = this.vertexIndices.length;

    this.findHeight();
    //this.objHeight = this.heightScale*this.objHeight; //fix height if needed
    this.findRadius();
    GRAPHICS.loadObjectVertices(this);
};