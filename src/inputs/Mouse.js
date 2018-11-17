///////////////////////////////////////////
// Mouse.js________________________________
// Razred, ki skrbi za branje akcij miške,
// za navigacijo po menijih.
///////////////////////////////////////////

function Mouse(canvas) {
    this.canvas = canvas;
    this.pressed = false;
    this.lastX = 0;
    this.lastY = 0;
}

Mouse.prototype.addListener = function() {
    this.canvas.addEventListener("click", this.setPosition.bind(this));
};

Mouse.prototype.removeListener = function() {
    this.canvas.removeEventListener("click", this.setPosition.bind(this));
};

Mouse.prototype.setPosition = function(event) {
    var mousePosition = this.getMousePosition(event);
    this.pressed = true;
    this.lastX = mousePosition.x;
    this.lastY = mousePosition.y;
};

Mouse.prototype.getMousePosition = function (event) {
    var rect = this.canvas.getBoundingClientRect();
    console.log(event.clientX - rect.left);
    console.log(event.clientY - rect.top);
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
};
