var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./db'),
    app = express();

app.use(bodyParser.json());
app.listen(3001);

app.post('/subscribe', function (req, res) {
    var subscriber = req.body;
    console.log('subscirber is ', subscriber);
    db.addSubscriber(subscriber);
    res.end();
});

app.post('/unsubscribe', function (req, res) {
    console.log('unsubscribe method stub');
});

app.get('/listSubscribers', function (req, res) {
    console.log('list subscribers method stub');
});
