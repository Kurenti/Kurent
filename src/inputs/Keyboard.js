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
    // left/right orientation
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
    this.currentlyPressedKeys[event.keyCode] = true;
};

Keyboard.prototype.handleKeyUp = function(event) {
    // Odstranimo nepritisnjeno tipko.
    this.currentlyPressedKeys[event.keyCode] = false;
};

Keyboard.prototype.handleKeys = function() {
    // Funkcija se klice vsakic, preden se na
    // novo narise scena in nastavi ustrezne
    // parametre, ki nato manipulirajo s svetom.

    // W - move forward
    if (this.currentlyPressedKeys[87]) {
        this.speed = 1;
    // S - move backward
    } else if (this.currentlyPressedKeys[83]) {
        this.speed = -1;
    } else {
        this.speed = 0;
    }
    // A - turn left
    if (this.currentlyPressedKeys[65]) {
        this.yRotation = 1;
    // D - turn right
    } else if (this.currentlyPressedKeys[68]) {
        this.yRotation = -1;
    } else {
        this.yRotation = 0;
    }

    // H - attack 1
    if (this.currentlyPressedKeys[72]) {
        this.attack = 1;
    }
    // J - attack 2
    else if (this.currentlyPressedKeys[74]) {
        this.attack = 2;
    }
    // K - attack 3
    else if (this.currentlyPressedKeys[75]) {
        this.attack = 3;
    }
    // L - attack 4
    else if (this.currentlyPressedKeys[76]) {
        this.attack = 4;
    }
    // P - pause
    this.pause = !!this.currentlyPressedKeys[80];
};
