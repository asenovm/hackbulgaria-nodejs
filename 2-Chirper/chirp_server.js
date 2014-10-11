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
    readPayload(req, function (payload) {
        var chirp = JSON.parse(payload),
            id = chirp.chirpid,
            key = chirp.key;
    });
}

function registerUser(req, res) {
    readPayload(req, function (payload) {
        var user = JSON.parse(payload);
        user.key = createUniqueId();
        sendSuccessResponse(res);
        res.end(JSON.stringify(user));
    });
}

function createUniqueId() {
    return node_uuid.v4();
}

function readPayload(req, callback) {
    var payload = '';

    req.on('data', function (chunk) {
        payload += chunk;
    });
    
    req.on('end', function () {
        callback(payload);
    });
}

function createChirp(req, res) {
    readPayload(req, function (payload) {
        var chirp = JSON.parse(payload);
        chirp.id = createUniqueId();

        chirps.push(chirp);

        sendSuccessResponse(res);
        res.end(JSON.stringify(chirp));
    });
}

function retrieveMyChirps(res) {
    sendSuccessResponse(res);
    res.end(JSON.stringify(chirps));
}

function retrieveAllChirps(res) {
    console.log('retrieve all chirps is called!');
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
