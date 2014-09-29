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
                token: 'token',
                campaign: {
                    id: 666
                }
            });

            react.getAuthenticatedApplication('key', 'secret', {endpoint: 'http://base.com'}).then(function (service) {
                assert.equal(service.token, 'token');
                assert.equal(service.campaign.id, 666);
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
                error: 'error'
            });

            react.getAuthenticatedApplication('key', 'secret', {endpoint: 'http://base.com'}).then(function (service) {
                throw new Error('should not resolve');
            }, function (err) {
                assert.equal(err.status, 401);
                assert.equal(err.message, 'error');
                api.done();
                done();
            });
        });
    });

    describe('get storeFront', function () {

        var service;

        beforeEach(function () {
            service = new react.ReactCRM('key', 'secret', {endpoint: 'http://base.com', token: 'token', campaign: {id: 666}});
        });

        afterEach(function () {
            nock.cleanAll();
        });

        it('should get the already loaded campaign', function (done) {
            service.getStoreFront().then(function (storefront) {
                assert.equal(storefront.id, 666);
                assert(!storefront.prop);
                done();
            });
        });

        it('should reload the campaign when forcing reload', function (done) {
            var api = nock('http://base.com').get('/campaigns/666').reply(200, {
                id: 666,
                prop: 'new'
            });

            service.getStoreFront(true).then(function (storefront) {
                assert.equal(storefront.id, 666);
                assert.equal(service.campaign.id, 666);
                assert.equal(storefront.prop, 'new');
                assert.equal(service.campaign.prop, 'new');
                api.done();
                done()
            });
        });
    });

    describe('save prospect', function () {
        var service;

        beforeEach(function () {
            service = new react.ReactCRM('key', 'secret', {endpoint: 'http://base.com', token: 'token', campaign: {id: 666}});
        });

        afterEach(function () {
            nock.cleanAll();
        });

        it('should add a prospect', function (done) {
            var prospect = {
                email: 'bob@eponge.com'
            };

            var api = nock('http://base.com').post('/prospects', {
                email: 'bob@eponge.com',
                campaignId: 666
            }).reply(200, {
                email: 'bob@eponge.com',
                id: 999
            });

            service.saveProspect(prospect).then(function (result) {
                assert.equal(result.email, 'bob@eponge.com');
                assert.equal(result.id, 999);
                api.done();
                done();
            });
        });
    });

    describe('getOrder', function () {

        var service;

        afterEach(function () {
            nock.cleanAll();
        });

        beforeEach(function () {
            //already authenticated application
            service = new react.ReactCRM('key', 'secret', {endpoint: 'http://base.com', token: 'token', campaign: 666});
        });

        it('should get an order', function (done) {
            var api = nock('http://base.com')
                .get('/orders/999')
                .reply(200, {id: 13, prop: 'value'});

            service.getOrder(999).then(function (result) {
                api.done();
                assert.equal(result.id, 13);
                assert.equal(result.prop, 'value');
                done();
            });
        });

    });

    describe('add order', function () {
        var service;

        afterEach(function () {
            nock.cleanAll();
        });

        beforeEach(function () {
            //already authenticated application
            service = new react.ReactCRM('key', 'secret', {endpoint: 'http://base.com', token: 'token', campaign: 666});
        });

        it('should create an order', function (done) {
            var api = nock('http://base.com')
                .post('/orders',{transaction_id:243})
                .reply(201, {id: 666, prop: 'value'});

            service.addOrder({transaction_id:243}).then(function (result) {
                assert.equal(result.id,666);
                assert.equal(result.prop,'value');
                api.done();
                done();
            });


        });
    });
});
