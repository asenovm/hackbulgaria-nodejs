var storage = require('node-persist'),
    _ = require('underscore'),
    KEY_ARTICLES = 'articles.json',
    KEY_SUBSCRIBERS = 'subscribers.json';

storage.initSync();

exports.writeArticle = function (article) {
    var articles = _fetchArticles();
    article.isNew = true;
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
};

exports.confirmSubscriber = function (subscriberId) {
    var subscribers = _fetchSubscribers(),
        confirmedSubscriber = _.find(subscribers, function (subscriber) {
            subscriber.id === subscriberId;
        });
    confirmedSubscriber.confirmed = true;
    storage.setItem(KEY_SUBSCRIBERS, subscribers);
};

exports.addSubscriber = function (subscriber) {
    var subscribers = _fetchSubscribers();
    subscribers.data.push(subscriber);
    storage.setItem(KEY_SUBSCRIBERS, subscribers);
};

exports.getSubscribers = function () {
    var subscribers = _fetchSubscribers();
    return subscribers.data;
};

exports.getNewArticles = function () {
    var articles = _fetchArticles();
    return _.filter(articles.data, function (article) {
        return article.isNew;
    });
};

exports.markArticlesOld = function () {
    var articles = _fetchArticles();
    _.each(articles, function (article) {
        article.isNew = false;
    });
    storage.setItem(KEY_ARTICLES, articles);
};

function _fetchArticles() {
    return storage.getItem(KEY_ARTICLES) || { data: [] };
}

function _fetchSubscribers() {
    return storage.getItem(KEY_SUBSCRIBERS) || { data: [] };
}
