////////////////////////////////
// Gamestate_Load.js____________
// vmesni gamestate v katerem se
// loadajo asseti
////////////////////////////////

function GameState_Load () {
    //Event factory
    this.eventFactory = new EventFactory();

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
    this.objectsLoading = false;
};

GameState_Load.prototype.update = function (elapsedTime) {

    //After landscape loaded:
    if (GAME_OBJECT_MANAGER.landscapeLoaded && !this.objectsLoading) {

        // Environment objects
        //////////////////////
        // Ice sheet
        GAME_OBJECT_MANAGER.add(new Ice([
            38*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64),
            6.35,//6.35,
            33*(GAME_OBJECT_MANAGER.getLandscape().landscapeDepth/64)], 8));
        // Trees
        GAME_OBJECT_MANAGER.add(new GenericObject("assets/models/tree.json", [
            30*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64.0),
            0,
            30*(GAME_OBJECT_MANAGER.getLandscape().landscapeDepth/64.0)], 0, 2), ObjectTypes.Collidable);
        GAME_OBJECT_MANAGER.add(new GenericObject("assets/models/tree.json", [
            31*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64.0),
            0,
            31*(GAME_OBJECT_MANAGER.getLandscape().landscapeDepth/64.0)], 0, 3), ObjectTypes.Collidable);
        GAME_OBJECT_MANAGER.add(new GenericObject("assets/models/tree.json", [
            34*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64.0),
            0,
            40*(GAME_OBJECT_MANAGER.getLandscape().landscapeDepth/64.0)], 0, 3), ObjectTypes.Collidable);
        GAME_OBJECT_MANAGER.add(new GenericObject("assets/models/stump.json", [
            32*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64.0),
            0,
            43*(GAME_OBJECT_MANAGER.getLandscape().landscapeDepth/64.0)], 0, 3), ObjectTypes.Collidable);
        // House
        GAME_OBJECT_MANAGER.add(new GenericObject("assets/models/house.json", [
            29*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64.0),
            0,
            37*(GAME_OBJECT_MANAGER.getLandscape().landscapeDepth/64.0)], 0, 4), ObjectTypes.Collidable);
        // Bell stick
        GAME_OBJECT_MANAGER.add(new GenericObject("assets/models/stick.json", [
            50*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64.0),
            0,
            12*(GAME_OBJECT_MANAGER.getLandscape().landscapeDepth/64.0)], 0, 3), ObjectTypes.Collidable);

        //Triggers
        //////////
        // Bell
        this.eventFactory.makeEvent([
            50*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64.0),
            15,
            12*(GAME_OBJECT_MANAGER.getLandscape().landscapeDepth/64.0)],
            3*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth / 64.0),
            EventType.Bell);
        // Ice
        this.eventFactory.makeEvent([
            40.5*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64),
            6.35,
            34.6*(GAME_OBJECT_MANAGER.getLandscape().landscapeDepth/64)],
            3*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth / 64.0),
            EventType.Ice);
        this.eventFactory.makeEvent([
                36.5*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64),
                6.35,
                34*(GAME_OBJECT_MANAGER.getLandscape().landscapeDepth/64)],
            4*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth / 64.0),
            EventType.Ice);
        this.eventFactory.makeEvent([
                36*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64),
                6.35,
                31.8*(GAME_OBJECT_MANAGER.getLandscape().landscapeDepth/64)],
            3.2*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth / 64.0),
            EventType.Ice);

        //Player
        ////////
        // Bell
        var bell = new BellObject([
            50.1*(GAME_OBJECT_MANAGER.getLandscape().landscapeWidth/64.0),
            15,
            12.1*(GAME_OBJECT_MANAGER.getLandscape().landscapeDepth/64.0)], 0.14);
        GAME_OBJECT_MANAGER.add(bell);
        // Player
        GAME_OBJECT_MANAGER.add(new PlayerObject(CONTROLS, bell), ObjectTypes.Player);

        this.objectsLoading = true;
    }

    //After player loaded:
    if (GAME_OBJECT_MANAGER.loaded) {
        GAME.toPlaying();
    }
};

GameState_Load.prototype.draw = function () {};
