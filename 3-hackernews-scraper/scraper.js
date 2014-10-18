var db = require('./db'),
    TIMEOUT_POLLING = 2000;

startPolling();

function startPolling() {
    fetchAndWriteArticles();
    setTimeout(startPolling, TIMEOUT_POLLING);
}

function fetchAndWriteArticles() {
    var maxItem = db.getMaxItem();
    console.log('max item is ' + maxItem);
}
