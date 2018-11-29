////////////////////////////////////
// Kurent.js________________________
// Osnovni script klican iz .html-ja
////////////////////////////////////

//Globals - asigned in Game contructor
var GAME;
var GRAPHICS;
var GAME_OBJECT_MANAGER;
var CONTROLS;

function start() {
	
	GAME = new Game;
	GAME.start();
}