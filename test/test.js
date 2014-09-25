var react = require('../index.js');
var nock = require('nock');
var assert = require('assert');

describe('ReactCRM', function () {

    describe('authentication', function () {

        afterEach(function () {
            nock.cleanAll();
        });

        it('should return an authenticated service', function (done) {
            var api = nock('http://base.com').post('/authenticateApplication', {
                apiKey: 'key',
                apiSecret: 'secret'
            }).reply(200, {
                token: 'token'
            });

            react.getAuthenticatedApplication('key', 'secret', {endpoint: 'http://base.com'}).then(function (service) {
                assert.equal(service.token, 'token');
                assert(service instanceof react.ReactCRM);
                api.done();
                done();
            });
        });

        it('should reject the promise as the application could not be authenticated', function (done) {
            var api = nock('http://base.com').post('/authenticateApplication', {
                apiKey: 'key',
                apiSecret: 'secret'
            }).reply(401, {
                message: 'error'
            });

            react.getAuthenticatedApplication('key', 'secret', {endpoint: 'http://base.com'}).then(function (service) {
                throw new Error('should not resolve');
            }, function (err) {
                assert.equal(err.message, 'http request was not successful');
                api.done();
                done();
            });
        });
    });
});
