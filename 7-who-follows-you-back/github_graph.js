var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    Graph = require('./graph'),
    mongo = require('mongodb'),
    _ = require('underscore'),
    MongoClient = mongo.MongoClient,
    BSON = mongo.BSONPure,
    GITHUB_API_URL = 'https://api.github.com',
    DB_URL = 'mongodb://localhost:7275/github', db,
    COLLECTION_GRAPHS = 'graphs',
    app = express();

MongoClient.connect(DB_URL, function (err, dbInstance) {
    db = dbInstance;
});

app.use(bodyParser.json());

app.post('/createGraphFor', function (req, res) {
    var username = req.body.username,
        depth = req.body.depth,
        graphs = db.collection(COLLECTION_GRAPHS);

    graphs.insert({
        username: username,
        depth: depth
    }, function (err, result) {
        if(err) {
            res.status(500).end();
        } else {
            res.json(result);

            var graph = new Graph();
            getFollowingForDepth(graph, username, depth, function (err, graph) {
                graphs.update({ _id: new BSON.ObjectID(result[0]._id) }, { $set: { graph: graph.toString() }}, function (err, updated) {
                    if(err) {
                        console.dir(err);
                    }
                });
            });
        }
    });

});

app.get('/graph/:id', function (req, res) {
    var id = req.param('id'),
        graphs = db.collection(COLLECTION_GRAPHS);

    graphs.findOne({ _id: new BSON.ObjectID(id) }, function (err, result) {
        if(result.graph) {
            res.json(result.graph);
        } else {
            res.status(404, 'Graph not generated yet').end();
        }
    });


});

app.get('/mutually_follow/:id/:username', function (req, res) {
    var id = req.param('id'),
        username = req.param('username'),
        graphs = db.collection(COLLECTION_GRAPHS);

    graphs.findOne({ _id: new BSON.ObjectID(id) }, function (err, result) {
        if(result.graph) {
            var graph = new Graph(JSON.parse(result.graph)),
                fromAuthorToUsername = _.contains(graph.getNeighboursFor(result.username), username),
                fromUsernameToAuthor = _.contains(graph.getNeighboursFor(username), result.username);

            if(fromAuthorToUsername && fromUsernameToAuthor) {
                res.json({ relation: 'mutual' }).end();
            } else if (fromAuthorToUsername) {
                res.json({ relation: 'first' }).end();
            } else {
                //XXX it may be the case that the users don't follow each other at all
                res.json({ relation: 'second' }).end();
            }
        } else {
            res.status(404).end();
        }
    });

});

function getFollowingForDepth(graph, username, depth, callback, isLast) {
    if (depth === 0 && isLast) {
        callback(false, graph);
        return;
    }

    request({
        url: getApiUrl('/users/' + username + '/following'),
        method: 'GET',
        headers: {
            'User-Agent': 'social-graph'
        }
    }, function (err, data, body) {
        if(err) {
            callback(err, false);
        } else {
            console.dir(data.headers);
            var following = JSON.parse(body);
            for(var i = 0; i < following.length; ++i) {
                graph.addEdge(username, following[i].login);
                getFollowingForDepth(graph, following[i].login, depth - 1, callback, (i === following.length - 1));
            }
        }
    });
}

function getApiUrl(path) {
    return GITHUB_API_URL + path + '?client_id=f43beb9407c56dcb402b&client_secret=1a162753b43f09a00aae4a215876eb83137e6edc';
}

app.listen(8080);
