/////////////////////////////////////////
// GameObjectManager.js__________________
// Object that keeps track of and handles
// all in-game objects
/////////////////////////////////////////

function GameObjectManager () {

	this.gameObjects = [];

	// Da bi bila stvar res clean, bi bil this.gameObjects dict (oziroma
	// locen dict this.namedGameObjects za named objekte),
	// po katerem bi se lahko iskalo objekte. Ker bo taksnih objektov,
	// ki bi se jih rabilo dobit od zunaj, tu res malo, so lahko pac
	// posebne spremenljivke...
	// this.kurent itd.
	// Ce se jih nabere, se pac naredi en dict z resnimi named objekti

}

GameObjectManager.prototype.add = function (object) {
	this.gameObjects.push(object);
};

GameObjectManager.prototype.drawAll = function () {
	this.gameObjects.forEach(function(gameObject) {
		gameObject.draw();
	});
};

GameObjectManager.prototype.updateAll = function (elapsedTime) {
	this.gameObjects.forEach(function(gameObject) {
		gameObject.update(elapsedTime);
	});
};