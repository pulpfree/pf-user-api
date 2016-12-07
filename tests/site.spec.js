const test = require('tape')
const mongoose = require('mongoose')
import server from '../src/index'

let siteID
import { createSite, removeSite, siteFields, siteQuery, updateSite } from './mock/schemas'
import { getRandomInt } from './mock/utils'


// test NODE_ENV=test ./node_modules/.bin/tape -r babel-register 'tests/site.spec.js' | ./node_modules/.bin/tap-spec

test('createSite', t => {
  siteFields.domainID = `${siteFields.domainID}-${getRandomInt()}`
  const opts = {
    method: 'POST',
    url: '/graphql',
    payload: createSite
    // headers: { authorization: 'Bearer 12345678'},
  }
  server.inject(opts, resp => {
    const res = resp.result
    t.equal(res.errors, undefined, 'Return with no errors')
    t.ok(res.data.createSite._id, 'Have id')
    siteID = res.data.createSite._id
    server.stop(t.end)
  })
})

test('updateSite', t => {
  siteFields._id = siteID
  updateSite.variables._id = siteID
  updateSite.variables.fields.active = true
  const opts = {
    method: 'POST',
    url: '/graphql',
    payload: updateSite
    // headers: { authorization: 'Bearer 12345678'},
  }
  server.inject(opts, resp => {
    const res = resp.result
    t.equal(res.errors, undefined, 'Return with no errors')
    t.equal(res.data.updateSite.active, true, 'Active is true')
    server.stop(t.end)
  })
})

test('fetchSites', t => {
  const opts = {
    method: 'POST',
    url: '/graphql',
    payload: siteQuery
    // headers: { authorization: 'Bearer 12345678'},
  }
  server.inject(opts, resp => {
    const res = resp.result
    t.equal(res.errors, undefined, 'Return with no errors')
    t.ok(res.data.fetchSites.length > 0, 'Return at least 1 site')
    server.stop(t.end)
  })
})

test('removeSite', t => {
  removeSite.variables._id = siteID
  const opts = {
    method: 'POST',
    url: '/graphql',
    payload: removeSite
    // headers: { authorization: 'Bearer 12345678'},
  }
  server.inject(opts, resp => {
    const res = resp.result
    t.equal(res.errors, undefined, 'Return with no errors')
    t.equal(res.data.removeSite.ok, 1, 'Ok is true')
    t.equal(res.data.removeSite.n, 1, 'Number results = 1')
    server.stop(t.end)
  })
})

// Use this if testing alone
/*test('site endpoints teardown', function(t) {
  mongoose.disconnect(t.end)
})*/