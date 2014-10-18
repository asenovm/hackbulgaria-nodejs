var storage = require('node-persist'),
    _ = require('underscore'),
    KEY_ARTICLES = 'articles.json',
    KEY_SUBSCRIBERS = 'subscribers.json';

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
};

exports.confirmSubscriber = function (subscriberId) {
    var subscribers = _fetchSubscribers(),
        confirmedSubscriber = _.find(subscribers, function (subscriber) {
            subscriber.id === subscriberId;
        });
    confirmedSubscriber.confirmed = true;
};

exports.addSubsriber = function (subscriber) {
    var subscribers = _fetchSubscribers();
    subscribers.data.push(subscriber);
};

exports.getSubscribers = function () {
    var subscribers = _fetchSubscribers();
    return subscribers.data;
};

exports.getNewArticles = function () {
    var articles = _fetchArticles();
    return _.filter(artices, function (article) {
        return article.isNew;
    });
};

function _fetchArticles() {
    return storage.getItem(KEY_ARTICLES) || { data: [] };
}

function _fetchSubscribers() {
    return storage.getItem(KEY_SUBSCRIBERS) || { data: [] };
}
