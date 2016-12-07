const test = require('tape')
const mongoose = require('mongoose')
import server from '../src/index'
import * as S from './mock/schemas'
import { getRandomInt } from './mock/utils'
let siteID, userID, user

// test NODE_ENV=test ./node_modules/.bin/tape -r babel-register 'tests/user.spec.js' | ./node_modules/.bin/tap-spec

test('createSite', t => {
  S.siteFields.domainID = `${S.siteFields.domainID}-${getRandomInt()}`
  const opts = {
    method: 'POST',
    url: '/graphql',
    payload: S.createSite
    // headers: { authorization: 'Bearer 12345678'},
  }
  server.inject(opts, resp => {
    const res = resp.result
    t.equal(res.errors, undefined, 'Return with no errors')
    t.ok(res.data.createSite._id, 'Have id')
    siteID = res.data.createSite._id
    S.userFields.domainID = siteID
    server.stop(t.end)
  })
})


test('createUser', t => {
  S.siteFields.domainID = `${S.siteFields.domainID}-${getRandomInt()}`
  S.userFields.email = `abc${getRandomInt()}.example.com`
  const opts = {
    method: 'POST',
    url: '/graphql',
    payload: S.createUser
    // headers: { authorization: 'Bearer 12345678'},
  }
  server.inject(opts, resp => {
    const res = resp.result
    t.equal(res.errors, undefined, 'Return with no errors')
    userID = res.data.createUser._id
    S.userFields._id = userID
    t.ok(userID, 'Have userID')
    server.stop(t.end)
  })
})

// Before updating user, we need to grab her
test('fetchUser', t => {
  const opts = {
    method: 'POST',
    url: '/graphql',
    payload: S.fetchUserQuery
    // headers: { authorization: 'Bearer 12345678'},
  }
  S.fetchUserQuery.variables.email = S.userFields.email
  S.fetchUserQuery.variables.domainID = S.userFields.domainID
  server.inject(opts, resp => {
    const res = resp.result
    t.equal(res.errors, undefined, 'Return with no errors')
    user = res.data.fetchUser
    server.stop(t.end)
  })
})

test('updateUser', t => {
  const scope = {id: 'admin', label: 'Administrator'}
  S.userFields = Object.assign(S.userFields, user)
  S.userFields.scope.push(scope)
  S.updateUser.variables.fields = S.userFields
  S.updateUser.variables._id = S.userFields._id
  S.userFields.active = false
  const opts = {
    method: 'POST',
    url: '/graphql',
    payload: S.updateUser
    // headers: { authorization: 'Bearer 12345678'},
  }
  server.inject(opts, resp => {
    const res = resp.result
    t.equal(res.errors, undefined, 'Return with no errors')
    t.equal(res.data.updateUser.scope[0].id, scope.id, 'Scope id matches')
    server.stop(t.end)
  })
})

test('fetchUsers', t => {
  const opts = {
    method: 'POST',
    url: '/graphql',
    payload: S.fetchUsersQuery
    // headers: { authorization: 'Bearer 12345678'},
  }
  S.fetchUsersQuery.variables.domainID = S.userFields.domainID
  server.inject(opts, resp => {
    const res = resp.result
    t.equal(res.errors, undefined, 'Return with no errors')
    t.ok(res.data.fetchUsers.length > 0, 'Has at least 1 user')
    server.stop(t.end)
  })
})

test('removeUser', t => {
  S.removeUser.variables._id = S.userFields._id
  S.removeUser.variables.domainID = S.userFields.domainID
  const opts = {
    method: 'POST',
    url: '/graphql',
    payload: S.removeUser
    // headers: { authorization: 'Bearer 12345678'},
  }
  server.inject(opts, resp => {
    const res = resp.result
    t.equal(res.errors, undefined, 'Return with no errors')
    t.equal(res.data.removeUser.ok, 1, 'Ok is true')
    t.equal(res.data.removeUser.n, 1, 'Number results = 1')
    server.stop(t.end)
  })
})

test('User db and connection teardown', t => {
  const conURL = `mongodb://localhost/${S.siteFields.dbNm}`
  mongoose.disconnect().then(() => {
    const con = mongoose.connect(conURL, () => {
      con.connection.db.dropDatabase().then(res => {
        mongoose.disconnect(t.end)
      })
    })
  })
  // mongoose.disconnect(t.end)
})

