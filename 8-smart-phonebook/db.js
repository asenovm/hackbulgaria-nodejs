var mongo = require('mongodb'),
    _ = require('underscore'),
    ObjectID = mongo.BSONPure.ObjectID,
    MongoClient = mongo.MongoClient, db,
    COLLECTION_CONTACTS = 'contacts',
    COLLECTION_GROUPS = 'groups';

MongoClient.connect('mongodb://localhost:7275/smart-phonebook', function (err, dbInstance) {
    db = dbInstance;
});

exports.createContact = function (contact, callback) {
    var contacts = db.collection(COLLECTION_CONTACTS);
    contacts.insert(contact, callback);
    updateGroupsForContact(contact);
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

exports.retrieveAllGroups = function (callback) {
    var groups = db.collection(COLLECTION_GROUPS);
    groups.find({}).toArray(callback);
};

function tokenize (str) {
    return _.map(str.split(/\s+/), function (token) {
        return token.toLowerCase();
    });
}
function updateGroupsForContact(contact) {
    var groups = db.collection(COLLECTION_GROUPS),
        contacts = db.collection(COLLECTION_CONTACTS);
    contacts.find({}).toArray(function (err, contacts) {
        var newContactTokens = tokenize(contact.name);
        _.each(contacts, function (oldContact) {
            var currentContactTokens = tokenize(oldContact.name),
                intersection = _.intersection(newContactTokens, currentContactTokens);
            _.each(intersection, function (group) {
                groups.update({ groupName: group }, { $push: { contacts: contact }}, { upsert: true }, function (err, result) {
                    if (err) {
                        console.log('error add group', err);
                    } else {
                        console.log('added / updated group ', result);
                    }
                });
            });
        });
    });
}
