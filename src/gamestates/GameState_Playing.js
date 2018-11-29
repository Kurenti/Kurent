///////////////////////////////////////////
// Gamestate_Playing.js____________________
// gamestate preko katerega Game.js poganja
// igro med samim resnim igranjem
///////////////////////////////////////////

function GameState_Playing () {
}

GameState_Playing.prototype = new GameState(GameStateTtype.Playing);

GameState_Playing.prototype.call = function () {

    // Add keyboard listener
    this.controls = new Keyboard();
    this.controls.addListener();

    // LOAD MAP
    ///////////
    // provizoricen load igre - obstajati bi moral locen GameState za
    // polnjenje levla, a morda je cisto okej, ce se zaenkrat to nardi tukej
    GAME_OBJECT_MANAGER.add(new Landscape(), ObjectTypes.Landscape);
    GAME_OBJECT_MANAGER.add(new DevCube([0, 1, -4]), ObjectTypes.Collidable);
    GAME_OBJECT_MANAGER.add(new DevCube([0, 1, -6]), ObjectTypes.Collidable);
    GAME_OBJECT_MANAGER.add(new PlayerObject(this.controls), ObjectTypes.Collidable);
};

GameState_Playing.prototype.update = function (elapsedTime) {

	this.controls.handleKeys();
	GAME_OBJECT_MANAGER.updateAll(elapsedTime);
};

GameState_Playing.prototype.draw = function () {

	GRAPHICS.setUpDraw();
	GAME_OBJECT_MANAGER.drawAll();
};
