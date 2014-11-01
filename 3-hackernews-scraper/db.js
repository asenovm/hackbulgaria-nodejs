var storage = require('node-persist'),
    _ = require('underscore'),
    KEY_HISTOGRAM_ARTICLE_ID = 'histogram_article_id.json',
    KEY_ARTICLES = 'articles.json',
    KEY_TEXT = 'text.json',
    KEY_SUBSCRIBERS = 'subscribers.json';

storage.initSync();

exports.getText = function () {
    return storage.getItem(KEY_TEXT) || "";
};

exports.writeText = function (text) {
    var currentText = storage.getItem(KEY_TEXT) || "";
    storage.setItem(KEY_TEXT, currentText + text);
    storage.persistSync();
};

exports.getLastFetchedArticleId = function () {
    return storage.getItem(KEY_HISTOGRAM_ARTICLE_ID) || 0;
};

exports.writeLastFetchedArticleId = function (id) {
    storage.setItem(KEY_HISTOGRAM_ARTICLE_ID, id);
};

exports.writeArticle = function (article) {
    var articles = _fetchArticles();
    article.isNew = true;
    articles.data.push(article);
    storage.setItem(KEY_ARTICLES, articles);
    storage.persistSync();
};

exports.setMaxItem = function (maxItem) {
    var articles = _fetchArticles();
    articles.maxItem = maxItem;
    storage.setItem(KEY_ARTICLES, articles);
    storage.persistSync();
};

exports.getMaxItem = function () {
    var articles = _fetchArticles();
    return articles.maxItem;
};

exports.hasSubscriber = function (id) {
    var subscribers = _fetchSubscribers();
    return _.find(subscribers.data, function (subscriber) {
        return subscriber.id === id;
    });
};

exports.confirmSubscriber = function (subscriberId) {
    var subscribers = _fetchSubscribers(),
        confirmedSubscriber = _.find(subscribers.data, function (subscriber) {
            return subscriber.id === subscriberId;
        });

    if(confirmedSubscriber) {
        confirmedSubscriber.isConfirmed = true;
        storage.setItem(KEY_SUBSCRIBERS, subscribers);
    }
};

exports.addSubscriber = function (subscriber) {
    var subscribers = _fetchSubscribers();
    subscribers.data.push(subscriber);
    storage.setItem(KEY_SUBSCRIBERS, subscribers);
};

exports.removeSubscriber = function (id) {
    var subscribers = _fetchSubscribers();
    subscribers.data = _.reject(subscribers.data, function (subscriber) {
        return subscriber.id === id;
    });
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
    _.each(articles.data, function (article) {
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
