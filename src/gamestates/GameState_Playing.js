///////////////////////////////////////////
// Gamestate_Playing.js____________________
// gamestate preko katerega Game.js poganja
// igro med samim resnim igranjem
///////////////////////////////////////////
HINTS = {
	texts: [
        "You are a Kurent.",
        "Your mission in life is to banish snow from the land.",
        "To do that, firstly you need to move around.",
        "You do that by pressing W, A, S and D keys.",
        "Ok, now you know how to move. Congrats!",
        "But the snow still isn't going anywhere.",
        "Hm....",
        "To get rid of snow you have 4 different moves.",
        "Those moves are triggered by pressing numbers from 1 to 4.",
        "Good luck!"
	],
	intervals: [
		2000,
		5000,
		8000,
		11000,
		14000,
		17000,
		20000,
		23000,
		26000,
		29000
	]
};

function GameState_Playing () {
	this.hintDisplay = document.getElementById("hints");
	this.totalTime = 0;
}

GameState_Playing.prototype = new GameState(GameStateType.Playing);

GameState_Playing.prototype.call = function () {
};

GameState_Playing.prototype.dismiss = function () {
    this.hintDisplay.style.display = "none";
    this.totalTime = 0;
};

GameState_Playing.prototype.update = function (elapsedTime) {
	this.hintDisplay.style.display = "block";
	this.totalTime += elapsedTime;
	this.handleHints();

	CONTROLS.handleKeys();
	if (CONTROLS.pause) {
        GAME.toPause();
    }
	GAME_OBJECT_MANAGER.updateAll(elapsedTime);
};

GameState_Playing.prototype.draw = function () {

	GRAPHICS.setUpDraw();
	GAME_OBJECT_MANAGER.drawAll();
};

GameState_Playing.prototype.handleHints = function() {
	var displayed = false;
	for(var i = 0; i < HINTS.intervals.length; i++) {
        if(this.totalTime < HINTS.intervals[i]) {
            this.hintDisplay.style.left = (GRAPHICS.canvas.width / 2 - HINTS.texts[i].length / 2 * 10).toString() + "px";
            this.hintDisplay.innerText = HINTS.texts[i];
            displayed = true;
            break;
        }
	}
	if(!displayed) {
		this.hintDisplay.innerText = "";
	}
};