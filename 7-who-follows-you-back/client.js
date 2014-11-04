var request = require('request');
request({
    url: 'http://localhost:8080/createGraphFor',
    method: 'POST',
    json: true,
    body: {
        username: 'asenovm',
        depth: 2
    }
}, function (err, data, body) {
    console.log('res is');
    console.dir(err);
    console.dir(body);
});
