var request = require('request'),
    db = require('./db'),
    _ = require('underscore'),
    endPoints = require('./endPoints'),
    TIMEOUT_POLLING = 1200000;

setTimeout(startPolling, 5000);

function startPolling() {
    fetchAndWriteArticles();
    setTimeout(startPolling, TIMEOUT_POLLING);
}

function fetchAndWriteArticles() {
    db.getMaxItem(function (err, maxItem) {
        request.get(endPoints.API_END_POINT_MAX_ITEM, function (err, data, body) {
            var newMaxItem = parseInt(body, 10);
            db.setMaxItem(newMaxItem);
            if(maxItem !== newMaxItem) {
                fetchAndWriteArticleWithId((maxItem + 1) || newMaxItem, newMaxItem, function () {
                    request({
                        url: endPoints.API_END_POINT_NEW_ARTICLES,
                        method: 'POST'
                    });
                });
            }
        });
    });
}

function fetchAndWriteArticleWithId(id, maxId, callback) {
    if(id > maxId) {
        callback();
        return;
    }

    request.get(endPoints.getApiEndPointForArticle(id), function (err, data, body) {
        var article = JSON.parse(body || {})
        if(err || _.isEmpty(article) || article.error) {
            fetchAndWriteArticleWithId(id + 1, maxId, callback);
        } else {
            if(article.type === "story") {
                db.writeArticle(JSON.parse(body), function (err, result) {
                    fetchAndWriteArticleWithId(id + 1, maxId, callback);
                });
            } else if (article.type === "comment") {
                fetchAndWriteComment(article, article, id, maxId, callback);
            }
        }
    });
}

function fetchAndWriteComment(rootComment, currentComment, id, maxId, callback) {
    request(endPoints.getApiEndPointForArticle(currentComment.parent), function (err, data, body) {
        if(err) {
            fetchAndWriteArticleWithId(id + 1, maxId, callback);
        } else {
            var article = JSON.parse(body);
            if(article.type === "story") {
                article.comment = rootComment.text;
                article.commentId = rootComment.id;
                db.writeArticle(article, function (err, result) {
                    fetchAndWriteArticleWithId(id + 1, maxId, callback);
                });
            } else if(article.type === "comment") {
                fetchAndWriteComment(rootComment, article, id, maxId, callback);
            }
        }
    });
}
