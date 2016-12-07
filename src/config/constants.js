'use strict'

const dbName = 'pf-user'

module.exports = (function() { // used function instead of => to get lint to pass issue on last line of file

  const dbConstants = databaseConfig()
  const domainKey = userDomain()
  const APIPaths = APIDomain()

  // Set some defaults
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development'
  }
  if (!process.env.NODE_HOST) {
    process.env.NODE_HOST = '0.0.0.0'
  }
  if (!process.env.NODE_PORT) {
    process.env.NODE_PORT = 3010
  }
  if (!process.env.DB_PROD_URL) {
    process.env.DB_PROD_URL = 'mongodb://dbp.pflabs.vpc:27017,dbs-01.pflabs.vpc:27017?replicaSet=rs0'
  }
  if (!process.env.USER_DOMAIN) {
    process.env.USER_DOMAIN = 'local.pf-sales'
  }
  const env = process.env.NODE_ENV || 'development'

  const obj = {
    application: {
      host: process.env.NODE_HOST,
      port: process.env.NODE_PORT
    },
    database: {
      uri: dbConstants[env]['uri'],
      options: dbConstants[env]['options']
    },
    domainKey: domainKey[env],
    APIPaths: {
      login:        APIPaths['login'][env],
      validate:     APIPaths['validate'][env],
      resetRequest: APIPaths['resetRequest'][env],
      resetToken:   APIPaths['resetToken'][env],
    }
  }

  if (!obj.application['host']) {
    throw new Error('Missing constant application.host. ' +
      'Check your enviroment variables NODE_HOST.')
  } else if (!obj.application['port']) {
    throw new Error('Missing constant application.port. ' +
      'Check your enviroment variable NODE_PORT.')
  } else if (!obj.database['uri']) {
    throw new Error('Missing constant database.uri. ' +
      'Check your enviroment variables.')
  } else if (!obj.domainKey) {
    throw new Error('Missing domain key. ' +
      'Check your enviroment variables.')
  }

  return obj

  function databaseConfig() {
    return {
      production: {
        uri: `mongodb://dbp.pflabs.vpc:27017,dbs-01.pflabs.vpc:27017/${dbName}?replicaSet=rs0`,
        options: {
          replset: {}
        }
      },
      development: {
        uri: `mongodb://localhost:27017/${dbName}`,
        options: {}
      },
      test: {
        uri: 'mongodb://localhost:27017/pf-user-test',
        options: {}
      }
    }
  }

  function userDomain() {
    return {
      production: 'io.pflabs.pf-user',
      development: 'local.pf-user',
      test: 'local.pf-user'
    }
  }

  function APIDomain() {
    return {
      login: {
        development: 'http://localhost:3003/login',
        production: ''
      },
      validate: {
        development: 'http://localhost:3003/validate',
        production: ''
      },
      resetRequest: {
        development: 'http://localhost:3004/reset-request',
        production: ''
      },
      resetToken: {
        development: 'http://localhost:3004/reset-token',
        production: ''
      }
    }
  }

}())
