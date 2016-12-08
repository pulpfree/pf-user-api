const mongoose = require('mongoose')
const constants = require('../../config/constants')
const ContactSchema = require('../../model/contact-schema')
const UserSchema = require('../../model/user-schema')
const dbURI = constants.database.uri

export function userModel(dbNm, collectionNm) {
  const db  = mongoose.createConnection(dbURI)
  const db2 = db.useDb(dbNm)
  db2.model('ContactSchema', ContactSchema, 'contacts')
  return db2.model('Usr', UserSchema, collectionNm)
}

export function contactModel(dbNm, collectionNm) {
  const db  = mongoose.createConnection(dbURI)
  const db2 = db.useDb(dbNm)
  return db2.model('ContactSchema', ContactSchema, collectionNm)
}