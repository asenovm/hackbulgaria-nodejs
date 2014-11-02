var MongoClient = require('mongodb').MongoClient,
    _ = require('underscore'),
    DB_URL = 'mongodb://localhost:7275/hackernews-scraper',
    KEY_HISTOGRAM_ARTICLE_ID = 'histogram_article_id',
    KEY_ARTICLES = 'articles',
    KEY_TEXT = 'text',
    KEY_SUBSCRIBERS = 'subscribers',
    KEY_MAX_ITEM = "maxItem",
    dbInstance;

MongoClient.connect(DB_URL, function (err, db) {
    console.log('connected!');
    dbInstance = db;
});

function errorHandlingCallback(err, result) {
    if(err) {
        console.error(err);
    }
    console.dir(result);
}

exports.getText = function (callback) {
    dbInstance.collection(KEY_TEXT).find({}).toArray(callback);
};

exports.writeText = function (text) {
    var textCollection = dbInstance.collection(KEY_TEXT);
    textCollection.findOne({}, function (err, result) {
        textCollection.update({}, { $set: { text: (result || '') + text }}, { upsert: true }, errorHandlingCallback);
    });
};

exports.getLastFetchedArticleId = function (callback) {
    dbInstance.collection(KEY_HISTOGRAM_ARTICLE_ID).findOne({}, function (err, result) {
        callback(err, result.id || 0);
    });
};

exports.writeLastFetchedArticleId = function (id) {
    dbInstance.collection(KEY_HISTOGRAM_ARTICLE_ID).update({}, { $set: { id: id }}, { upsert: true }, errorHandlingCallback);
};

exports.writeArticle = function (article, callback) {
    article.isNew = true;
    dbInstance.collection(KEY_ARTICLES).insert(article, callback);
};

exports.setMaxItem = function (maxItem) {
    dbInstance.collection(KEY_MAX_ITEM).update({}, { $set: { maxItem: maxItem }}, { upsert: true }, errorHandlingCallback);
};

exports.getMaxItem = function (callback) {
    dbInstance.collection(KEY_MAX_ITEM).findOne({}, function (err, result) {
        callback(err, result && result.maxItem);
    });
};

exports.getSubscriber = function (id, callback) {
    dbInstance.collection(KEY_SUBSCRIBERS).findOne({ id : id }, callback);
};

exports.confirmSubscriber = function (subscriberId) {
    console.log('confirm!');
    dbInstance.collection(KEY_SUBSCRIBERS).update({ id: subscriberId }, { $set: { isConfirmed: true }}, errorHandlingCallback);
};

exports.addSubscriber = function (subscriber) {
    console.log('add subscriber with ');
    console.dir(subscriber);
    dbInstance.collection(KEY_SUBSCRIBERS).insert(subscriber, errorHandlingCallback);
};

exports.removeSubscriber = function (id) {
    dbInstance.collection(KEY_SUBSCRIBERS).remove({ id: id }, errorHandlingCallback);
};

exports.getSubscribers = function (callback) {
    dbInstance.collection(KEY_SUBSCRIBERS).find({}).toArray(callback);
};

exports.getNewArticles = function (callback) {
    dbInstance.collection(KEY_ARTICLES).find({ isNew: true }).toArray(callback);
};

exports.markArticlesOld = function () {
    dbInstance.collection(KEY_ARTICLES).update({ isNew: true }, { $set: { isNew: false }}, errorHandlingCallback);
};
