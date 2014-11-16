var request = require('request');

exports.testCreateContact = function (test) {
    request({
        url: 'http://localhost:8080/contacts',
        method: 'POST',
        json: true,
        body: {
            phoneNumber: '123456789'
        }
    }, function (res, data, body) {
        test.ok(body._id);
        test.done();
    });
};
