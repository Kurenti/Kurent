///////////////////////////////////////////
// Keyboard.js_____________________________
// Razred, v katerem zaznavamo pritisnjene
// gumbe na tipkovnici.
///////////////////////////////////////////

function Keyboard() {
    // List of currently pressed keys
    this.currentlyPressedKeys = {};
    // Speed (0 - standing still, 1 - moving forward, -1 - moving backwards)
    this.speed = 0;
    // left/right rotation
    this.yRotation = 0;
    // Attack is denoted by number of attack (1, 2, 3, 4)
    this.attack = 0;
    // Flag that tells if pause button was pressed
    this.pause = false;
}

Keyboard.prototype.addListener = function() {
    document.onkeyup = this.handleKeyUp.bind(this);
    document.onkeydown = this.handleKeyDown.bind(this);
};

Keyboard.prototype.removeListener = function() {
    document.onkeyup = null;
    document.onokeydown = null;
};

Keyboard.prototype.handleKeyDown = function(event) {
    // Shranimo pritisnjeno tipko.
    this.currentlyPressedKeys[event.key] = true;
};

Keyboard.prototype.handleKeyUp = function(event) {
    // Odstranimo nepritisnjeno tipko.
    this.currentlyPressedKeys[event.key] = false;
};

Keyboard.prototype.handleKeys = function() {
    // Funkcija se klice vsakic, preden se na
    // novo narise scena in nastavi ustrezne
    // parametre, ki nato manipulirajo s svetom.

    // W - move forward
    if (this.currentlyPressedKeys["w"]) {
        this.speed = 1;
    // S - move backward
    } else if (this.currentlyPressedKeys["s"]) {
        this.speed = -1;
    } else {
        this.speed = 0;
    }
    // A - turn left
    if (this.currentlyPressedKeys["a"]) {
        this.yRotation = 1;
    // D - turn right
    } else if (this.currentlyPressedKeys["d"]) {
        this.yRotation = -1;
    } else {
        this.yRotation = 0;
    }

    // H - attack 1
    if (this.currentlyPressedKeys["h"]) {
        this.attack = 1;
    }
    // J - attack 2
    else if (this.currentlyPressedKeys["j"]) {
        this.attack = 2;
    }
    // K - attack 3
    else if (this.currentlyPressedKeys["k"]) {
        this.attack = 3;
    }
    // L - attack 4
    else if (this.currentlyPressedKeys["l"]) {
        this.attack = 4;
    }
    // Esc - pause
    this.pause = !!this.currentlyPressedKeys["Escape"];
};
