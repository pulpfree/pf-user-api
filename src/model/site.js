const Mongoose = require('mongoose')

const siteSchema = Mongoose.Schema({
  active: {
    default:  false,
    index:    true,
    required: true,
    type:     Boolean,
  },
  credentials: {
    password: {
      required: true,
      type:     String,
    },
    username: {
      required: true,
    type:     String,
    }
  },
  collections: {
    contact: {
      required: true,
      type:     String,
    },
    user: {
      required: true,
      type:     String,
    }
  },
  dbNm: {
    required: true,
    type:     String,
  },
  domainID: {
    required: true,
    type:     String,
    unique:   true,
  },
  name: {
    required: true,
    type:     String,
  },
  pemFiles: {
    private: String,
    public: String,
  },
  resetURI: {
    required: true,
    type:     String,
  },
  roles: Array,
  signingMethod: {
    default: 'RSA',
    type:     String,
  }
},{
  timestamps: true
})

const Site = Mongoose.model('Site', siteSchema)

module.exports = Site
