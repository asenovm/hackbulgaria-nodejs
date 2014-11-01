exports.getApiEndPointForArticle = function (id) {
    return 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json'
};
exports.API_END_POINT_MAX_ITEM = 'https://hacker-news.firebaseio.com/v0/maxitem.json';
exports.API_END_POINT_NEW_ARTICLES = 'http://localhost:3000/newArticles';

