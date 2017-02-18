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
  console.log('save in userschema:', user)
  if (!user.isModified('password')) return next()
    console.log('save in userschema 2:', user)

  /*if (user.scope) {
    user.scopeBits = setBits(user.scope)
  }*/

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.static('hashPassword', function(password) {
  if (!password || !password.length > 0) {
    return null
  }
  const salt = bcrypt.genSaltSync(SALT_FACTOR)
  return bcrypt.hashSync(password, salt)
})

UserSchema.method('hashPassword', function () {
  console.log('password to hash:', this.password)
  if (this.password && this.password.length > 0) {
    const salt = bcrypt.genSaltSync(SALT_FACTOR)
    this.password = bcrypt.hashSync(this.password, salt)
  }
})

module.exports = UserSchema
