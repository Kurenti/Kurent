/////////////////////////////////////////
// Gamestate.js__________________________
// Parent class za gamestate: vmesnike
// preko katerih Game.js poganja razlicne
// faze igre
/////////////////////////////////////////

// enum z imeni GameStatov, da niso stringi...
var GameStateTtype = {
	Menu: 1,
	Playing: 2,
	Exiting: 3
};

function GameState(type) {
	this.myGameStateType = type;
}

GameState.prototype.getGameStateType = function () {
	return this.myGameStateType;
};