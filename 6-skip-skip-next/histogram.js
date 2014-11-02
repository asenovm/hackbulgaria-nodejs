//TODO reuse some logic from the scraper
var request = require('request'),
    _ = require('underscore'),
    endPoints = require('./endPoints'),
    db = require('./db'),
    TIMEOUT_POLLING = 5000,
    express = require('express'),
    natural = require('natural'),
    tokenizer = new natural.WordTokenizer(),
    app = express();

startPolling();

function startPolling() {
    fetchAndWriteArticle();
    setTimeout(startPolling, TIMEOUT_POLLING);
}

function fetchAndWriteArticle() {
    db.getLastFetchedArticleId(function (err, lastFetchedArticleId) {
        request.get(endPoints.getApiEndPointForArticle(lastFetchedArticleId + 1), function (err, data, body) {
            var article = JSON.parse(body || {});
            if(!(err || _.isEmpty(article) || article.error)) {
                db.writeText(" " + (article.title || article.text || "") + " ");
            }
            db.writeLastFetchedArticleId(lastFetchedArticleId + 1);
        });
    });
}

app.get('/keywords', function (req, res) {
    var text = db.getText(),
        tokens = tokenizer.tokenize(text),
        counts = {};

    _.each(tokens, function (token) {
        var regex = new RegExp(token, "g");
        counts[token] = text.match(regex).length;
    });

    res.json(counts);
    res.end();
});

app.listen(3003);
