var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    db = require('./db');

app.use(bodyParser());

app.post('/save', function (req, res) {
    var name = req.body.name,
        position = req.body.position,
        tags = req.body.tags;

    db.save(name, tags, position);
    res.end();
});

app.get('/find', function (req, res) {
    var position = req.query.position,
        tags = req.query.tags,
        range = req.query.range;

    console.log('position is ', position);
    console.log('tags are ', tags);
    console.log('range is ', range);

    db.find(position, range, tags);
});

app.listen(3000);
