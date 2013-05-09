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

    // TODO: remove this
    generateGraph();
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
var algorithm;

function init() {
    // Set up canvas
    var canvas = document.getElementById('panel');
    canvas.setAttribute('width', MAX_COORDINATE * CELL_SIZE + CELL_SIZE);
    canvas.setAttribute('height', MAX_COORDINATE * CELL_SIZE + CELL_SIZE);

    // Generate seed
    var time = Date.now();
    sessionStorage["seed"] = time;

    // TODO: set up click handlers
    $("#buildGraphOk").click(generateGraph);
    $("#stepButton").click(step);
}

function step() {
    if (algorithm === undefined) {
        // TODO: fix this
        algorithm = new BfsDfsFinder(graph, start, goal, false);
    }

    lastAddedToClosedSet = algorithm.step();
    drawGraph();
}

function generateGraph() {
    var seed = lastSeed;
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

    drawGraph();
}

function drawGraph() {
    var panel = document.getElementById("panel");
    panel.width = panel.width;

    var ctx = panel.getContext("2d");

    ctx.strokeStyle = INITIAL_COLOR;
    ctx.lineWidth = 1;

    // Draw all normal edges
    for (var i = 0; i < vertices.length; i++) {
        var neighbors = graph.getNeighbors(vertices[i]);
        for (var iter = 0; iter < neighbors.length; iter++) {
            var p = neighbors[iter].vertex;
            ctx.beginPath();
            ctx.moveTo(vertices[i].x * CELL_SIZE + CELL_SIZE, vertices[i].y * CELL_SIZE + CELL_SIZE);
            ctx.lineTo(p.x * CELL_SIZE + CELL_SIZE, p.y * CELL_SIZE + CELL_SIZE);
            ctx.stroke();
            ctx.closePath();
        }
    }
    
    // Draw all nodes
    ctx.fillStyle = INITIAL_COLOR;
    for (var i = 2; i < vertices.length; i++) {
        ctx.fillRect(vertices[i].x * CELL_SIZE - NODE_WIDTH / 2 + CELL_SIZE,
                     vertices[i].y * CELL_SIZE - NODE_WIDTH / 2 + CELL_SIZE,
                     NODE_WIDTH, NODE_HEIGHT);
    }

    if (algorithm !== undefined) {
        // Paint edges in open set
        ctx.strokeStyle = OPEN_COLOR;
        ctx.lineWidth = 2;
        var openSet = algorithm.openSet;
        for (var i = 0; i < openSet.length; i++) {
            var p = openSet[i];
            var pred = algorithm.getPredecessor(p);
            if (pred !== undefined) {
                ctx.beginPath();
                ctx.moveTo(pred.x * CELL_SIZE + CELL_SIZE, pred.y * CELL_SIZE + CELL_SIZE);
                ctx.lineTo(p.x * CELL_SIZE + CELL_SIZE, p.y * CELL_SIZE + CELL_SIZE);
                ctx.stroke();
                ctx.closePath();
            }
        }

        ctx.strokeStyle = CLOSED_COLOR;
        ctx.lineWidth = 2;
        var closedSet = algorithm.closedSet;
        for (var i = 0; i < openSet.length; i++) {
            var p = closedSet[i];
            var pred = algorithm.getPredecessor(p);
            if (pred !== undefined) {
                ctx.beginPath();
                ctx.moveTo(pred.x * CELL_SIZE + CELL_SIZE, pred.y * CELL_SIZE + CELL_SIZE);
                ctx.lineTo(p.x * CELL_SIZE + CELL_SIZE, p.y * CELL_SIZE + CELL_SIZE);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    // Start and Goal nodes
    var x = vertices[0].x * CELL_SIZE + CELL_SIZE;
    var y = vertices[0].y * CELL_SIZE + CELL_SIZE;
    ctx.beginPath();
    ctx.arc(x, y, NODE_WIDTH, 0, 2 * Math.PI);
    ctx.fillStyle = START_COLOR;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(x, y, NODE_WIDTH * 2, 0, 2 * Math.PI);
    ctx.strokeStyle = START_COLOR;
    ctx.stroke();
    ctx.closePath();

    if (goal !== undefined) {
        x = vertices[1].x * CELL_SIZE + CELL_SIZE;
        y = vertices[1].y * CELL_SIZE + CELL_SIZE;
        ctx.beginPath();
        ctx.arc(x, y, NODE_WIDTH, 0, 2 * Math.PI);
        ctx.fillStyle = GOAL_COLOR;
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(x, y, NODE_WIDTH * 2, 0, 2 * Math.PI);
        ctx.strokeStyle = GOAL_COLOR;
        ctx.stroke();
        ctx.closePath();
    }
}
