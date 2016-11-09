import hapi from 'hapi'

import Mongoose from 'mongoose'

import { graphqlHapi, graphiqlHapi } from 'graphql-server-hapi'
import { makeExecutableSchema } from 'graphql-tools'

// import Schema from './schema'
const Schema = require('./schema')
// import Resolvers from './resolvers'
const Resolvers = require('./resolvers')
// import Connectors from './connectors'
const Connectors = require('./connectors')

const connectURI = 'mongodb://localhost/pf-user'
Mongoose.Promise = global.Promise
Mongoose.connect(connectURI, err => {
  if (err) { return err }
  return true
})


// const server = new hapi.Server({debug: {request: ['info', 'error']}})
const server = new hapi.Server()
const HOST = 'localhost'
const PORT = 3003

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
  resolverValidationOptions: {
    // requireResolversForAllFields: false,
    // requireResolversForArgs: false,
    requireResolversForNonScalar: false,
  },
  // allowUndefinedInResolve: true,
  printErrors: true,
})

server.connection({
  host: HOST,
  port: PORT,
  routes: {cors: true}
})

server.register({
  register: graphqlHapi,
  options: {
    path: '/graphql',
    graphqlOptions: {
      schema: executableSchema,
      context: { constructor: Connectors }
    },
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
