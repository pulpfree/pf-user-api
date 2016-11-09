const Mongoose = require('mongoose')

const ContactSchema = Mongoose.Schema({
  addresses: Array,
  email: String,
  name: {
    first: String,
    last: String
  },
  phones: Array,
},{
  timestamps: true
})


module.exports = ContactSchema