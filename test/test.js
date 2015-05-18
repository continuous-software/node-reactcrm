var buildResoure = require('../lib/resourceBuilder.js');
var assert = require('assert');
var nock = require('nock');
var proxy = require('../lib/proxyFunction.js');
var authenticationProxy = require('../lib/authenticationProxy.js');
var react = require('../index.js');
var schema = require('../lib/schema.js');
var cent42 = require('42-cent');
var gwMock = require('./mocks/gateway.js');
var Promise = require('bluebird');

describe('ReactCRM', function () {

  beforeEach(function () {
    schema.links[0].href = 'http://base.com';
  });

  describe('get storeFront', function () {

    var service;

    beforeEach(function (done) {

      nock('http://base.com')
        .post('/authenticateApplication', {apiKey: 'key', apiSecret: 'secret'})
        .reply(200, {
          token: 'token',
          campaign: {id: 666}
        });

      react.getAuthenticatedApplication('key', 'secret', {schema: schema})
        .then(function (serv) {
          service = serv;
          done();
        });
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
        done();
      });
    });
  });

  describe('save prospect', function () {
    var service;

    beforeEach(function (done) {

      nock('http://base.com')
        .post('/authenticateApplication', {apiKey: 'key', apiSecret: 'secret'})
        .reply(200, {
          token: 'token',
          campaign: {id: 666}
        });

      react.getAuthenticatedApplication('key', 'secret', {schema: schema})
        .then(function (serv) {
          service = serv;
          done();
        });
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

    beforeEach(function (done) {

      nock('http://base.com')
        .post('/authenticateApplication', {apiKey: 'key', apiSecret: 'secret'})
        .reply(200, {
          token: 'token',
          campaign: {id: 666}
        });

      react.getAuthenticatedApplication('key', 'secret', {schema: schema})
        .then(function (serv) {
          service = serv;
          done();
        });
    });

    afterEach(function () {
      nock.cleanAll();
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

    beforeEach(function (done) {

      nock('http://base.com')
        .post('/authenticateApplication', {apiKey: 'key', apiSecret: 'secret'})
        .reply(200, {
          token: 'token',
          campaign: {id: 666}
        });

      react.getAuthenticatedApplication('key', 'secret', {schema: schema})
        .then(function (serv) {
          service = serv;
          done();
        });
    });

    afterEach(function () {
      nock.cleanAll();
    });

    it('should create an order', function (done) {
      var api = nock('http://base.com')
        .post('/orders', {transaction_id: 243, campaign_id: 666})
        .reply(201, {id: 666, prop: 'value'});

      service.addOrder({transaction_id: 243}).then(function (result) {
        assert.equal(result.id, 666);
        assert.equal(result.prop, 'value');
        api.done();
        done();
      });
    });
  });

  describe('create subscription', function () {

    var service;

    beforeEach(function (done) {

      nock('http://base.com')
        .post('/authenticateApplication', {apiKey: 'key', apiSecret: 'secret'})
        .reply(200, {
          token: 'token',
          campaign: {id: 666}
        });

      react.getAuthenticatedApplication('key', 'secret', {schema: schema, oxrAppId: 'test'})
        .then(function (serv) {
          service = serv;
          cent42.registerGateway('dummy', gwMock.factory);
          done();
        });
    });

    afterEach(function () {
      nock.cleanAll();
    });

    it('should add a subscription', function (done) {

      var gatewayResponse = {transactionId: 999};
      var gatewayMock = new gwMock.GatewayMock();
      cent42.registerGateway('test', function () {
        return gatewayMock;
      });

      gatewayMock.createCustomerProfile = function (creditCard, billing, shipping) {
        this.createCustomerProfileArgs = arguments;
        return Promise.resolve({profileId: 'token'});
      };

      gatewayMock.chargeCustomer = function (order, customer) {
        this.chargeCustomerProfileArgs = arguments;
        return Promise.resolve(gatewayResponse);
      };

      var bank = {
        id: 666,
        type: 'test',
        configuration: {
          USER: 'bob',
          PASSWORD: 'LEPONGE'
        },
        cent42:'test'
      };

      var prospect = {
        id: 6666,
        firstname: 'bob',
        lastname: 'leponge',
        email: 'bobleponge@example.com',
        billing: {
          address: '4, rue de leponge',
          city: 'underwater',
          country: 'groland',
          state: 'somewhere'
        },
        shipping: {
          address: '4, rue de leponge',
          city: 'underwater',
          country: 'groland',
          state: 'somewhere'
        },
        source: {
          referer: 'bob',
          ip_address: 'http://127.0.0.1'
        }
      };

      var creditCard = {
        expiration: '12/17',
        cvv: '123',
        number: '41111 1111 1111 1111'
      };

      var offer = {
        id: 777,
        recurringPlan: {
          amount: 99.9
        },
        shippingOfferId: 'blah'
      };

      var subscriptionNock = nock('http://base.com')
        .post('/subscriptions', {refTransactionId: 999})
        .reply(201, {id: 111});


      var orderNock = nock('http://base.com')
        .post('/orders')
        .reply(201, {id: 999});

      service.processSubscription(bank, offer, creditCard, prospect)
        .then(function (result) {
          assert.equal(result.id, 999);
          subscriptionNock.done();
          orderNock.done();
          done();
        });
    });

    it('should set the reference transaction as failed is the first transaction fails', function (done) {
      var gatewayResponse = {message: 'some error'};
      var gatewayMock = new gwMock.GatewayMock();
      cent42.registerGateway('test', function () {
        return gatewayMock;
      });

      gatewayMock.createCustomerProfile = function (creditCard, billing, shipping) {
        this.createCustomerProfileArgs = arguments;
        return Promise.resolve({profileId: 'token'});
      };

      gatewayMock.chargeCustomer = function (order, customer) {
        this.chargeCustomerProfileArgs = arguments;
        return Promise.reject(gatewayResponse);
      };

      var bank = {
        id: 666,
        type: 'test',
        configuration: {
          USER: 'bob',
          PASSWORD: 'LEPONGE'
        },
        cent42:'test'
      };

      var prospect = {
        id: 6666,
        firstname: 'bob',
        lastname: 'leponge',
        email: 'bobleponge@example.com',
        billing: {
          address: '4, rue de leponge',
          city: 'underwater',
          country: 'groland',
          state: 'somewhere'
        },
        shipping: {
          address: '4, rue de leponge',
          city: 'underwater',
          country: 'groland',
          state: 'somewhere'
        },
        source: {
          referer: 'bob',
          ip_address: 'http://127.0.0.1'
        }
      };

      var creditCard = {
        expiration: '12/17',
        cvv: '123',
        number: '4111 1111 1111 1111'
      };

      var offer = {
        id: 777,
        recurringPlan: {
          amount: 99.9
        }
      };

      var subscriptionNock = nock('http://base.com')
        .post('/subscriptions', {refTransactionId: 999})
        .reply(201, {id: 111});

      var orderNock = nock('http://base.com')
        .post('/orders')
        .reply(201, {id: 999});

      service.processSubscription(bank, offer, creditCard, prospect)
        .then(function (result) {
          assert.equal(result.id, 999);
          subscriptionNock.done();
          orderNock.done();
          done();
        });

    });
  });

  describe('process order', function () {

    var service;

    beforeEach(function (done) {

      nock('http://base.com')
        .post('/authenticateApplication', {apiKey: 'key', apiSecret: 'secret'})
        .reply(200, {
          token: 'token',
          campaign: {id: 666}
        });

      react.getAuthenticatedApplication('key', 'secret', {schema: schema, oxrAppId: 'test'})
        .then(function (serv) {
          service = serv;
          cent42.registerGateway('dummy', gwMock.factory);
          done();
        });
    });

    afterEach(function () {
      nock.cleanAll();
    });

    it('should process the payment and save the order reference', function (done) {

      var processor = {
        id: 666,
        cent42:'test',
        configuration:{
          USER:'blah',
          PASSWORD:'test'
        },
        type: 'dummy'
      };
      var offer = {
        id: 111,
        amount: 199,
        currency: 'EUR'
      };
      var creditCard = {
        number: '0000 0000 0000 0000',
        expiration: '11 / 17'
      };
      var prospect = {
        id: 6666,
        source: {
          referer: 'bob',
          ip_address: 'http://127.0.0.1'
        }
      };
      var body = {
        'disclaimer': 'Exchange rates provided by [...]',
        'license': 'Data collected and blended [...]',
        'timestamp': Date.now(),
        'base': 'USD',
        'rates': {
          'EUR': 0.92
        }
      };
      var openxr = nock('https://openexchangerates.org')
        .get('/api/latest.json?app_id=' + service.oxrAppId)
        .reply(200, body);
      var api = nock('http://base.com')
        .post('/orders')
        .reply(201, {newOrder: 'blah'});

      gwMock.GatewayMock.resolveWith({transactionId: 111});

      service.processOrder(processor, offer, creditCard, prospect).then(function (result) {
        api.done();
        openxr.done();
        assert.equal(result.newOrder, 'blah');
        done();
      }, function (err) {
        console.log(err);
      });
    });

    it('should still resolve the promise when gateway throws an exception', function (done) {
      var processor = {
        id: 666,
        configuration:{
          USER:'blah',
          PASSWORD:'test'
        },
        cent42:'test',
        type: 'dummy'
      };
      var offer = {
        id: 111,
        amount: 199,
        currency: 'EUR'
      };
      var creditCard = {
        number: '0000 0000 0000 0000',
        expiration: '12 / 17'
      };
      var prospect = {
        id: 6666,
        source: {
          referer: 'bob',
          ip_address: 'http://127.0.0.1'
        }
      };
      //todo better check on body content
      var api = nock('http://base.com')
        .post('/orders')
        .reply(201, {billing_status: 'failed'});

      var body = {
        'disclaimer': 'Exchange rates provided by [...]',
        'license': 'Data collected and blended [...]',
        'timestamp': Date.now(),
        'base': 'USD',
        'rates': {
          'EUR': 0.92
        }
      };
      var openxr = nock('https://openexchangerates.org')
        .get('/api/latest.json?app_id=' + service.oxrAppId)
        .reply(200, body);
      gwMock.GatewayMock.rejectWith({message: 'some error'});

      service.processOrder(processor, offer, creditCard, prospect).then(function (result) {
        api.done();
        assert.equal(result.billing_status, 'failed');
        done();
      }, function (err) {
        console.log(err);
      });
    });

  });

  describe('increment visits', function () {
    var service;

    beforeEach(function (done) {

      nock('http://base.com')
        .post('/authenticateApplication', {apiKey: 'key', apiSecret: 'secret'})
        .reply(200, {
          token: 'token',
          campaign: {id: 666}
        });

      react.getAuthenticatedApplication('key', 'secret', {schema: schema})
        .then(function (serv) {
          service = serv;
          done();
        });
    });

    afterEach(function () {
      nock.cleanAll();
    });

    it('should increment of n visits', function (done) {
      var api = nock('http://base.com')
        .put('/campaigns/666', {visits: 4})
        .reply(201, {
          id: 666,
          visits: 56
        });

      service.incrementVisits(4).then(function (result) {
        assert.equal(result.id, 666);
        assert.equal(service.campaign.id, 666);
        assert.equal(result.visits, 56);
        assert.equal(service.campaign.visits, 56);
        api.done();
        done();
      });
    });

    it('should increment of 1 visit by default', function (done) {
      var api = nock('http://base.com')
        .put('/campaigns/666', {visits: 1})
        .reply(201, {
          id: 666,
          visits: 56
        });

      service.incrementVisits().then(function (result) {
        assert.equal(result.id, 666);
        assert.equal(service.campaign.id, 666);
        assert.equal(result.visits, 56);
        assert.equal(service.campaign.visits, 56);
        api.done();
        done();
      });
    });
  });
});

describe('ReactCRM resource builder', function () {

  afterEach(function () {
    nock.cleanAll();
  });

  it('should namespace api based on properties field', function (done) {
    var api = buildResoure({
      links: [{rel: 'self', href: 'http://foo.com'}],
      definitions: {
        products: {
          links: [{
            rel: 'instances',
            method: 'GET',
            href: '/products'
          }]
        }
      },
      properties: {
        products: {
          $ref: '#/definitions/products'
        }
      }
    });

    var scope = nock('http://foo.com')
      .get('/products')
      .reply(200, [{id: 1}]);

    assert(api.products, 'products api should be defined');
    assert(api.products.instances);


    api.products.instances().then(function (products) {
      assert.equal(products.length, 1);
      assert.equal(products[0].id, 1);
      assert.equal(scope.isDone(), true);
      done();
    });


  });

  it('should support url parameters', function (done) {
    var api = buildResoure({
      links: [{rel: 'self', href: 'http://foo.com'}],
      definitions: {
        products: {
          links: [{
            "href": "/products/{(%23%2Fdefinitions%2Fproducts%2Fdefinitions%2Fid)}",
            "method": "GET",
            "rel": "self",
            "schema": {
              "properties": {"id": {"$ref": "#/definitions/products/definitions/id"}},
              "required": ["id"],
              "type": "object"
            }
          }]
        }
      },
      properties: {
        products: {
          $ref: '#/definitions/products'
        }
      }
    });

    var scope = nock('http://foo.com')
      .get('/products/666')
      .reply(200, {id: 666});

    assert(api.products, 'products api should be defined');
    assert(api.products.self);


    api.products.self(666).then(function (product) {
      assert.equal(product.id, 666);
      assert.equal(scope.isDone(), true);
      done();
    });
  });

  it('should support a post body', function (done) {
    var api = buildResoure({
      links: [{rel: 'self', href: 'http://foo.com'}],
      definitions: {
        products: {
          links: [{
            "href": "/products",
            "method": "POST",
            "rel": "create",
            "schema": {
              "properties": {"id": {"$ref": "#/definitions/products/definitions/id"}},
              "required": ["id"],
              "type": "object"
            }
          }]
        }
      },
      properties: {
        products: {
          $ref: '#/definitions/products'
        }
      }
    });

    var scope = nock('http://foo.com')
      .post('/products', {
        id: 666
      })
      .reply(200, {id: 666, created: true});

    assert(api.products, 'products api should be defined');
    assert(api.products.create);


    api.products.create({id: 666}).then(function (product) {
      assert.equal(product.id, 666);
      assert.equal(product.created, true);
      assert.equal(scope.isDone(), true);
      done();
    });
  });

  it('should support query parameters and body', function (done) {
    var api = buildResoure({
      links: [{rel: 'self', href: 'http://foo.com'}],
      definitions: {
        products: {
          links: [{
            "href": "/products/{(%23%2Fdefinitions%2Fproducts%2Fdefinitions%2Fid)}",
            "method": "PUT",
            "rel": "update"
          }]
        }
      },
      properties: {
        products: {
          $ref: '#/definitions/products'
        }
      }
    });

    var scope = nock('http://foo.com')
      .put('/products/666', {
        update: true
      })
      .reply(200, {id: 666, updated: true});


    assert(api.products, 'products api should be defined');
    assert(api.products.update);


    api.products.update(666, {update: true}).then(function (product) {
      assert.equal(product.id, 666);
      assert.equal(product.updated, true);
      assert.equal(scope.isDone(), true);
      done();
    });
  });
});

describe('authentication proxy', function () {

  afterEach(function () {
    nock.cleanAll();
  });

  it('should namespace api based on properties field', function (done) {
    var api = buildResoure({
      links: [{rel: 'self', href: 'http://foo.com'}],
      definitions: {
        products: {
          links: [{
            rel: 'instances',
            method: 'GET',
            href: '/products'
          }]
        }
      },
      properties: {
        products: {
          $ref: '#/definitions/products'
        }
      }
    });
    var products = proxy(api.products, authenticationProxy('secret'));


    var scope = nock('http://foo.com')
      .get('/products')
      .matchHeader('authorization', 'Bearer secret')
      .reply(200, [{id: 1}]);

    assert(products, 'products api should be defined');
    assert(products.instances);


    products.instances().then(function (products) {
      assert.equal(products.length, 1);
      assert.equal(products[0].id, 1);
      assert.equal(scope.isDone(), true);
      done();
    });


  });

  it('should support url parameters', function (done) {
    var api = buildResoure({
      links: [{rel: 'self', href: 'http://foo.com'}],
      definitions: {
        products: {
          links: [{
            "href": "/products/{(%23%2Fdefinitions%2Fproducts%2Fdefinitions%2Fid)}",
            "method": "GET",
            "rel": "self",
            "schema": {
              "properties": {"id": {"$ref": "#/definitions/products/definitions/id"}},
              "required": ["id"],
              "type": "object"
            }
          }]
        }
      },
      properties: {
        products: {
          $ref: '#/definitions/products'
        }
      }
    });

    var products = proxy(api.products, authenticationProxy('secret'));

    var scope = nock('http://foo.com')
      .get('/products/666')
      .matchHeader('authorization', 'Bearer secret')
      .reply(200, {id: 666});

    products.self(666).then(function (product) {
      assert.equal(product.id, 666);
      assert.equal(scope.isDone(), true);
      done();
    });
  });

  it('should support a post body', function (done) {
    var api = buildResoure({
      links: [{rel: 'self', href: 'http://foo.com'}],
      definitions: {
        products: {
          links: [{
            "href": "/products",
            "method": "POST",
            "rel": "create",
            "schema": {
              "properties": {"id": {"$ref": "#/definitions/products/definitions/id"}},
              "required": ["id"],
              "type": "object"
            }
          }]
        }
      },
      properties: {
        products: {
          $ref: '#/definitions/products'
        }
      }
    });

    var products = proxy(api.products, authenticationProxy('secret'));

    var scope = nock('http://foo.com')
      .post('/products', {
        id: 666
      })
      .matchHeader('authorization', 'Bearer secret')
      .reply(200, {id: 666, created: true});


    products.create({id: 666}).then(function (product) {
      assert.equal(product.id, 666);
      assert.equal(product.created, true);
      assert.equal(scope.isDone(), true);
      done();
    });
  });

  it('should support query parameters and body', function (done) {
    var api = buildResoure({
      links: [{rel: 'self', href: 'http://foo.com'}],
      definitions: {
        products: {
          links: [{
            "href": "/products/{(%23%2Fdefinitions%2Fproducts%2Fdefinitions%2Fid)}",
            "method": "PUT",
            "rel": "update"
          }]
        }
      },
      properties: {
        products: {
          $ref: '#/definitions/products'
        }
      }
    });

    var products = proxy(api.products, authenticationProxy('secret'));
    var scope = nock('http://foo.com')
      .put('/products/666', {
        update: true
      })
      .matchHeader('authorization', 'Bearer secret')
      .reply(200, {id: 666, updated: true});

    products.update(666, {update: true}).then(function (product) {
      assert.equal(product.id, 666);
      assert.equal(product.updated, true);
      assert.equal(scope.isDone(), true);
      done();
    });
  });

});

