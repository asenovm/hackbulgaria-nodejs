var express = require('express'),
    _ = require('underscore'),
    db = require('./db'),
    email_sender = require('./email_sender'),
    app = express();

app.post('/newArticles', function (req, res) {
    var subscribers = db.getSubscribers(),
        newArticles = db.getNewArticles();

    _.each(subscribers, function (subscriber) {
        var subscriberArticles = _filterArticlesForSubscriber(newArticles, subscriber),
            subscriptionText = '';
        _.each(subscriberArticles, function (article) {
            subscriptionText += 'https://news.ycombinator.com/item?id=' + article.id + '\n';
        });

        console.log('*********START***************');
        console.log(subscriptionText);
        console.log('**********END****************');
    });

    db.markArticlesOld();
});

function _filterArticlesForSubscriber(articles, subscriber) {
    var filteredArticles = [];
    _.each(subscriber.keywords, function (keyword) {
        _.each(articles, function (article) {
            if(article.text.indexOf(keyword) >= 0 && !_.contains(filteredArticles, article)) {
                filteredArticles.push(article);
            }
        });  
    });

    return articles;
}

app.listen(3000);
