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

    //Loading flags
    this.objectsLoading = false;
}
GameState_Load.prototype = new GameState(GameStateType.Load);

GameState_Load.prototype.call = function () {
    this.loadDisplay.style.display = "block";

    // LOAD MAP
    ///////////
    GAME_OBJECT_MANAGER.add(new Landscape(), ObjectTypes.Landscape);
};

GameState_Load.prototype.dismiss = function () {
    this.loadDisplay.style.display = "none";
};

GameState_Load.prototype.update = function (elapsedTime) {

    //After landscape loaded:
    if (GAME_OBJECT_MANAGER.landscapeLoaded && !this.objectsLoading) {
        GAME_OBJECT_MANAGER.add(new DevCube([5, 1, 5]), ObjectTypes.Collidable);
        GAME_OBJECT_MANAGER.add(new DevCube([3, 1, 3]), ObjectTypes.Collidable);
        GAME_OBJECT_MANAGER.add(new GenericObject("assets/models/tree.json", [
            (30/64.0)*GAME_OBJECT_MANAGER.getLandscape().landscapeWidth,
            0,
            (30/64.0)*GAME_OBJECT_MANAGER.getLandscape().landscapeDepth], 0, 2), ObjectTypes.Collidable);
        GAME_OBJECT_MANAGER.add(new GenericObject("assets/models/tree.json", [
            (31/64.0)*GAME_OBJECT_MANAGER.getLandscape().landscapeWidth,
            0,
            (31/64.0)*GAME_OBJECT_MANAGER.getLandscape().landscapeDepth], 0, 3), ObjectTypes.Collidable);
        GAME_OBJECT_MANAGER.add(new GenericObject("assets/models/tree.json", [
            (34/64.0)*GAME_OBJECT_MANAGER.getLandscape().landscapeWidth,
            0,
            (40/64.0)*GAME_OBJECT_MANAGER.getLandscape().landscapeDepth], 0, 3), ObjectTypes.Collidable);
        GAME_OBJECT_MANAGER.add(new GenericObject("assets/models/stump.json", [
            (32/64.0)*GAME_OBJECT_MANAGER.getLandscape().landscapeWidth,
            0,
            (43/64.0)*GAME_OBJECT_MANAGER.getLandscape().landscapeDepth], 0, 3), ObjectTypes.Collidable);
        GAME_OBJECT_MANAGER.add(new GenericObject("assets/models/house.json", [
            (29/64.0)*GAME_OBJECT_MANAGER.getLandscape().landscapeWidth,
            0,
            (37/64.0)*GAME_OBJECT_MANAGER.getLandscape().landscapeDepth], 0, 4), ObjectTypes.Collidable);
        GAME_OBJECT_MANAGER.add(new GenericObject("assets/models/stick.json", [
            (50/64.0)*GAME_OBJECT_MANAGER.getLandscape().landscapeWidth,
            0,
            (12/64.0)*GAME_OBJECT_MANAGER.getLandscape().landscapeDepth], 0, 3), ObjectTypes.Collidable);
        GAME_OBJECT_MANAGER.add(new PlayerObject(CONTROLS), ObjectTypes.Collidable);

        this.objectsLoading = true;
    }

    //After player loaded:
    if (GAME_OBJECT_MANAGER.loaded) {
        GAME.toPlaying();
    }
};

GameState_Load.prototype.draw = function () {};
