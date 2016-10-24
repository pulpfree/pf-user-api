import hapi from 'hapi'

import Mongoose from 'mongoose'

import { apolloHapi, graphiqlHapi } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools'

// import Schema from './schema'
const Schema = require('./schema')
// import Resolvers from './resolvers'
const Resolvers = require('./resolvers')
// import Connectors from './connectors'
const Connectors = require('./connectors')

// console.log('Connectors:', Connectors)

const connectURI = 'mongodb://localhost/pf-user'
Mongoose.Promise = global.Promise
Mongoose.connect(connectURI, err => {
  if (err) { return err }
  return true
})


const server = new hapi.Server()
const HOST = 'localhost'
const PORT = 3000

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
  // allowUndefinedInResolve: false,
  printErrors: true,
})

server.connection({
  host: HOST,
  port: PORT,
})

server.register({
  register: apolloHapi,
  options: {
    path: '/graphql',
    apolloOptions: {
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
    // console.error('Failed to load plugin:', err)

  if (!module.parent) {
    server.start(function () {
      // console.log('Server running at:', server.info.uri)
    server.log('info', `Server running at ${server.info.uri}`)
  })
}
})

export default server
