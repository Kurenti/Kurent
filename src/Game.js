//////////////////////////////////////////
// Game.js________________________________
// Osnovni class, ki poganja celotno igro.
//////////////////////////////////////////

function Game() {

    GAME = this;
    GRAPHICS = new Graphics();
    GAME_OBJECT_MANAGER = new GameObjectManager();
    CONTROLS = new Keyboard();
    //This is to be moved somewhere more appropriate:
    CONTROLS.addListener();

    // Gamestate-i:
    this.gameStates = {
        menu: new GameState_Menu(),
        load: new GameState_Load(),
        playing: new GameState_Playing(),
        pause: new GameState_Pause(),
        exiting: new GameState_Exiting()
    };
    this.currentGameState = this.gameStates.menu;
    this.currentGameState.call();
    this.newGameState = this.currentGameState;

    // Game clock
    this.lastTime = 0.0;
}

Game.prototype.start = function () {

    if (GRAPHICS.initSuccess) {

        this.resetTime();

        // Set time interval of executing of the function (set fps)
        var loop = setInterval(function () {
            this.gameLoop();
            this.setGameState();

            if (this.isExiting()) {
                clearInterval(loop);
            }
        }.bind(this), 16);
    }

};

Game.prototype.gameLoop = function () {

    const elapsedTime = this.resetTime();

    this.currentGameState.update(elapsedTime);
    this.currentGameState.draw();
};

Game.prototype.resetTime = function () {
    const oldTime = this.lastTime;
    this.lastTime = performance.now();

    return this.lastTime - oldTime;
};

// Funkcije za prehajanje med fazami igre - prehod je izveden sele ob koncu gameloopa
//Namesto this je GAME, ker se do nekaterih funkcij dostopa preko onclick
/////////////////////////////////////////
Game.prototype.toMenu = function () {
    GAME.newGameState = GAME.gameStates.menu;
};

Game.prototype.toLoad = function () {
    GAME.newGameState = GAME.gameStates.load;
};

Game.prototype.toPlaying = function () {
    GAME.newGameState = GAME.gameStates.playing;
};

Game.prototype.toPause = function () {
    GAME.newGameState = GAME.gameStates.pause;
};

Game.prototype.toExiting = function () {
    GAME.newGameState = GAME.gameStates.exiting;
};

Game.prototype.setGameState = function () {
    if (this.newGameState !== this.currentGameState) {
        this.currentGameState.dismiss();
        this.currentGameState = this.newGameState;
        this.currentGameState.call();
    }
};

Game.prototype.isExiting = function () {
    return this.currentGameState.getGameStateType() === GameStateType.Exiting;
};
