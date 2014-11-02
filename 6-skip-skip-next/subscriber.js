var express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('node-uuid'),
    db = require('./db'),
    email_sender = require('./email_sender'),
    app = express();

app.use(bodyParser.json());
app.listen(3001);

app.post('/subscribe', function (req, res) {
    var subscriber = req.body;
    subscriber.id = uuid.v4();
    subscriber.isConfirmed = false;

    db.addSubscriber(subscriber);
    email_sender.sendMail(subscriber.email, getConfirmationText(subscriber.id));

    res.json({
        email: subscriber.email,
        subscriberId: subscriber.id
    });
    res.end();
});

app.get('/confirm/:id', function (req, res) {
    var id = req.param('id');
    db.getSubscriber(id, function (err, subscriber) {

        console.log('got subscriber with ');
        console.dir(subscriber);

        if(subscriber) {
            console.log('about to confirm');
            db.confirmSubscriber(id);
            res.end();
        }
    });
});

app.post('/unsubscribe', function (req, res) {
    var id = req.body.subscriberId;
    db.removeSubscriber(id);
    res.end();
});

app.get('/listSubscribers', function (req, res) {
    db.getSubscribers(function (err, subscribers) {
        res.json(subscribers).end();
    });
});

function getConfirmationText(id) {
    return 'Please confirm your subscribtion at http://localhost:3001/confirm/' + id;
}
