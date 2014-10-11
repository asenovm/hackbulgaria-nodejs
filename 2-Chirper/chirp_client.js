var request = require('request'),
    ArgumentParser = require('argparse').ArgumentParser,
    parser = new ArgumentParser(),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('./config.json'));

parser.addArgument(['-r', '--register'], {
    action: 'storeTrue'
});
parser.addArgument(['-u', '--user']);
parser.addArgument(['-c', '--create'], {
    action: 'storeTrue'
});
parser.addArgument(['-m', '--message']);
parser.addArgument(['-g', '--getall'], {
    action: 'storeTrue'
});
parser.addArgument(['-d', '--delete'], {
    action: 'storeTrue'
});
parser.addArgument(['-cid', '--chirpid']);
parser.addArgument(['-gs', '--getself'], {
    action: 'storeTrue'
});

var args = parser.parseArgs();

if(args.register) {
    request({
        url: config.api_url + '/register',
        json: true,
        method: 'POST',
        body: { user: args.user }
    }, function (err, res) {
        config.user = res.body.user,
        config.key = res.body.key;
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
    });
} else if(args.getall) {
    request({
        url: config.api_url + '/all_chirps',
        json: true,
        method: 'GET'
    }, function (err, res) {
        console.log('get all err is ' + err);
        console.dir(res.body);
    });
} else if(args.create) {
    request({
        url: config.api_url + '/chirp',
        json: true,
        method: 'POST',
        body: { user: config.user, key: config.key, chirpText: args.message }
    }, function (err, res) {
        console.log('create err is ' + err);
        console.dir(res.body);
    });
} else if(args.delete) {
    request({
        url: config.api_url + '/chirp',
        json: true,
        method: 'DELETE',
        body: { key: config.key, chirpId: args.chirpid }
    }, function (err, res) {
        console.log('create err is ' + err);
        console.dir(res.body);
    });
} else if(args.getself) {
    request({
        url: config.api_url + '/my_chirps?key=' + config.key,
        json: true,
        method: 'GET'
    }, function (err, res) {
        console.log('get all err is ' + err);
        console.dir(res.body);
    });
}
