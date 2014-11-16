var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    db = require('./db');

app.use(bodyParser.json());

app.post('/contacts', function (req, res) {
    var number = req.body.phoneNumber,
        name = req.body.name;

    db.createContact({ number: number, name: name }, function (err, result) {
        if(err) {
            res.status(500).end();
        } else {
            res.json(result[0]);
            res.end();
        }
    });
});

app.get('/contacts',  function (req, res) {
    db.retrieveAllContacts(genericDbHandler(res));
});

app.get('/contacts/:id', function (req, res) {
    var id = req.param('id');
    db.retrieveContact(id, genericDbHandler(res));
});

app.delete('/contacts/:id', function (req, res) {
    var id = req.param('id');
    db.deleteContact(id, function (err, deletedRows) {
        if (err) {
            res.status(500).end();
        } else {
            res.json({ deleted: deletedRows });
            res.end();
        }
    });
});

app.get('/groups', function (req, res) {
    db.retrieveAllGroups(genericDbHandler(res));
});

function genericDbHandler (response) {
    return function (err, result) {
        if (err) {
            response.status(500).end();
        } else {
            response.json(result);
            response.end();
        }
    };
}

app.listen(8080);
