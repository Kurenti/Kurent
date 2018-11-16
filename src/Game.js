////////////////////////////////////////
// Game.js______________________________
// Osnovni class, ki poganja celo igrico
////////////////////////////////////////

function Game() {

	// Gamestate-i:
	this.gameStates = {
		Menu: new GameState_Menu,
		Playing: new GameState_Playing,
		Exiting: new GameState_Exiting
	};
	this.currentGameState = this.gameStates.Menu;
	this.currentGameState.call();
	this.newGameState = this.currentGameState;

	// Game clock
	this.lastTime = 0.0;
}

Game.prototype.start = function() {

	this.resetTime();

	while (!this.isExiting()) {

		// clear canvas

		this.gameLoop();

		// draw canvas

		this.setGameState();

	}
}

Game.prototype.gameLoop = function () {

	// poll events (controlls)

	var elapsedTime = this.resetTime();

	this.currentGameState.update(elapsedTime);
	this.currentGameState.draw();
}

Game.prototype.resetTime = function () {
	var oldTime = this.lastTime;
	this.lastTime = performance.now();

	return this.lastTime - oldTime;
}

// Funkcije za prehajanje med fazami igrce - prehod je izveden sele
// ob koncu gameloopa
Game.prototype.toMenu = function () {
	this.newGameState = this.gameStates.Menu;
}
Game.prototype.toPlaying = function () {
	this.newGameState = this.gameStates.Playing;
}
Game.prototype.toExiting = function () {
	this.newGameState = this.gameStates.Exiting;
}

Game.prototype.setGameState = function () {
	if (this.newGameState != this.currentGameState) {
			
		this.currentGameState = this.newGameState;

		this.currentGameState.call();
	}
}

Game.prototype.isExiting = function () {
	if (this.currentGameState.getGameStateType() == getGameStateType.Exiting) {
		return true;
	}
	//
	return true;
}