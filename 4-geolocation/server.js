var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    db = require('./db');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(bodyParser());

app.post('/save', function (req, res) {
    var name = req.body.name,
        position = req.body.position,
        tags = req.body.tags;

    db.save(name, tags, position, function (err, result) {
        if(err) {
            res.status(500).end();
        } else {
            res.end();
        }
    });
});

app.get('/find', function (req, res) {
    var position = req.query.position,
        tags = req.query.tags,
        range = req.query.range;

    db.find(position, range, tags, function (err, result) {
        if(err) {
            res.status(500).end();
        } else {
            res.json(result).end();
        }
    });
});

app.listen(3000);

var static = require('node-static');

var file = new static.Server('.');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8080);
