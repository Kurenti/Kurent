/////////////////////////////////////////
// GameObjectManager.js__________________
// Object that keeps track of and handles
// all in-game objects
/////////////////////////////////////////

//This will probably be changed to a few tags used when callling .add
//Some objects are invisible (don't need to be drawn), so drawable is missing
//here..however tey can very much be collidable.
var ObjectTypes = {
	Default: 1,
	Collidable: 2,
	Snow: 3,
	Landscape: 4
}

function GameObjectManager () {

	this.gameObjects = [];

	// Da bi bila stvar res clean, bi bil this.gameObjects dict (oziroma
	// locen dict this.namedGameObjects za named objekte),
	// po katerem bi se lahko iskalo objekte. Ker bo taksnih objektov,
	// ki bi se jih rabilo dobit od zunaj, tu res malo, so lahko pac
	// posebne spremenljivke...
	// this.kurent itd.
	// Ce se jih nabere, se pac naredi en dict z resnimi named objekti

	this.collidableObjects = [];
    this.landscape = false;
}

GameObjectManager.prototype.add = function (object, type = ObjectTypes.Default) {
	this.gameObjects.push(object);

	switch(type) {
		case ObjectTypes.Collidable:
			this.collidableObjects.push(object);
			break;

		case ObjectTypes.Landscape:
			this.landscape = object;
			break;
	}
};

GameObjectManager.prototype.getLandscape = function () {
	return this.landscape;
};

GameObjectManager.prototype.drawAll = function () {
	this.gameObjects.forEach(function(gameObject) {
		gameObject.draw();
	});
};

GameObjectManager.prototype.updateAll = function (elapsedTime) {
	//First collide all collidable objects
	for (var i = 0; i < this.collidableObjects.length; i++) {
		for (var j = i + 1; j < this.collidableObjects.length; j++) {
			this.collidableObjects[i].collide(this.collidableObjects[j]);
		}
	}

	// Then update all objects (collidables now have
	// collision restrictions saved)
	this.gameObjects.forEach(function(gameObject) {
		gameObject.update(elapsedTime);
	});

	// Reset collision for collidables...can we put
	// this in objects themselves somehow? At the end of Update?
	// This is unelegant.
	this.collidableObjects.forEach(function(collidableObject) {
		collidableObject.resetCollision();
	});
};