var edges = {};

function DirectedGraph(edgesParam) {
    this.addEdge = addEdge;
    this.getNeighboursFor = getNeighboursFor;
    this.pathBetween = pathBetween;
    this.toString = toString;
    edges = edgesParam || {};
}

function addEdge(nodeA, nodeB) {
    edges[nodeA] = edges[nodeA] || [];
    edges[nodeA].push(nodeB);
}

function getNeighboursFor(node) {
    return edges[node] || [];
}

function pathBetween(nodeA, nodeB) {
    var visited = {};
    function dfs (node) {
        visited[node] = true;

        if(!edges[node]) {
            return;
        }

        edges[node].forEach(function (neighbour) {
            if(!visited[neighbour]) {
                visited[neighbour] = true;
                dfs(neighbour);
            }
        });
    }
    dfs(nodeA);
    return !!visited[nodeB];
}

function toString() {
    return JSON.stringify(edges);
}

module.exports = DirectedGraph;
