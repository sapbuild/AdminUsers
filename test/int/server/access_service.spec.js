'use strict';

var commonServer = require('norman-common-server');
var registry = commonServer.registry;
require('norman-server-tp');

var accessAdminService;

var systemContext = {
    ip: '::1',
    user: {
        _id: '0',
        name: 'SYSTEM'
    }
};

describe('AccessService Test', function () {
    this.timeout(30000);

    function dropCollection() {
        var db = commonServer.db.connection.getDb('norman-test-admin-users');
        if (db.collection('users')) {
            return db.dropCollection('users');
        }
        return Promise.resolve(1);
    }

    before('Before - Cleaning users db', function () {
        accessAdminService = registry.getModule('accessAdmin');
        dropCollection();
    });

    it('Should set and delete a security policy', function (done) {
        var policy = {
            Domain: '@sap.com',
            studyInvitation: false,
            selfRegistration: false,
            isNew: true,
            accessLevel: 1,
            isDefault: true,
            cachedNewRow: false
        };

        accessAdminService.getSecurityPolicies()
            .then(function () {
                return accessAdminService.setSecurityPolicy(policy, systemContext);
            })
            .then(function () {
                return accessAdminService.deleteSecurityPolicy({params: { domain: policy.Domain}}, systemContext);
            })
            .callback(done);
    });
});
