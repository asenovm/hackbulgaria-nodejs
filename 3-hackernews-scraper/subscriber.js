var express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('node-uuid'),
    db = require('./db'),
    app = express();

app.use(bodyParser.json());
app.listen(3001);

app.post('/subscribe', function (req, res) {
    var subscriber = req.body;
    subscriber.id = uuid.v4();
    subscriber.isConfirmed = false;

    db.addSubscriber(subscriber);

    res.json({
        email: subscriber.email,
        subscriberId: subscriber.id
    });
    res.end();
});

app.get('/confirm/:id', function (req, res) {
    var id = req.param('id');
    if(db.hasSubscriber(id)) {
        db.confirmSubscriber(id);
    }
});

app.post('/unsubscribe', function (req, res) {
    console.log('unsubscribe method stub');
});

app.get('/listSubscribers', function (req, res) {
    console.log('list subscribers method stub');
});
