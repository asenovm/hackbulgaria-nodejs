var http = require('http'),
    node_uuid = require('node-uuid'),
    chirps = [],
    users = [];

function requestHandler(req, res) {
    if(req.method === 'GET') {
        if (req.url === '/all_chirps') {
            retrieveAllChirps(res);
        } else if (req.url === '/my_chirps') {
            retrieveMyChirps(res);
        }
    } else if(req.method === 'POST') {
        if(req.url === '/chirp') {
            createChirp(req, res);
        } else if(req.url === '/register') {
            registerUser(req, res);
        }
    } else if(req.method === 'DELETE' && req.url === '/chirp') {
        deleteChirp(req, res);
    }
}

function deleteChirp(req, res) {
    console.log('delete chirp is called');
}

function registerUser(req, res) {
    var postData = '';

    req.on('data', function (chunk) {
        postData += chunk;
    });
    
    req.on('end', function () {
        var user = JSON.parse(postData);
        user.key = createUniqueId();
        sendSuccessResponse(res);
        res.end(JSON.stringify(user));
    });
}

function createUniqueId() {
    return node_uuid.v4();
}

function createChirp(req, res) {
    console.log('create chirp is called!');
}

function retrieveMyChirps(res) {
    sendSuccessResponse(res);
    res.end(JSON.stringify(chirps));
}

function retrieveAllChirps(res) {
    sendSuccessResponse(res);
    res.end(JSON.stringify(chirps));
}

function sendSuccessResponse(res) {
    res.writeHead(200, 'OK', {
        'Content-Type': 'application/json'
    });
}

var server = http.createServer(requestHandler);
server.listen(8080);
