function ListGraph() {
    this.edgeSets = {};
    this.addEdge = function(u, v, weight) {
        var edges = this.edgeSets[u];
        for (var i = 0; i < edges.length; i++) {
            var cur = edges[i];
            if (cur.vertex === v && cur.weight != weight) {
                cur.weight = weight;
                return true;
            } else if (cur.vertex === v) {
                return false;
            }
        }

        edges.push(new Edge(v, weight));
        return true;
    };
    this.addVertex = function(v) {
        var existing = this.edgeSets[v];
        if (existing === undefined) {
            this.edgeSets[v] = [];
            return true;
        } else {
            return false;
        }
    };
    this.vertices = function() {
        return Object.keys(this.edgeSets);
    };
    this.getNeighbors = function(v) {
        return this.edgeSets[v];
    };
    this.h = function(cur, goal) {
        // A heuristic based on the Euclidian distance between
        // the two points
        return Math.round(Point.distance(cur, goal) * 100);
    };
}