///////////////////////////////////
// Gamestate_Exiting.js____________
// gamestate preko katerega Game.js
// prepozna izhod iz igre
///////////////////////////////////

function GameState_Exiting () {
}
GameState_Exiting.prototype = new GameState(GameStateTtype.Exiting);

GameState_Exiting.prototype.call = function () {};

GameState_Exiting.prototype.update = function (elapsedTime) {};

GameState_Exiting.prototype.draw = function () {};