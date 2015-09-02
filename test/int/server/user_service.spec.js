'use strict';

var expect = require('norman-testing-tp').chai.expect;
var commonServer = require('norman-common-server');
var registry = commonServer.registry;
require('norman-server-tp');

var userAdminService;
var userService;

var systemContext = {
    ip: '::1',
    user: {
        _id: '0',
        name: 'SYSTEM'
    }
};

describe('UserService Test', function () {
    this.timeout(30000);

    var users = [
        {name: 'user1', principal: 'principal1', email: 'user1@test.com', password: 'Minisap1'},
        {name: 'user2', principal: 'principal2', email: 'user2@test.com', password: 'Minisap2'},
        {name: 'user3', principal: 'principal3', email: 'user3@test.com', password: 'Minisap3'}
    ];

    function dropCollection() {
        var db = commonServer.db.connection.getDb('norman-test-admin-users');
        if (db.collection('users')) {
            return db.dropCollection('users');
        }
        return Promise.resolve(1);
    }

    before('Before - Cleaning users db', function () {
        userAdminService = registry.getModule('userAdmin');
        userService = registry.getModule('UserService');
        dropCollection();
    });

    it('Should scan successfully and not delete nor set roles to an unknown user', function (done) {
        userAdminService.scanDeletedUsers()
            .then(function () {
                return userAdminService.scanGlobalRoleChangeUsers();
            })
            .then(function () {
                // Should fail
                return userAdminService.delete(null);
            })
            .catch(function () {
                // Should fail
                return userAdminService.setRole(null, null);
            })
            .catch(function () {
                done();
            });
    });

    it('Should create users and be able to delete one', function (done) {
        var req = {
            params: {},
            context: systemContext
        };

        var promises = [];
        var i = 0;
        for (; i < users.length; i++) {
            promises.push(userService.createUser(users[i], null, systemContext));
        }

        Promise.all(promises)
            .then(function (data) {
                expect(data.length).to.be.equals(users.length);
                req.params.id = data[0]._id;

                userAdminService.getUsers()
                    .then(function (resUsers) {
                        expect(resUsers.nbUsers).to.be.equals(users.length);
                        expect(resUsers.users.length).to.be.equals(users.length);
                        return userAdminService.setRole(data[0]._id.toString(), 'standard', systemContext);
                    })
                    .then(function () {
                        return userAdminService.delete(req);
                    })
                    .then(function (email) {
                        expect(email).to.be.equals(data[0].email);
                        return userAdminService.listGlobalRoleChange(req);
                    })
                    .then(function () {
                        done();
                    })
                    .catch(function (err) {
                        done(err);
                    });
            })
            .catch(function (err) {
                done(err);
            });
    });
});
