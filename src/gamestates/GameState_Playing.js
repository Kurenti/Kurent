///////////////////////////////////////////
// Gamestate_Playing.js____________________
// gamestate preko katerega Game.js poganja
// igro med samim resnim igranjem
///////////////////////////////////////////

function GameState_Playing () {
}

GameState_Playing.prototype = new GameState(GameStateType.Playing);

GameState_Playing.prototype.call = function () {
};

GameState_Playing.prototype.dismiss = function () {
    GAME_OBJECT_MANAGER.empty();
    GRAPHICS.setUpDraw();
};

GameState_Playing.prototype.update = function (elapsedTime) {
	CONTROLS.handleKeys();
	if (CONTROLS.pause) {
        GAME.toMenu();
    }

	GAME_OBJECT_MANAGER.updateAll(elapsedTime);
};

GameState_Playing.prototype.draw = function () {

	GRAPHICS.setUpDraw();
	GAME_OBJECT_MANAGER.drawAll();
};
