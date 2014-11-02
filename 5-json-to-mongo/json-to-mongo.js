var MongoClient = require('mongodb').MongoClient,
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('config.json')),
    entitiesToImport = JSON.parse(fs.readFileSync(process.argv[2]));

MongoClient.connect(config.mongoConnectionUrl, function (err, db) {
    var collection  = db.collection('entities');
    collection.insert(entitiesToImport, function (err, result) {
        console.log('inserting entities error is ' + err);
        console.log('inserting entities result is ' + result);
    });
});
