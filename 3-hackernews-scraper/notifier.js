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

    console.log('new articles length is ' + newArticles.length);

    _.each(subscribers, function (subscriber) {
        var filteredArticles = _filterArticlesForSubscriber(newArticles, subscriber);
        console.log('filtered articles len is ' + filteredArticles.length);
    });
});

function _filterArticlesForSubscriber(articles, subscriber) {
    var filteredArticles = [];
    _.each(subscriber.keywords, function (keyword) {
        _.each(articles, function (article) {
            if(!article.text) {
                console.log('article without text is');
                console.dir(article);
            }
            if(article.text.indexOf(keyword) >= 0 && !_.contains(filteredArticles, article)) {
                filteredArticles.push(article);
            }
        });  
    });

    return articles;
}

app.listen(3000);
