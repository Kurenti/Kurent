///////////////////////////////////////////
// Gamestate_Playing.js____________________
// gamestate preko katerega Game.js poganja
// igro med samim resnim igranjem
///////////////////////////////////////////

function GameState_Playing () {
}

GameState_Playing.prototype = new GameState(GameStateTtype.Playing);

GameState_Playing.prototype.call = function () {

};

GameState_Playing.prototype.update = function (elapsedTime) {
	// Klic updata managerja vseh game-objektov
};

GameState_Playing.prototype.draw = function () {

};