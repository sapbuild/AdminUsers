'use strict';

var TEST_TIMEOUT = 30000;

var commonServer = require('norman-common-server');
var ServerContext = require('../api/ServerContext');
var serverContext = new ServerContext();
var logger = commonServer.logging.createLogger('test.admin.users');

describe('Auth Services', function () {
    if ((this.timeout() > 0) && (this.timeout() < TEST_TIMEOUT)) {
        this.timeout(TEST_TIMEOUT);
    }

    before('Initialize server', function (done) {
        serverContext.initialize()
            .then(function () {
                logger.debug('API initialized.');
                done();
            })
            .catch(function (err) {
                logger.error(err, 'Failed to initialize server requester');
                done(err);
            });
    });

    after('Drop DB', function (done) {
        logger.debug('Shutdown server ...');
        serverContext.shutdown(done);
    });

    // Load tests
    require('./access_service.spec.js');
    require('./user_service.spec.js');
});
