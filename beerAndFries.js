var _ = require('underscore');

exports.beerAndFries = function (items) {
    var beers = _.filter(items, function (item) {
        return item.type === "beer";
    }), fries = _.filter(items, function (item) {
        return item.type === "fries";
    });

    beers = _.sortBy(beers, function (beer) {
        return beer.score;
    });

    fries = _.sortBy(fries, function (fries) {
        return fries.score;
    });

    return _.reduce(beers, function (memo, current, index) {
        return memo + current.score * fries[index].score;
    }, 0);
};
