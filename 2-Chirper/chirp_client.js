var request = require('request'),
    ArgumentParser = require('argparse').ArgumentParser,
    parser = new ArgumentParser(),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('./config.json'));

parser.addArgument(['-r', '--register'], {
    action: 'storeTrue'
});
parser.addArgument(['-u', '--user']);
var args = parser.parseArgs();

if(args.register) {
    request({
        url: config.api_url + '/register',
        json: true,
        method: 'POST',
        body: { user: args.user }
    }, function (err, res) {
        console.log('err is' + err);
        console.dir(res);
    });
}
