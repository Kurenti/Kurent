////////////////////////////////////////
// Game.js______________________________
// Osnovni class, ki poganja celotno igro.
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
	this.controls = new Keyboard();

	// Game clock
	this.lastTime = 0.0;
}

Game.prototype.start = function() {

    // Set event based functions that detect key presses and releases
    document.onkeydown = this.controls.handleKeyDown.bind(this.controls);
    document.onkeyup = this.controls.handleKeyUp.bind(this.controls);

	this.resetTime();

	// Set time interval of executing of the function (set fps)
	setInterval(function() {
        this.gameLoop();
        this.setGameState();
    }.bind(this), 15);
};

Game.prototype.gameLoop = function () {

    // Preberi pritisnjene gumbe in popravi ustrezne vrednosti
	this.controls.handleKeys();

	var elapsedTime = this.resetTime();

	this.currentGameState.update(elapsedTime);
	this.currentGameState.draw();
};

Game.prototype.resetTime = function () {
	var oldTime = this.lastTime;
	this.lastTime = performance.now();

	return this.lastTime - oldTime;
};

// Funkcije za prehajanje med fazami igre - prehod je izveden sele
// ob koncu gameloopa
Game.prototype.toMenu = function () {
	this.newGameState = this.gameStates.Menu;
};

Game.prototype.toPlaying = function () {
	this.newGameState = this.gameStates.Playing;
};

Game.prototype.toExiting = function () {
	this.newGameState = this.gameStates.Exiting;
};

Game.prototype.setGameState = function () {
	if (this.newGameState !== this.currentGameState) {
			
		this.currentGameState = this.newGameState;

		this.currentGameState.call();
	}
};

Game.prototype.isExiting = function () {
	if (this.currentGameState.getGameStateType() === getGameStateType.Exiting) {
		return true;
	}
	return true;
};
