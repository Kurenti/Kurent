/////////////////////////////////////
// Gamestate_Pause.js________________
// gamestate med katerim Game.js igro
// poganje med pavzo tekom igranja
/////////////////////////////////////

function GameState_Pause () {
    // Define menu display (controlled by call and dismiss)
    this.pauseDisplay = document.getElementById("pauseOverlay");
    this.pauseDisplay.style.width = String(GRAPHICS.canvas.width);
    this.pauseDisplay.style.height = String(GRAPHICS.canvas.height);
}
GameState_Pause.prototype = new GameState(GameStateType.Pause);

GameState_Pause.prototype.call = function () {
    this.pauseDisplay.style.display = "block";

    // Assign actions to buttons
    //This cannot be done in constructor already, because all gamestates are not defined yet
    document.getElementById("buttonExitToMenu").onclick = GAME.toMenu;
    if (GAME_OBJECT_MANAGER.getPlayer().fallenInLake) {
        document.getElementById("deathNote").style.display = "block";
        document.getElementById("buttonResume").style.display = "none";
    } else {
        document.getElementById("deathNote").style.display = "none";
        document.getElementById("buttonResume").style.display = "FLEX";
        document.getElementById("buttonResume").onclick = GAME.toPlaying;
    }
};

GameState_Pause.prototype.dismiss = function () {
    this.pauseDisplay.style.display = "none";
};

GameState_Pause.prototype.update = function (elapsedTime) {};

GameState_Pause.prototype.draw = function () {};