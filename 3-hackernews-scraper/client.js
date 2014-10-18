var request = require('request');
request({
    method: 'POST',
    url: 'http://localhost:3001/subscribe',
    json: true,
    body: {
        email: 'asenov.m@gmail.com',
        keywords: [
            "linux",
            "coffee"
        ],
        type: ['story']
    }
}, function (err, res, body) {
    console.log('err is');
    console.dir(err);
    console.log('body is');
    console.dir(body);
});
