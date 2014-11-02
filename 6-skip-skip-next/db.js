var MongoClient = require('mongodb').MongoClient,
    _ = require('underscore'),
    DB_URL = 'mongodb://localhost:7275/hackernews-scraper',
    KEY_HISTOGRAM_ARTICLE_ID = 'histogram_article_id',
    KEY_ARTICLES = 'articles',
    KEY_TEXT = 'text',
    KEY_SUBSCRIBERS = 'subscribers',
    KEY_MAX_ITEM = "maxItem",
    KEY_KEYWORDS = 'keywords',
    dbInstance;

MongoClient.connect(DB_URL, function (err, db) {
    console.log('connected!');
    dbInstance = db;
});

function errorHandlingCallback(err, result) {
    if(err) {
        console.error(err);
    }
}

exports.writeKeywords = function (keywords, callback) {
    var collection = dbInstance.collection(KEY_KEYWORDS);
    _.each(keywords, function (value, key) {
        collection.update({ keyword: key }, { $inc: { count: value }}, { upsert: true }, callback);
    });
};

exports.getKeywords = function (fromPosition, direction, callback) {
    var collection = dbInstance.collection(KEY_KEYWORDS),
        offset = direction === 'prev' ? - 20 : 0,
        skipCount = Math.max(0, fromPosition + offset);
    
    collection.find().sort({ count :  -1 }).skip(skipCount).limit(10).toArray(function (err, result) {
        if(result) {
            callback(err, _.map(result, function (keyword, index) {
                keyword.rank = skipCount + index + 1;
                return keyword;
            }));
        } else {
            callback(err, result);
        }
    });
};

exports.getLastFetchedArticleId = function (callback) {
    dbInstance.collection(KEY_HISTOGRAM_ARTICLE_ID).findOne({}, function (err, result) {
        callback(err, (result && result.id) || 1);
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
    dbInstance.collection(KEY_SUBSCRIBERS).update({ id: subscriberId }, { $set: { isConfirmed: true }}, errorHandlingCallback);
};

exports.addSubscriber = function (subscriber) {
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
