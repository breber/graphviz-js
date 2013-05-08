var NODE_WIDTH = 4;
var NODE_HEIGHT = 4;
var CELL_SIZE = 7;
var MAX_COORDINATE = 100;

var INITIAL_COLOR = "rgb(0, 255, 0)";
var OPEN_COLOR = "rgb(255, 0, 0)";
var CLOSED_COLOR = "rgb(0, 0, 0)";
var OPEN_COLOR_REVERSE = "rgb(255, 0, 255)";
var CLOSED_COLOR_REVERSE = "rgb(64, 64, 64)";
var START_COLOR = "rgb(0, 0, 0)";
var GOAL_COLOR = "rgb(64, 64, 64)";
var PATH_COLOR = "rgb(0, 0, 255)";
var LAST_ADDED_COLOR = "rgb(0, 255, 255)";

$().ready(function() {
	init();
});

function init() {
	// Set up canvas
	var canvas = document.getElementById('panel');
	canvas.style.width = MAX_COORDINATE * CELL_SIZE;
	canvas.style.height = MAX_COORDINATE * CELL_SIZE;

	// Generate seed
	var time = Date.now();
	sessionStorage["seed"] = time;

	// TODO: set up click handlers
	$("#buildGraphOk").click(generateGraph);
}

function generateGraph() {
	alert("generating --> " + sessionStorage["seed"]);
}
