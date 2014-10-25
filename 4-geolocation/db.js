var MongoClient = require('mongodb').MongoClient,
    DB_URL = "mongodb://localhost:7275/find-it-save-it",
    dbInstance;

MongoClient.connect(DB_URL, function (err, db) {
    dbInstance = db;
    var places = db.collection('places');
    places.ensureIndex({
        'loc': '2dsphere'
    }, function (err, index) {
        if(err) {
            console.log(err);
        }
    });
});

exports.save = function (name, tags, position, callback) {
    var places = dbInstance.collection('places');
    places.insert({ 
        name: name,
        tags: tags,
        loc: { 
            type: 'Point',
            coordinates: [ parseFloat(position.lng, 10), parseFloat(position.lat, 10) ]
        }
    }, callback);
};

exports.find = function (position, range, tags, callback) {
    var places = dbInstance.collection('places');
    places.find({
        loc: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [ parseFloat(position.lng, 10), parseFloat(position.lat, 10) ]
                },
                $minDistance: 0,
                $maxDistance: range * 1000
            }
        },
        tags: {
            $all: tags
        }
    }).toArray(callback);
};
