var request = require('request');

exports.testCreateContact = function (test) {
    request({
        url: 'http://localhost:8080/contacts',
        method: 'POST',
        json: true,
        body: {
            phoneNumber: '123456789',
            name: 'Martin Asenov'
        }
    }, function (res, data, body) {
        test.ok(body._id);
        test.done();
    });
};

exports.testRetrieveAllContacts = function (test) {
    request({
        url: 'http://localhost:8080/contacts',
        method: 'GET',
        json: true
    }, function (res, data, body) {
        test.ok(body.length > 0);
        test.done();
    });
};

exports.testRetrieveContact = function (test) {
    request({
        url: 'http://localhost:8080/contacts',
        method: 'GET',
        json: true
    }, function (res, data, body) {
        var contact = body[0];
        request({
            url: 'http://localhost:8080/contacts/' + contact._id,
            method: 'GET',
            json: true
        }, function (res, data, body) {
            test.ok(body._id);
            test.done();
        });
    });
};

exports.testDeleteContact = function (test) {
    request({
        url: 'http://localhost:8080/contacts',
        method: 'GET',
        json: true
    }, function (res, data, body) {
        var contact = body[0];
        request({
            url: 'http://localhost:8080/contacts/' + contact._id,
            method: 'DELETE',
            json: true
        }, function (res, data, body) {
            test.ok(body.deleted >= 1);
            test.done();
        });
    });
}
