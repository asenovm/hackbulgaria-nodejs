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

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

setTimeout(startPolling, TIMEOUT_POLLING);

function startPolling() {
    fetchAndWriteArticle();
    setTimeout(startPolling, TIMEOUT_POLLING);
}

function fetchAndWriteArticle() {
    db.getLastFetchedArticleId(function (err, lastFetchedArticleId) {
        request.get(endPoints.getApiEndPointForArticle(lastFetchedArticleId + 1), function (err, data, body) {
            var article = JSON.parse(body || {});
            if(!(err || _.isEmpty(article) || article.error)) {
                var text = article.title || article.text || '',
                    tokens = tokenizer.tokenize(text);
                    keywords = {};

                _.each(tokens, function (token) {
                    var regex = new RegExp(token, "g");
                    keywords[token] = text.match(regex).length;
                });

                db.writeKeywords(keywords, function (err, result) {
                    db.writeLastFetchedArticleId(lastFetchedArticleId + 1);
                });
            } else {
                db.writeLastFetchedArticleId(lastFetchedArticleId + 1);
            }
        });
    });
}

app.get('/keywords', function (req, res) {
    var fromPosition = parseInt(req.query.fromPosition, 10) || 0,
        direction = req.query.direction || 'next';

    db.getKeywords(fromPosition, direction, function (err, keywords) {
        res.json(keywords);
        res.end();
    });
});

app.listen(3003);

var static = require('node-static');

var file = new static.Server('app');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8080);
