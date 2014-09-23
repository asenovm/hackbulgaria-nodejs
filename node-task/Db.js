'use strict';
var fs = require('fs');
var uuid = require('node-uuid');
var Db = function(key) {
    this.filename = __dirname + '/data/' + key;
}

Db.prototype.initialize = function(done){
    var self = this;
    fs.exists(this.filename, function(exists){
        if(exists){
            done();
        } else {
            fs.writeFile(self.filename, JSON.stringify({
                data: []
            }), done);
        }
    })
};

Db.prototype.addItem = function(item, done){
    var self = this;

    if(typeof item !== 'object') {
        return done('Invalid item');
    }
    if(typeof done !== 'function') {
        return done('Callback not supplied');
    }
    /*
        Get the data, push the new item and writeItems it back.
     */
    this.readItems(function(err, data) {
        if(err){
            return done(err);
        }
        item.id = item.id || uuid.v1(); //use the id supplied by the user or generate a new one.
        if(findById(item.id, data)) {
            return done('Invalid item id. If you supply an id for the item it must be unique.');
        }
        data.push(item);
        self.writeItems(data, function(err) {
            if(err){
                return done(err);
            }
            done(null, item);
        })
    });
};

/**
 * Gets all items in the database. Callbacks with the items.
 * @param done
 */
Db.prototype.getAll = function(done){
    this.readItems(function(err, items){
        done(err, items);
    })
};

/**
 * Gets an item by id. Callbacks with the item or an error if the item wasn't found.
 * @param id
 * @param done
 */
Db.prototype.getById = function(id, done) {
    this.readItems(function(err, data) {
        if(err){
            return done(err);
        }
        var item = findById(id, data);
        if(!item) {
            done('Item not found');
        }
        done(null, item);
    });
};

/**
 * Updates an item by id. Callbacks with the new state of the item or an error if the item wasn't found.
 * @param id
 * @param item - item that will update the existing item. Id is preserved.
 * @param done
 */
Db.prototype.updateById = function(id, updateItem, done){
    var self = this;
    self.getAll(function (err, items) {
        if(err) {
            done(err);
        } else {
            var newItems = [];
            items.forEach(function (item) {
                if(item.id !== id) {
                    newItems.push(items);
                }
            });
            updateItem.id = id;
            if(newItems.length === items.length) {
                done(true);
            } else {
                newItems.push(updateItem);
                self.writeItems(newItems, function (err) {
                    done(err, updateItem);
                });
            }
        }
    });
};

/**
 * Deletes an item by id. Callbacks with the item that was deleted or an error if it wasn't found.
 * @param id
 * @param done
 */
Db.prototype.deleteById = function(id, done){
    var self = this;
    self.getAll(function (err, items) {
        if(err) {
            done(err);
        } else {
            var newItems = [],
                deletedItem;

            items.forEach(function (item) {
                if(item.id === id) {
                    deletedItem = item;
                } else {
                    newItems.push(item);
                }
            });

            self.writeItems(newItems, function (err) {
                err = err || !deletedItem;
                done(err, deletedItem);
            });
        }
    });
};

/**
 * Deletes all items in the database. Callbacks with the count of the items that were deleted.
 * @param done - done(err, count)
 */
Db.prototype.deleteAll = function(done){
    var self = this;
    self.getAll(function (err, items) {
        if(err) {
            done(err);
        } else {
            self.clear(function (err) {
                done(err, items.length);
            });
        }
    });
};

/**
 * Writes the items array to the database.
 * @param items
 * @param done
 */
Db.prototype.writeItems = function(items, done) {
    fs.writeFile(this.filename, JSON.stringify({
        data: items
    }), {
        flag: 'w+'
    }, done);
}

/**
 * Reads the data array from the database.
 * @param done
 */
Db.prototype.readItems = function(done) {
    var self = this;
    var options = {
        encoding: 'utf-8'
    };
    fs.readFile(this.filename, options, function(err, data){
        if(err){
            return done(err);
        }
        try {
            var json = JSON.parse(data);
        } catch(e) {
            return done('Invalid json data in file '+ self.filename + '. Error:' + e);
        }

        done(null, json.data);
    });
}

Db.prototype.clear = function(done){
    fs.writeFile(this.filename, JSON.stringify({
        data: []
    }), {
        flag: 'w+'
    }, done);
}

/**
 * Returns the item from the data array (if found) that has the specified id. Returns null if the item is not found.
 * @param id - id of the item to find
 * @param data - array that contains items with ids to go through.
 * @returns {*}
 */
var findById = function(id, data) {
    for(var i = 0;i < data.length;i++){
        if(data[i].id === id){
            return data[i];
        }
    }
    return null;
};

module.exports = Db;
