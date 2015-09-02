'use strict';

var path = require('path');
var NormanTestServer = require('norman-testing-server').server;
var NormanTestRequester = require('norman-testing-server').Requester;
require('norman-server-tp');
var commonServer = require('norman-common-server');
var mongoose;

function ServerContext() {
}

ServerContext.prototype.initialize = function () {
    var self = this;
    var appServer;
    return NormanTestServer.initialize(path.resolve(__dirname, '../config/config.json'))
        .then(function (server) {
            appServer = server;
            return server.initSchema();
        })
        .then(function () {
            return appServer.checkSchema();
        })
        .then(function () {
            return new Promise(function (resolve, reject) {
                self.normanTestRequester = new NormanTestRequester(appServer.app, undefined, undefined,
                    function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            mongoose = commonServer.db.connection.getMongooseConnection({database: 'norman-test-admin-users'});
                            resolve();
                        }
                    });
            });
        });
};

ServerContext.prototype.shutdown = function (done) {
    Promise.invoke(mongoose.db, 'dropDatabase')
        .always(function () {
            return NormanTestServer.shutdown();
        })
        .callback(done);
};

module.exports = ServerContext;
