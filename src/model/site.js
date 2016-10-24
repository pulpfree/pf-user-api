const Mongoose = require('mongoose')

const siteSchema = Mongoose.Schema({
  active: {
    default:  false,
    index:    true,
    // required: true,
    type:     Boolean,
  },
  credentialKeyPassword: {
    required: true,
    type:     String,
  },
  credentialKeyUsername: {
    required: true,
    type:     String,
  },
  collectionNm: {
    required: true,
    type:     String,
  },
  dbNm:         {
    required: true,
    type:     String,
  },
  domain:       {
    required: true,
    type:     String,
    unique:   true,
  },
  name: {
    required: true,
    type:     String,
  },
  pemFilePrivate: String,
  pemFilePublic: String,
  resetURI: {
    required: true,
    type:     String,
  },
  signingMethod: {
    default: 'RSA',
    type:     String,
  }
},{
  timestamps: true
})

const Site = Mongoose.model('Site', siteSchema)

module.exports = Site
