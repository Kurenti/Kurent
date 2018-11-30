/////////////////////////////////
// CollidableObject.js___________
// An objects that can detect and
// respond to collision
/////////////////////////////////

function CollidableObject () {

	this.objHeight = 0.0;
	this.objRadius = 0.0;

	//Y movement
	this.freeFallAcceleration = 0.0005;// unit/ms2, fixed
	this.ySpeed = 0.0; 				  // unit/ms

	// Array of vectors of directions in which we can not move
	// length will be equal to number of objects we are currently
	// colliding with - usually 1, sometimes 2
	this.noGoVectors = [];
}
CollidableObject.prototype = new MovableObject();

CollidableObject.prototype.findHeight = function () {
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

	//Set initial position to Ground level + 0.5*height
	const landscape = GAME_OBJECT_MANAGER.getLandscape();
	if (landscape) {
		const position = this.getPosition();
        this.setPosition([position[0], landscape.getHeight(position[0], position[2], true) + this.objHeight / 2.0, position[2]]);
    }
};

CollidableObject.prototype.findRadius = function () {
	// Finds radius of circle around object in the XZ plane.
	//!!Must be called in childs contructor!!

	// Because the game is mostly planar and this only serves
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
	// Checks for collision between two objects and adds anything
	// they might react to during update to both (such as a noGoVector)
	// This is where any kind of collision detection is implemented

	var position1 = vec3.fromValues(this.getPosition()[0],
									this.getPosition()[1],
									this.getPosition()[2]);
	var position2 = vec3.fromValues(secondObject.getPosition()[0],
									secondObject.getPosition()[1],
									secondObject.getPosition()[2]);

	// Simple sphere collision
	///////////////////////////////////////////////
	var diff = vec3.create();
	vec3.sub(diff, position2, position1);
	//Set DiffY to zero for "cylinder" collision
    //diff[1] = 0.0;

	// Check for sphere overlap
	if (vec3.len(diff) < this.objRadius + secondObject.objRadius) {
		//Only collision direction matters
		vec3.normalize(diff, diff);

		//Create second vector in oposite direction for the other object
		var diff2 = vec3.create();
		vec3.negate(diff2, diff);

		// Update NoGoVectors for both objects
		this.updateCollisionVector(diff);
		secondObject.updateCollisionVector(diff2);
	}
};

CollidableObject.prototype.updateCollisionVector = function (currentCollision) {
	// Adds current collisions noGoVector to object
	this.noGoVectors.push(currentCollision);
};

// Collision safe move
CollidableObject.prototype.move = function (elapsedTime, moveDir = 0) {
	//This function implements collision safe movement
	//It considers collision with other objects and landscape
	//
	//It overloads MovableObject.move and
	//is in its place used in MovableObject.moveInDirection

	var moveVector = this.makeMoveVector(elapsedTime, moveDir);

	//Object collision
	//////////////////

	// Cover all noGoVector and find which one fixes move direction most
	// If two fix it in opposing direction, we can not move
	var bestRestrictedMoveVector = moveVector;
	var fixDirection = 0;
	var bestAngle = 0.0;
	this.noGoVectors.forEach(function (noGoVector, i, noGoVectors) {
		//Check if move vector is forcing into the colliding object
		if (vec3.dot(moveVector, noGoVector) > 0) {

			// Restrict movement to orthogonal to direction towards other object
			var orthNoGoVector = vec3.fromValues(noGoVector[2],
												 noGoVector[1],
												-noGoVector[0]);
			var restrictedMoveVector = vec3.create();

			vec3.scale(restrictedMoveVector, orthNoGoVector,
				vec3.dot(moveVector, orthNoGoVector));

			// If we are colliding with multiple objects at the same time,
			// only the restrictedMoveVector that fixes moveVector the most
			// is used (or we're stuck if restrictedMoveVectors fix
			// moveVectors in different directions (one left, one right))
			// To check this, currently we check for vec3.angle, which is
			// a little expensive - only use when multiple noGoVectors

			if (noGoVectors.length > 1) {
				if (fixDirection === 0) {

					// First fix vector
					fixDirection = sideOfVector(moveVector, restrictedMoveVector);
					bestAngle = vec3.angle(moveVector, restrictedMoveVector);
					bestRestrictedMoveVector = restrictedMoveVector;

				} else {
					if (sideOfVector(moveVector, restrictedMoveVector) !== fixDirection) {
						// If fixDirection different than before, don't move
						vec3.set(bestRestrictedMoveVector, 0, 0, 0);

					} else {
						var currentAngle = vec3.angle(moveVector, restrictedMoveVector);
						if (currentAngle > bestAngle) {
							// If current vector fixes original direction more than
							// last best, save it as best fix
							bestAngle = currentAngle;
							bestRestrictedMoveVector = restrictedMoveVector;
						}
					}
				}
			} else {
				bestRestrictedMoveVector = restrictedMoveVector;
			}
		}
	});


	//Landscape Collision & free fall
	/////////////////////////////////
	//To simulate landscape collision calculate vector from position to moved position
	//in XZ + height difference. Then move for that vector scaled to length of original
	//move vector in XZ. If move vector points down, only move for max
	//elapsedTime*freeFallAcceleration.
	var movedPosition = vec3.create();
	var finalMoveVector = vec3.create();

	vec3.add(movedPosition, this.getPosition(), bestRestrictedMoveVector);


	//Moved height can return false if something fails
	var movedHeight = GAME_OBJECT_MANAGER.getLandscape().getHeight(
									movedPosition[0], movedPosition[2]) + this.objHeight / 2.0;
	if (movedHeight) {
		//restrict to free fall acceleration (maxFall should be negative,
		//freeFallAcceleration is positive and ySpeed is + up!)
		const maxFall = -this.freeFallAcceleration * elapsedTime * elapsedTime / 2.0 + this.ySpeed * elapsedTime;
        if (movedHeight - this.getPosition()[1] < maxFall) {
			movedPosition[1] = this.getPosition()[1] + maxFall;
		} else {
            movedPosition[1] = movedHeight;
        }

        //Only save negative ySpeeds
		if (movedPosition[1] < this.getPosition()[1]) {
            this.ySpeed = (movedPosition[1] - this.getPosition()[1])/elapsedTime;
		} else {
			this.ySpeed = 0.0;
		}
	}

	vec3.sub(finalMoveVector, movedPosition, this.getPosition());
	//scale the final move vector to original 2D move vector - unless you're standing still!
	//in case of standing still with snow melting under feet, move directly on top of snow
	const originalLength = vec3.len(bestRestrictedMoveVector);
	if (originalLength > 0) {
        vec3.normalize(finalMoveVector, finalMoveVector);
        vec3.scale(finalMoveVector, finalMoveVector, vec3.len(bestRestrictedMoveVector));
    }

	// Finally move object for vector. This is just original moveVector
	// in case of no collision or appropriatelly fixed moveVector in
	// case of collision
	this.moveForVector(finalMoveVector);
};

CollidableObject.prototype.resetCollision = function () {
	//Resets collision settings at the end of each frame
	//for a colidable object
	this.noGoVectors = [];
};