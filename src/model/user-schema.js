const Mongoose = require('mongoose')

const bcrypt    = require('bcrypt')
const SALT_FACTOR = 10
const ContactSchema = require('./contact-schema')

const UserSchema = Mongoose.Schema({
  active: {
    default:  false,
    type:     Boolean
  },
  contact: {
    type:     Mongoose.Schema.Types.ObjectId,
    ref:      'ContactSchema',
  },
  email: {
    index:    true,
    type:     String,
    unique:   true,
  },
  password:   String,
  scope:      Array,
  scopeBits:  Number
},{
  timestamps: true
})

UserSchema.pre('save', function(next) {
  let user = this
  if (!user.isModified('password')) return next()

  /*if (user.scope) {
    user.scopeBits = setBits(user.scope)
  }*/

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)
      user.password = hash
      // console.log('hash', hash)
      next()
    })
  })
})

UserSchema.method('hashPassword', function () {
  if (this.password !== undefined) {
    this.password = bcrypt.hashSync(this.password, SALT_FACTOR)
  }
})

module.exports = UserSchema
