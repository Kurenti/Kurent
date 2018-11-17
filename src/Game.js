////////////////////////////////////////
// Game.js______________________________
// Osnovni class, ki poganja celotno igro.
////////////////////////////////////////

function Game() {

    // Gamestate-i:
    this.gameStates = {
        Menu: new GameState_Menu,
        Playing: new GameState_Playing,
        Exiting: new GameState_Exiting
    };
    this.currentGameState = this.gameStates.Menu;
    this.currentGameState.call();
    this.newGameState = this.currentGameState;
    this.controls = new Keyboard();

    this.canvas = null;
    this.gl = null;

    // Game clock
    this.lastTime = 0.0;
}

Game.prototype.start = function () {

    this.canvas = document.getElementById("canvas");
    this.initWebGl();

    if (this.gl) {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);                     // Set clear color to black, fully opaque
        this.gl.clearDepth(1.0);                                    // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);                         // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);                          // Near things obscure far things

        // Set event based functions that detect key presses and releases
        document.onkeydown = this.controls.handleKeyDown.bind(this.controls);
        document.onkeyup = this.controls.handleKeyUp.bind(this.controls);

        this.resetTime();

        // Set time interval of executing of the function (set fps)
        setInterval(function () {
            this.gameLoop();
            this.setGameState();
        }.bind(this), 15);
    }

};

Game.prototype.gameLoop = function () {
    // Preberi pritisnjene gumbe in popravi ustrezne vrednosti
    this.controls.handleKeys();

    var elapsedTime = this.resetTime();

    this.currentGameState.update(elapsedTime);
    this.currentGameState.draw();
};

Game.prototype.resetTime = function () {
    var oldTime = this.lastTime;
    this.lastTime = performance.now();

    return this.lastTime - oldTime;
};

// Funkcije za prehajanje med fazami igre - prehod je izveden sele ob koncu gameloopa
Game.prototype.toMenu = function () {
    this.newGameState = this.gameStates.Menu;
};

Game.prototype.toPlaying = function () {
    this.newGameState = this.gameStates.Playing;
};

Game.prototype.toExiting = function () {
    this.newGameState = this.gameStates.Exiting;
};

Game.prototype.setGameState = function () {
    if (this.newGameState !== this.currentGameState) {

        this.currentGameState = this.newGameState;

        this.currentGameState.call();
    }
};

Game.prototype.isExiting = function () {
    if (this.currentGameState.getGameStateType() === getGameStateType.Exiting) {
        return true;
    }
    return true;
};

// Funkcija, ki iz canvasa inicializira webgl
Game.prototype.initWebGl = function () {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        this.gl.viewportWidth = this.canvas.width;
        this.gl.viewportHeight = this.canvas.height;
    } catch (e) {
        console.log(e);
    }

    // If we don't have a GL context, give up now
    if (!this.gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
};
