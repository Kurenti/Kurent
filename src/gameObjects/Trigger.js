///////////////////////////////////////////
// Trigger.js______________________________
// An invisible object that detects
// collision and has custom reactions to it
///////////////////////////////////////////
// This object is a bit messy, as it should only have Collision as
// component, not true parent (as implemented) inheriting all the
// unused moving and drawing stuff with it...

function Trigger (position, radius, triggerFunction) {
    //Set base atributes (overriding how it's done in usual CollidableObjects...
    this.setPosition(position);
    this.objRadius = radius;
    this.isTrigger = true;

    //Perhaps doing OOB was a bad idea, this is obviously a functional language.
    this.triggerFunction = triggerFunction;
}
Trigger.prototype = new CollidableObject();

Trigger.prototype.updateCollisionVector = function (secObject) {
    //Calls custom trigger function
    this.triggerFunction(secObject);
};

// Triggers should maybe have a separate array in GameObjectManager
// so as not to be drawn at all. In any case, this:
Trigger.prototype.draw = function () {};