var express = require('express'),
    _ = require('underscore'),
    db = require('./db'),
    bodyParser = require('body-parser'),
    email_sender = require('./email_sender'),
    app = express();

app.use(bodyParser.json());

app.post('/newArticles', function (req, res) {
    var subscribers = db.getSubscribers(),
        newArticles = req.body.articles;

    _.each(subscribers, function (subscriber) {
        var filteredArticles = _filterArticlesForSubscriber(newArticles, subscriber),
            subscriptionText = '';

        _.each(filteredArticles, function (article) {
            if(article.comment) {
                subscriptionText += article.comment + '\n\n';
                subscriptionText += 'https://news.ycombinator.com/item?id=' + article.id + '\n\n';
            } else {
                subscriptionText += 'https://news.ycombinator.com/item?id=' + article.id + '\n\n';
            }
        });

        if(subscriptionText) {
            email_sender.sendMail(subscriber.email, subscriptionText);
        
    });

    res.end();
});

function _filterArticlesForSubscriber(articles, subscriber) {
    var filteredArticles = [];
    _.each(articles, function (article) {
        //TODO actually filter
        filteredArticles.push(article);
    });

    return filteredArticles;
}

app.listen(3000);
