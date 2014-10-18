var fileToParse = process.argv[2],
    isRemote = !fileToParse.indexOf('http') || !fileToParse.indexOf('https'),
    jsonToIni = fileToParse.indexOf('.json') >= 0,
    fs = require('fs'),
    request = require('request'),
    _ = require('underscore');

if(isRemote) {
    request.get(fileToParse, function (error, response, body) {
        parseAndWriteData(body);
    });
} else {
    fs.readFile(fileToParse, function (err, data) {
        parseAndWriteData(data);
    });
}

function parseAndWriteData(data) {
    if(jsonToIni) {
        parseAndWriteJsonToIni(data);
    } else {
        parseAndWriteIniToJson(data);
    }
}

function parseAndWriteJsonToIni(data) {
    var json = JSON.parse(data),
        result = '';

    _.each(json, function (section, header) {
        result += '\n[' + header + ']\n';
        _.each(section, function (value, key) {
            result += key + '=' + value + '\n'
        });
    });

    writeFile(result, ".json", ".ini");
}

function parseAndWriteIniToJson(data) {
    var fileContents = data.toString(),
        lines = _.filter(_.compact(fileContents.split(/\n/)), function (line) {
            return !/^;.*$/.test(line);
        }),
        result = {},
        currentEntity = {},
        currentEntityKey;
    
    _.each(lines, function (line) {
        if(/\[.*\]/.test(line)) {
            if(currentEntityKey) {
                result[currentEntityKey] = currentEntity;
            }
            currentEntity = {};
            currentEntityKey = line.replace(/\[/g, '').replace(/\]/g, '');
        } else {
            var lineEntities = line.split(/=/),
                key = lineEntities[0].replace(/^\s+/, '').replace(/\s+$/, ''),
                value = lineEntities[1].replace(/^\s+/, '').replace(/\s+$/, '');

            currentEntity[key] = value;
        }
    });

    if(currentEntityKey) {
        result[currentEntityKey] = currentEntity;
    }

    writeFile(JSON.stringify(result, null, 4), ".ini", ".json");
}

function writeFile(data, replaceFrom, replaceTo) {
    var fileName = isRemote ? fileToParse.substring(fileToParse.lastIndexOf('/') + 1) : fileToParse
    fs.writeFileSync(fileName.replace(replaceFrom, replaceTo), data);
}

