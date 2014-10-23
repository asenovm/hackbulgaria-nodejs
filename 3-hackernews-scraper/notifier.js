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
            subscriptionText += 'https://news.ycombinator.com/item?id=' + article.id + '\\n\\n';
        });

        if(subscriptionText) {
            email_sender.sendMail(subscriber.email, subscriptionText);
        }
    });
});

function _filterArticlesForSubscriber(articles, subscriber) {
    var filteredArticles = [];
    _.each(articles, function (article) {
        if(article.type === 'story' && !_.contains(filteredArticles, article)) {
            filteredArticles.push(article);
        } else if(article.type === 'comment') {
            //TODO
        }
    });

    return filteredArticles;
}

app.listen(3000);
