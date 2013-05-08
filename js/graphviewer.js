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

// Default graph attributes
var numberOfPoints = 1000;
var maxEdgeLength = 5;
var density = 100;
var lastSeed = 0;
var start = new Point(MAX_COORDINATE / 3, 2 * MAX_COORDINATE / 3);
var goal = new Point(MAX_COORDINATE - 10, 10);

// Instance vars
var vertices = [];
var graph = new ListGraph();
var lastAddedToClosedSet;

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
	var seed = 1; //sessionStorage["seed"];
	Math.seedrandom(seed);

	var initial = 0;
	if (start != null) {
		vertices[initial] = start;
		initial++;
	}
	if (goal != null) {
		vertices[initial] = goal;
		initial++;
	}

	// Generate 'size' distinct random points
	for (var i = initial; i < numberOfPoints; i++) {
		var collides = false;
		do {
			collides = false;
			var x = Math.floor(Math.random() * MAX_COORDINATE);
			var y = Math.floor(Math.random() * MAX_COORDINATE);

			var p = new Point(x, y);
			for (var j = 0; j < vertices.length; j++) {
				if (p.equals(vertices[j])) {
					collides = true;
					break;
				}
			}
			
			if (!collides) {
				vertices.push(p);
			}
		} while (collides);
	}

	var indexMap = {};
	for (var i = 0; i < numberOfPoints; i++) {
		graph.addVertex(vertices[i]);
		indexMap[vertices[i]] = i;
	}

	for (var i = 0; i < numberOfPoints; i++) {
		for (var j = 0; j < numberOfPoints; j++) {
			if (i !== j) {
				var dist = Math.round(Point.distance(vertices[i], vertices[j]) * 100);
				if (dist < maxEdgeLength * 100) {
					var flip = Math.random();
					if (flip * 100 < density) {
						// Add edges (i, j) and (j, i), if not already present
						var neighbors = graph.getNeighbors(vertices[i]);
						var found = false;
						for (var iter = 0; iter < neighbors.length; iter++) {
							var p = neighbors[iter].vertex;
							if (p.equals(vertices[j])) {
								found = true;
								break;
							}
						}

						if (!found) {
							graph.addEdge(vertices[i], vertices[j], dist);
							graph.addEdge(vertices[j], vertices[i], dist);
						}
					}
				}
			}
		}
	}
}
