var test = require('tape');
var sdk = require('../index.js');

test('foo', t=> {
  t.equal('foo', 'foo');
  sdk.createSdk({
    endpoint: {protocol: 'http', hostname: 'localhost', port: 8001},
    schemaUrl: 'http://localhost:8001/public/schema.json'
  })
    .then(funnels => {
      const users = funnels.users();
      users.login({email: 'demo@reactcrm.local', password: 'demo'})
        .then(function (resp) {
          console.log(resp);
          const token = resp.token;
          return funnels.users(token).merchant({merchantUuid: resp.user.merchants[0].uuid})
        })
        .then(resp=> {
          const token = resp.token;
          return funnels.products(token).self(1);
        })
        .then(product=>{
          console.log(product);
        })
        .catch(err=> {
          console.log(err)
        })
    })
    .then(t.end)
    .catch(t.end)
});