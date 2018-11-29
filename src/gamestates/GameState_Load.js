////////////////////////////////
// Gamestate_Load.js____________
// vmesni gamestate v katerem se
// loadajo asseti
////////////////////////////////

function GameState_Load () {
    // Define menu display (controlled by call and dismiss)
    this.loadDisplay = document.getElementById("loadOverlay");
    this.loadDisplay.style.width = String(GRAPHICS.canvas.width);
    this.loadDisplay.style.height = String(GRAPHICS.canvas.height);
}
GameState_Load.prototype = new GameState(GameStateType.Load);

GameState_Load.prototype.call = function () {
    this.loadDisplay.style.display = "block";

    // LOAD MAP
    ///////////
    GAME_OBJECT_MANAGER.add(new Landscape(), ObjectTypes.Landscape);
    GAME_OBJECT_MANAGER.add(new DevCube([0, 1, -4]), ObjectTypes.Collidable);
    GAME_OBJECT_MANAGER.add(new DevCube([0, 1, -6]), ObjectTypes.Collidable);
    GAME_OBJECT_MANAGER.add(new PlayerObject(CONTROLS), ObjectTypes.Collidable);
};

GameState_Load.prototype.dismiss = function () {
    this.loadDisplay.style.display = "none";
};

GameState_Load.prototype.update = function (elapsedTime) {
    if (GAME_OBJECT_MANAGER.loaded) {
        GAME.toPlaying();
    }
};

GameState_Load.prototype.draw = function () {};
