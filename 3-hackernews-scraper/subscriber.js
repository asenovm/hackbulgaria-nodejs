var express = require('express'),
    db = require('./db'),
    app = express();

app.listen(3001);

app.post('/subscribe', function (req, res) {
    var subscriber = req.body;
    db.addSubscriber(subscriber);
});

app.post('/unsubscribe', function (req, res) {
    console.log('unsubscribe method stub');
});

app.get('/listSubscribers', function (req, res) {
    console.log('list subscribers method stub');
});
