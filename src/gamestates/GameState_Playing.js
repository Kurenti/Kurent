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
    // JT: po mojem naj bojo controle svoj global class CONTROLS,
    // ki naj bo inicializiran na začetku GAMEa.
    // Kontrole se bo rabilo marsikje, po mojem nima smisla, da 
    // ma meni svoje kontrole in sama igra svoje, sploh, če bomo
    // implementirali gamepad (torej, bo controls bolj kompliciran
    // objekt kot samo branje tipkvonice). Kontrole so enotne po
    // vsej igri, naj bojo nek static class?


    // LOAD MAP
    ///////////
    // provizoricen load igre - obstajati bi moral locen GameState za
    // polnjenje levla, a morda je cisto okej, ce se zaenkrat to nardi tukej
    GAME_OBJECT_MANAGER.add(new DevCube());
    GAME_OBJECT_MANAGER.add(new DevCube());
    GAME_OBJECT_MANAGER.add(new PlayerObject(this.controls));
    	// Sem zaenkrat kar pustil this.contols tu, ampak ja,
    	// GameStati naj bi bili bolj interfaci, ki naj
    	// jih uporablja GAME, ne tolko resni objekti s svojimi atributi
    	// My bad, ker nisem tega nč razložu v kodi, pardon.
    	// Je pa res, da če se noče met controls kot globala,
    	// je tole tu precej sleek and clean dependency injection
    	// implementacija...naj magari vse ostane tko kot je!
};

GameState_Playing.prototype.update = function (elapsedTime) {
	this.controls.handleKeys();
	GAME_OBJECT_MANAGER.updateAll(elapsedTime);
};

GameState_Playing.prototype.draw = function () {

	GRAPHICS.setUpDraw();
	GAME_OBJECT_MANAGER.drawAll();
};

GameState_Playing.prototype.destroy = function() {
    // Remove keyboard listener
    this.controls.removeListener();
};