var request = require('request'),
    db = require('./db'),
    API_END_POINT_MAX_ITEM = 'https://hacker-news.firebaseio.com/v0/maxitem.json',
    API_END_POINT_NEW_ARTICLES = 'http://localhost:3000/newArticles',
    TIMEOUT_POLLING = 5000;

startPolling();

function startPolling() {
    fetchAndWriteArticles();
    setTimeout(startPolling, TIMEOUT_POLLING);
}

function fetchAndWriteArticles() {
    var maxItem = db.getMaxItem();
    request.get(API_END_POINT_MAX_ITEM, function (err, data, body) {
        var newMaxItem = parseInt(body, 10);
        db.setMaxItem(newMaxItem);
        if(maxItem !== newMaxItem) {
            fetchAndWriteArticleWithId(maxItem || newMaxItem, newMaxItem, function () {
                var articles = db.getNewArticles();
                request({
                    url: API_END_POINT_NEW_ARTICLES,
                    method: 'POST',
                    json: true,
                    body: { articles: articles }
                });
                db.markArticlesOld();
            });
        }
    });
}

function fetchAndWriteArticleWithId(id, maxId, callback) {
    request.get(_getApiEndPointForArticle(id), function (err, data, body) {
        if(!err) {
            db.writeArticle(JSON.parse(body));
        }
        if(id < maxId) {
            fetchAndWriteArticleWithId(id + 1, maxId, callback);
        } else {
            callback();
        }
    });
}

function _getApiEndPointForArticle(id) {
    return 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json'
}
