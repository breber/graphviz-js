function BfsDfsFinder(graph, start, goal, isDfs) {
    this.graph = graph;
    this.start = start;
    this.goal = goal;
    this.predMap = {};
    this.openSet = [start];
    this.closedSet = [];
    this.done = false;

    this.getPredecessor = function(vertex) {
        return this.predMap[vertex];
    };
    this.getPath = function(vertex) {
        var current = vertex;
        var path = [];
        var pred = null;
        
        path.push(current);
        while ((pred = this.getPredecessor(vertex)) !== undefined) {
            path.unshift(pred);
            current = pred;
        }

        if (start === path[0]) {
            return path;
        } else {
            return [];
        }
    };


    // Overridden
    this.step = function() {
        if (this.openSet.length === 0) {
            this.done = true;
        }

        if (this.done) {
            return null;
        }

        var current = (this.isDfs) ? this.openSet.pop() : this.openSet.shift();
        this.closedSet.push(current);

        if (current.equals(this.goal)) {
            this.done = true;
            return current;
        }

        var neighbors = this.graph.getNeighbors(current);
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (!neighbor.vertex.equals(this.start) && this.getPredecessor(neighbor.vertex) === undefined) {
                this.openSet.push(neighbor.vertex);
                this.predMap[neighbor.vertex] = current;
            }
        }

        // console.log("--- Step ---");
        // console.log("OpenSet: " + this.openSet.length + " ClosedSet: " + this.closedSet.length);
        // console.log(this.openSet);
        // console.log(this.closedSet);
        // console.log(this.predMap);

        return current;
    };

    this.getDistance = function(vertex) {
        return getPath(vertex).length;
    }

    // Unique to BFS/DFS
    this.isDfs = isDfs;
}