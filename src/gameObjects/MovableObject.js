////////////////////////////////////////////
// MovableObject.js_________________________
// Parent class for objects that have speed,
// can move according to certain rules
// (VisibleObjects can of course move too,
// but in a simpler way)
////////////////////////////////////////////

function MovableObject () {

	// speed - scalar velocity
	// angle - this velocity's direction in the XZ plane
	this.speed = 0.0;			// unit/sec
	this.angle = 0.0;			// deg
	this.angularSpeed = 0.0;	// deg/sec

	// Speed is used here instead of velocity so it's easier to work
	// with setting and limiting objects speed. Direction is taken
	// care of by angle, meaning this is basically a 2D speed.
	// To clarify: VisibleObject.yaw represents objects orientation
	// in world, MovableObject.angle represents velocity's direction
	// These two can differ (strafing!)
}
MovableObject.prototype = new VisibleObject();

MovableObject.prototype.setSpeed = function (newSpeed) {
	this.speed = newSpeed;
};

MovableObject.prototype.setAngle = function (newAngle) {
	this.angle = newAngle;
};

MovableObject.prototype.setAngularSpeed = function (newAngularSpeed) {
	this.angularSpeed = newAngularSpeed;
};

MovableObject.prototype.getSpeed = function () {
	return this.speed;
};

MovableObject.prototype.getAngle = function () {
	return this.angle;
};

MovableObject.prototype.getAngularSpeed = function () {
	return this.angularSpeed;
};

// Moving functions (multiple versions perhaps needed)
//////////////////////////////////////////////////////

MovableObject.prototype.turn = function (elapsedTime, direction) {
// Change objects move angle at angular speed
// direction is a number, <0 for turning one way, >0 the other
// !this does not rotate the object!

	if (direction >= 0) {
		this.angle += this.angularSpeed * elapsedTime / 1000;
	}
	else {
		this.angle += -this.angularSpeed * elapsedTime / 1000;
	}
};

MovableObject.prototype.makeMoveVector = function (elapsedTime, direction = 1) {
	// Return move vector (movement in given elapsedTime at speed and angle)
	// direction is forward / backwards

	if (direction < 0) {
		direction = -1;
	}
	else {
		direction = 1;
	}

	var moveVector = vec3.fromValues(
			Math.sin(degToRad(this.angle)) * this.speed * elapsedTime * direction / 1000,
			0,
			Math.cos(degToRad(this.angle)) * this.speed * elapsedTime * direction / 1000);

	return moveVector;
};

MovableObject.prototype.move = function (elapsedTime, direction = 1) {
	// Move object at speed and angle
	var moveVector = this.makeMoveVector(elapsedTime, direction);

	this.moveForVector(moveVector);
};

MovableObject.prototype.moveInDirection = function
					(elapsedTime, turnDir = 0, moveDir = 0) {
	// Turn objects move angle and yaw, than move in direction
	// Simplest move to use in Player and AI objects

	if (turnDir) {
		this.turn(elapsedTime, turnDir);

		this.setYaw(this.angle);
	}
	if (moveDir) {
		this.move(elapsedTime, moveDir);
	}
};