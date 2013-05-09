function ScoreDist(score, dist) {
    this.score = score;
    this.dist = dist;
}

function DijkstraAStarFinder(graph, start, goal, isDijkstras) {
    this.graph = graph;
    this.start = start;
    this.goal = goal;
    this.predMap = {};
    this.openSet = [start]; // A Priority Queue
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
        while ((pred = this.getPredecessor(current)) !== undefined) {
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
        if (this.distScore === null) {
            this.distScore = {};
            this.distScore[this.start] = new ScoreDist(0, 0);
        }

        if (this.openSet.length === 0) {
            this.done = true;
        }

        if (this.done) {
            return null;
        }

        var current = this.openSet.shift();

        if (this.closedSet[current] === undefined) {
            this.closedSet.push(current);
            if (current.equals(this.goal)) {
                this.done = true;
                return current;
            }

            var neighbors = this.graph.getNeighbors(current);
            for (var i = 0; i < neighbors.length; i++) {
                var edge = neighbors[i];
                var neighbor = edge.vertex;

                if (this.closedSet[neighbor] === undefined) {
                    var alt = this.distScore[current].dist + edge.weight;
                    if (this.distScore[neighbor] === undefined || alt < this.distScore[neighbor].dist) {
                        var score = alt;
                        if (!this.isDijkstras) {
                            score += this.graph.h(neighbor, goal);
                        }

                        this.distScore[neighbor] = new ScoreDist(score, alt);
                        this.openSet.push(neighbor);

                        // Sort the open set
                        var that = this;
                        this.openSet.sort(function(o1, o2) {
                            return that.distScore[o1].score - that.distScore[o2].score;
                        });

                        this.predMap[neighbor] = current;
                    }
                }
            }
            
            return current;
        }

        return null;
    };

    this.getDistance = function(vertex) {
        var distScore = this.distScore[vertex];
        if (distScore === undefined) {
            return -1;
        }

        return distScore.dist;
    }

    // Unique to Dijkstra/A*
    this.isDijkstras = isDijkstras;
    this.distScore = null;
}