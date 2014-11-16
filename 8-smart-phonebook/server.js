var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    db = require('./db');

app.use(bodyParser.json());

app.post('/contacts', function (req, res) {
    var number = req.phoneNumber;
    db.createContact({ number: number }, function (err, result) {
        if(err) {
            res.status(500).end();
        } else {
            res.json(result[0]);
            res.end();
        }
    });
});

app.get('/contacts',  function (req, res) {
    db.retrieveAllContacts(function (err, result) {
        if(err) {
            res.status(500).end();
        } else {
            res.json(result);
            res.end();
        }
    });
});

app.get('/contacts/:id', function (req, res) {
    var id = req.param('id');
    db.retrieveContact(id, function (err, result) {
        if (err) {
            res.status(500).end();
        } else {
            res.json(result);
            res.end();
        }
    });
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

app.listen(8080);
