var storage = require('node-persist'),
    KEY_ARTICLES = 'articles.json';

storage.initSync();

exports.writeArticle = function (article) {
    var articles = _fetchArticles();
    articles.data.push(article);
    storage.setItem(KEY_ARTICLES, articles);
};

exports.setMaxItem = function (maxItem) {
    var articles = _fetchArticles();
    articles.maxItem = maxItem;
    storage.setItem(KEY_ARTICLES, articles);
};

exports.getMaxItem = function () {
    var articles = _fetchArticles();
    return articles.maxItem;
}

function _fetchArticles() {
    return storage.getItem(KEY_ARTICLES) || { data: [] };
}
