///////////////////////////////////////////
// Gamestate_Menu.js_______________________
// gamestate preko katerega Game.js poganja
// igro med menijem
///////////////////////////////////////////

function GameState_Menu () {
    // Define menu display (controlled by call and dismiss)
    this.menuDisplay = document.getElementById("menuOverlay");
    this.menuDisplay.style.width = String(GRAPHICS.canvas.width);
    this.menuDisplay.style.height = String(GRAPHICS.canvas.height);
}
GameState_Menu.prototype = new GameState(GameStateType.Menu);

GameState_Menu.prototype.call = function () {
    this.menuDisplay.style.display = "block";

    //This resets game
    GAME_OBJECT_MANAGER.empty();
    GRAPHICS.setUpDraw();

    // Assign actions to buttons
    //This cannot be done in constructor already, because all gamestates are not defined yet
    document.getElementById("buttonNewGame").onclick = GAME.toLoad;
};

GameState_Menu.prototype.dismiss = function () {
    this.menuDisplay.style.display = "none";
};

GameState_Menu.prototype.update = function (elapsedTime) {};

GameState_Menu.prototype.draw = function () {};