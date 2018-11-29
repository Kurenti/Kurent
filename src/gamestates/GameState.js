/////////////////////////////////////////
// Gamestate.js__________________________
// Parent class za gamestate: vmesnike
// preko katerih Game.js poganja razlicne
// faze igre
/////////////////////////////////////////

// enum z imeni GameStatov, da niso stringi...
var GameStateType = {
	Menu: 1,
	Load: 2,
	Playing: 3,
	Exiting: 4
};

function GameState(type) {
	this.myGameStateType = type;
}

GameState.prototype.getGameStateType = function () {
	return this.myGameStateType;
};