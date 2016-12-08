import hapi from 'hapi'

const AuthBearer = require('hapi-auth-bearer-token')
import fs from 'fs'
const jwt = require('jsonwebtoken')
const UserSchema = require('./model/user-schema')
import { formatError } from 'apollo-errors'
import path from 'path'

import Mongoose from 'mongoose'

import { graphqlHapi, graphiqlHapi } from 'graphql-server-hapi'
import { makeExecutableSchema } from 'graphql-tools'

import constants from './config/constants'
import connectors from './connectors'
import resolvers from './resolvers'
const Schema = require('./schema')

const connectURI = 'mongodb://localhost/pf-user'
Mongoose.Promise = global.Promise
Mongoose.connect(constants.database['uri'], constants.database['options'])
  .then()
  .catch(err => {
  console.error('err:', err)
  //todo: log error here
})


// authenticate props
// open this certificate file once then it's accessible for every request
// see:https://gist.github.com/thebigredgeek/1b061644fd3e4f475574e71838bfd178
// for authentication with Apollo server
const SSLPATH = path.join(__dirname, '../ssl')
const DOMAIN_KEY = constants.domainKey
const tokenFN = DOMAIN_KEY + '-public.pem'
const tokenPath = path.join(SSLPATH, tokenFN)
const cert = fs.readFileSync(tokenPath)

const User = Mongoose.model('User', UserSchema, 'users')
// let AuthUser

const jwtValidateFunc = function(token, callback) {

  jwt.verify(token, cert, { algorithms: ['RS256'], issuer: DOMAIN_KEY }, function(err, decoded) {
    if (err) {
      return callback(null, false, { token: token })
    }
    // console.log('decoded:', decoded)
    return callback(null, true, { token: token, userID: decoded.jti })

    /*// fetch user scopes
    let q = User.findById(decoded.jti, {active: 1, scope: 1})
    q.exec().then(user => {
      // If user is in-activated, forbid
      if (user.active === false) {
        return callback(null, false, { token: token })
      }
      console.log('user in jwtValidateFunc:', user)
      // AuthUser = user
      let userID = user.id
      return callback(null, true, { token: token, scope: user.scope, userID: userID })
    })*/
  })
}


const server = new hapi.Server()
server.connection({
  host: constants.application['host'],
  port: constants.application['port'],
  routes: {cors: true}
})

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: resolvers,
  resolverValidationOptions: {
    // requireResolversForAllFields: false,
    // requireResolversForArgs: false,
    requireResolversForNonScalar: false,
  },
  // allowUndefinedInResolve: true,
  printErrors: true,
})

server.register(AuthBearer, err => {
  if (err) { throw err }

  // server.auth.strategy('jwt_access_token', 'bearer-access-token', true, {
  server.auth.strategy('jwt_access_token', 'bearer-access-token', 'try', {
    validateFunc: jwtValidateFunc
  })
})

server.register({
  register: graphqlHapi,
  options: {
    path: '/graphql',
    graphqlOptions: (request) => {
      return {
        formatError,
        schema: executableSchema,
        context: { constructor: connectors, auth: request.auth }
      }
    }
  },
})

server.register({
  register: graphiqlHapi,
  options: {
    path: '/graphiql',
    graphiqlOptions: {
      endpointURL: '/graphql',
    },
  },
}, function (err) {
  if (err) { throw err }

  if (!module.parent) {
    server.start(function () {
    server.log('info', `Server running at ${server.info.uri}`)
  })
}
})

export default server
