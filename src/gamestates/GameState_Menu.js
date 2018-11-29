///////////////////////////////////////////
// Gamestate_Menu.js_______________________
// gamestate preko katerega Game.js poganja
// igro med menijem
///////////////////////////////////////////

function GameState_Menu () {

}

GameState_Menu.prototype = new GameState(GameStateTtype.Menu);

GameState_Menu.prototype.call = function () {

};

GameState_Menu.prototype.update = function (elapsedTime) {

};

GameState_Menu.prototype.draw = function () {

};

GameState_Menu.prototype.showHide = function(show) {
    var menu = document.getElementById("overlay");
    if(show) {
        menu.display = "block";
    } else {
        menu.display = "none";
    }
};