var mongo = require('mongodb'),
    ObjectID = mongo.BSONPure.ObjectID,
    MongoClient = mongo.MongoClient, db,
    COLLECTION_CONTACTS = 'contacts';

MongoClient.connect('mongodb://localhost:7275/smart-phonebook', function (err, dbInstance) {
    db = dbInstance;
});

exports.createContact = function (contact, callback) {
    var contacts = db.collection(COLLECTION_CONTACTS);
    contacts.insert(contact, callback);
};

exports.deleteContact = function (id, callback) {
    var contacts = db.collection(COLLECTION_CONTACTS);
    contacts.remove({ _id: new ObjectID(id) }, callback);
};

exports.retrieveAllContacts = function (callback) {
    var contacts = db.collection(COLLECTION_CONTACTS);
    contacts.find({}).toArray(callback);
};

exports.retrieveContact = function (id, callback) {
    var contacts = db.collection(COLLECTION_CONTACTS);
    contacts.findOne({ _id: new ObjectID(id) }, callback);
};
