/////////////////////////////////
// CollidableObject.js___________
// An objects that can detect and
// respond to collision
/////////////////////////////////

function CollidableObject () {

	this.objWidth = 0.0;
	this.objRadius = 0.0;

	// Array of vectors of directions in which we can not move
	// length will be equal to number of objects we are currently
	// colliding with
	this.noGoVector = vec3.create();
}
CollidableObject.prototype = new MovableObject();

VisibleObject.prototype.findHeight = function () {
	//Function that calculates Objects height
	//!!Must be called in childs contructor!!

	var maxY = -Infinity;
	var minY = Infinity;

	for (var i = 1; i < this.vertices.length; i+=3) {
		if (this.vertices[i] < minY) {
			minY = this.vertices[i];
		} else if (this.vertices[i] > maxY) {
			maxY = this.vertices[i];
		}
	}

	this.objHeight = maxY - minY;
};

VisibleObject.prototype.findRadius = function () {
	// Finds radius of circle around object in the XZ plane.
	//!!Must be called in childs contructor!!

	// Because the game is nostly planar and this only serves
	// as optimization for AABB collision, it's fine.
	// If need be, just uncomment the 2nd line in vertR2.
	// This relies on object being centered at 0,0,0

	// Look for max r^2, only square root once at the end
	var minR2 = 0.0;

	for (var i = 0; i < this.vertices.length - 2; i+=3) {
		var vertR2 = this.vertices[i]*this.vertices[i] +
				//Y  this.vertices[i+1]*this.vertices[i+1] +
					 this.vertices[i+2]*this.vertices[i+2];
		
		if (vertR2 > minR2) {
			minR2 = vertR2;
		}
	}

	this.objRadius = Math.sqrt(minR2);
};

CollidableObject.prototype.collide = function (secondObject) {

	var position1 = vec3.fromValues(this.getPosition()[0],
									this.getPosition()[1],
									this.getPosition()[2]);
	var position2 = vec3.fromValues(secondObject.getPosition()[0],
									secondObject.getPosition()[1],
									secondObject.getPosition()[2]);

	// Simple sphere (2d circle actually) collision
	var diff = vec3.create();
	vec3.sub(diff, position1, position2);

	// Check for sphere overlap
	if (vec3.len(diff) < this.objRadius + secondObject.objRadius) {
		// Update NoGoVectors for both objects
		vec3.normalize(diff, diff);
		secondObject.updateCollisionVector(diff);
		this.updateCollisionVector(vec3.scale(diff, diff, -1));
	}
};

CollidableObject.prototype.updateCollisionVector = function (currentCollision) {
	vec3.add(this.noGoVector, this.noGoVector, currentCollision);
}

CollidableObject.prototype.collisionSafeMoveInDirection = function
		(elapsedTime, turnDir = 0, moveDir = 0) {

	if (turnDir) {
		this.turn(elapsedTime, turnDir);

		this.setYaw(this.angle);
	}
	if (moveDir) {
		if (moveDir < 0) {
			moveDir = -1;
		}
		else {
			moveDir = 1;
		}

		var moveDirection = vec3.fromValues(
			Math.sin(degToRad(this.angle)) * this.speed * elapsedTime * moveDir / 1000,
			0,
			Math.cos(degToRad(this.angle)) * this.speed * elapsedTime * moveDir / 1000);

		if (this.noGoVector !== vec3.create() && 
			vec3.dot(moveDirection, this.noGoVector) > 0) {
			// Restrict movement to orthogonal to direction towards other object
			var orthNoGoVector = vec3.fromValues(this.noGoVector[2],
												 this.noGoVector[1],
												 -this.noGoVector[0]);

			vec3.scale(moveDirection, orthNoGoVector,
				vec3.dot(moveDirection, orthNoGoVector));
		}

		this.moveForVector(moveDirection);
		// / 1000 for ms -> s
	}
}

CollidableObject.prototype.resetCollision = function () {
	this.noGoVector = vec3.create();
};