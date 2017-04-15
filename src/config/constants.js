'use strict'

const APIDevAddress     = 'http://10.0.1.9'
const APIProdAddress    = 'http://utilp-1.pflabs.vpc'
const dbLocalAddress    = '10.0.1.9:27017'
const dbName            = 'pf-user'
const dbProdAddress     = 'dbp.pflabs.vpc:27017,dbs-01.pflabs.vpc:27017'
const dbProdReplicaSet  = 'rs0'

module.exports = function() {

  const dbConstants = databaseConfig()
  const domainKey = userDomain()
  const APIPaths = APIDomain()

  // Set some defaults
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production'
  }
  if (!process.env.NODE_HOST) {
    process.env.NODE_HOST = '0.0.0.0'
  }
  if (!process.env.NODE_PORT) {
    process.env.NODE_PORT = 3010
  }
  if (!process.env.DB_PROD_URL) { //todo: check if this is required
    process.env.DB_PROD_URL = `mongodb://${dbProdAddress}/${dbName}?replicaSet=${dbProdReplicaSet}`
  }
  if (!process.env.USER_DOMAIN) {
    process.env.USER_DOMAIN = 'local.pf-sales'
  }
  let env = process.env.NODE_ENV || 'development'

  let obj = {
    application: {
      host: process.env.NODE_HOST,
      port: process.env.NODE_PORT
    },
    database: {
      uri:      dbConstants[env]['uri'],
      options:  dbConstants[env]['options']
    },
    domainKey: domainKey[env],
    APIPaths: {
      login:        APIPaths['login'][env],
      validate:     APIPaths['validate'][env],
      resetRequest: APIPaths['resetRequest'][env],
      resetToken:   APIPaths['resetToken'][env]
    }
  }

  if (!obj.application['host']) {
    throw new Error('Missing constant application.host. Check your enviroment variables NODE_HOST.')
  } else if (!obj.application['port']) {
    throw new Error('Missing constant application.port. Check your enviroment variable NODE_PORT.')
  } else if (!obj.database['uri']) {
    throw new Error('Missing constant database.uri. Check your enviroment variables.')
  } else if (!obj.domainKey) {
    throw new Error('Missing domain key. Check your enviroment variables.')
  }

  return obj

  function databaseConfig() {
    return {
      production: {
        uri: `mongodb://${dbProdAddress}/${dbName}?replicaSet=${dbProdReplicaSet}`,
        options: {
          replset: {}
        }
      },
      development: {
        uri: `mongodb://${dbLocalAddress}/${dbName}`,
        options: {}
      },
      test: {
        uri: `mongodb://${dbLocalAddress}/pf-user-test`,
        options: {}
      }
    }
  }

  function userDomain() {
    return {
      production:   'io.pflabs.useradmin',
      development:  'local.pf-user',
      test:         'local.pf-user'
    }
  }

  function APIDomain() {
    return {
      login: {
        development:  `${APIDevAddress}:3003/login`,
        production:   `${APIProdAddress}:3003/login`
      },
      validate: {
        development:  `${APIDevAddress}:3003/validate`,
        production:   `${APIProdAddress}:3003/validate`
      },
      resetRequest: {
        development:  `${APIDevAddress}:3004/reset-request`,
        production:   `${APIProdAddress}:3004/reset-request`
      },
      resetToken: {
        development:  `${APIDevAddress}:3004/reset-token`,
        production:   `${APIProdAddress}:3004/reset-token`
      }
    };
  }
}()