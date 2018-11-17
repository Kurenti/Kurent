///////////////////////////////////////////
// Gamestate_Menu.js_______________________
// gamestate preko katerega Game.js poganja
// igro med menijem
///////////////////////////////////////////

function GameState_Menu (canvas) {
    this.canvas = canvas;
}

GameState_Menu.prototype = new GameState(GameStateTtype.Menu);

GameState_Menu.prototype.call = function () {
    // Initialise mouse input
    this.mouse = new Mouse(this.canvas);
    this.mouse.addListener();
};

GameState_Menu.prototype.update = function (elapsedTime) {
};

GameState_Menu.prototype.draw = function () {
};

GameState_Menu.prototype.destroy = function() {
    // Remove mouse input listener
    this.mouse.removeListener();
};