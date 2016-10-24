const test = require('tape')

// with watch: https://github.com/rstacruz/tape-watch
// const server = require('../mock/server')

// import '../src/index.js'
import server from '../src/index'

// **** Describe GET /customers **** //

test('GET /graphql', t => {
  const opts = {
    method: 'GET',
    url: '/graphql',
    // headers: { authorization: 'Bearer 12345678'},
  }
  server.inject(opts, resp => {
    t.equal(resp.statusCode, 404)
    // t.fail(resp.statusCode, 200)npm
    server.stop(t.end)
  })
})