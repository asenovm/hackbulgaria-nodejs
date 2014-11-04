var assert = require('chai').assert,
    Graph = require('../graph');

var graph = new Graph();
graph.addEdge('node1', 'node2');
graph.addEdge('node1', 'node3');
graph.addEdge('node2', 'node4');
graph.addEdge('node3', 'node4');

assert.equal(JSON.stringify(graph.getNeighboursFor('node1')), JSON.stringify(['node2', 'node3']));
assert.equal(JSON.stringify(graph.getNeighboursFor('node4')), JSON.stringify([]));
assert.equal(graph.pathBetween('node1', 'node4'), true);
assert.equal(graph.pathBetween('node2', 'node4'), true);
assert.equal(graph.pathBetween('node4', 'node1'), false);
assert.equal(JSON.stringify({ 'node1': ['node2', 'node3'], 'node2': ['node4'], 'node3': ['node4']}), graph.toString());
