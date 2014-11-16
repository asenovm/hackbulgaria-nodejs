var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient, db;

MongoClient.connect('mongodb://localhost:7275/smart-phonebook', function (err, dbInstance) {
    db = dbInstance;
});

exports.createContact = function (contact, callback) {
    var contacts = db.collection('contacts');
    contacts.insert(contact, callback);
};

exports.deleteContact = function (id) {
    console.log('deleting contact = ', id);
};

exports.retrieveAllContacts = function (callback) {
    var contacts = db.collection('contacts');
    contacts.find({}).toArray(callback);
};

exports.retrieveContact = function (id) {
    console.log('retrieve contact = ', id);
};
