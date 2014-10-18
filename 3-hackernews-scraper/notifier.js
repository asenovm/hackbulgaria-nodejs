var express = require('express'),
    db = require('./db'),
    email_sender = require('./email_sender'),
    app = express();

email_sender.sendMail('asenov.m@gmail.com', 'test email being set with url = http://www.nodemailer.com/');

app.post('/newArticles', function (req, res) {
    var subscribers = db.getSubscribers(),
        newArticles = db.getNewArticles();

    _.each(subscribers, function (subscriber) {
    
    });
});

app.listen(3000);
