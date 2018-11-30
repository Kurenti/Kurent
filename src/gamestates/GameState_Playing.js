///////////////////////////////////////////
// Gamestate_Playing.js____________________
// gamestate preko katerega Game.js poganja
// igro med samim resnim igranjem
///////////////////////////////////////////
HINTS = {
	texts1: [
        "Kurent, a mighty force of nature...",
        "you have descended on winter earth to help life and the living.",
        "Your mission in life is to banish snow from the land.",
        "Try moving around with W, A, S, D",
		"Why don't you check out that shiny bell over there!",
		"Pick up the bell by pressing E.",
		"",
        "That...that colored cube...assets are expensive..."
	],
	intervals1: [
		2000,
		5000,
		8000,
		11000,
		14000,
        17000,
		35000,
		38000
	],
	texts2: [
        "Great! Now try dancing around by pressing 1.",
        "That's how you cleanse the earth of snow."
	],
    intervals2: [
        2000,
        5000
    ],
	texts3: [
		"Now try shaking your hips a little wilder! Press 2"
	],
	texts4: [
		"You managed to cleanse quite some snow!",
		"See if there's someone in the village that is especially gratefull.",
		"",
		"The villager has a special bell they want to give you!",
		"Press E to accept it",
        "That..other...cube...yea, the colored big one."
	],
    intervals4: [
        2000,
        5000,
		10000,
        13000,
        16000,
        19000
    ],
	texts5: [
		"Now go wild, Kurent! Try dances 3 and 4 ;)"
	]
};

function GameState_Playing () {
	this.hintDisplay = document.getElementById("hints");
	this.stage = 1;
	this.totalTimes = [0.0, 0.0, 0.0, 0.0, 0.0];
}

GameState_Playing.prototype = new GameState(GameStateType.Playing);

GameState_Playing.prototype.call = function () {
};

GameState_Playing.prototype.dismiss = function () {
    this.hintDisplay.style.display = "none";
    this.stage = 1;
    this.totalTimes = [0.0, 0.0, 0.0, 0.0, 0.0];
};

GameState_Playing.prototype.update = function (elapsedTime) {
	this.hintDisplay.style.display = "block";
	this.totalTimes[this.stage - 1] += elapsedTime;
	this.handleHints();

	CONTROLS.handleKeys();
	if (CONTROLS.pause) {
        GAME.toPause();
    }
	GAME_OBJECT_MANAGER.updateAll(elapsedTime);
};

GameState_Playing.prototype.draw = function () {

	GRAPHICS.setUpDraw();
	GAME_OBJECT_MANAGER.drawAll();
};

GameState_Playing.prototype.handleHints = function() {
	var displayed = false;
	if (GAME_OBJECT_MANAGER.getPlayer().bestDance === 4){
		this.stage = 5;
		if (this.totalTimes[4] < 3000) {
            this.hintDisplay.style.left = (GRAPHICS.canvas.width / 2 - HINTS.texts5[0].length / 2 * 10).toString() + "px";
            this.hintDisplay.innerText = HINTS.texts5[0];
            displayed = true;
        }
	} else if (GAME_OBJECT_MANAGER.getPlayer().stage1done) {
		this.stage = 4;
        for(let i = 0; i < HINTS.intervals4.length; i++) {
            if(this.totalTimes[3] < HINTS.intervals4[i]) {
                this.hintDisplay.style.left = (GRAPHICS.canvas.width / 2 - HINTS.texts4[i].length / 2 * 10).toString() + "px";
                this.hintDisplay.innerText = HINTS.texts4[i];
                displayed = true;
                break;
            }
        }
	} else if (GAME_OBJECT_MANAGER.getPlayer().bestDance === 2) {
		this.stage = 3;
        if (this.totalTimes[2] < 3000) {
            this.hintDisplay.style.left = (GRAPHICS.canvas.width / 2 - HINTS.texts3[0].length / 2 * 10).toString() + "px";
            this.hintDisplay.innerText = HINTS.texts3[0];
            displayed = true;
        }
	} else if (GAME_OBJECT_MANAGER.getPlayer().bellEquipped) {
        this.stage = 2;
        for(let i = 0; i < HINTS.intervals2.length; i++) {
            if(this.totalTimes[1] < HINTS.intervals2[i]) {
                this.hintDisplay.style.left = (GRAPHICS.canvas.width / 2 - HINTS.texts2[i].length / 2 * 10).toString() + "px";
                this.hintDisplay.innerText = HINTS.texts2[i];
                displayed = true;
                break;
            }
        }
	} else {
        this.stage = 1;
        for(let i = 0; i < HINTS.intervals1.length; i++) {
            if(this.totalTimes[0] < HINTS.intervals1[i]) {
                this.hintDisplay.style.left = (GRAPHICS.canvas.width / 2 - HINTS.texts1[i].length / 2 * 10).toString() + "px";
                this.hintDisplay.innerText = HINTS.texts1[i];
                displayed = true;
                break;
            }
        }
	}

	if(!displayed) {
		this.hintDisplay.innerText = "";
	}
};