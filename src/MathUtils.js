/////////////////////////////////////////////
// MathUtils.js______________________________
// This is a collection of simple and quick
// math functions used throughout the program
/////////////////////////////////////////////

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function sideOfVector(a, b) {
	// Returns 1 or -1, whether
	// vector b is to the left or right of vector a
	var orthA = vec3.fromValues(a[2], a[1], -a[0]);

	if (vec3.dot(orthA, b) < 0) {
		return -1;
	} else {
		return 1;
	}
}