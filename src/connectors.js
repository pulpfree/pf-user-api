// import Site as SiteModel from './model/site'
const SiteModel = require('./model/site')
const UserSchema = require('./model/UserSchema')
const mongoose = require('mongoose')

const dbURI = 'mongodb://localhost'


class Site {
  constructor() {

    this.findSite = (name) => {
      const site = SiteModel.findOne({ name }, (error, data) => {
        return data
      })
      return site
    }

    this.find = (params) => {
      return SiteModel.find(params).exec()
    }

    this.findSiteById = (_id) => {
      const site = SiteModel.findById(_id, (error, data) => {
        return data
      })
      return site
    }

    this.create = (fields) => {
      return new SiteModel(fields).save()
    }

    this.update = (id, fields) => {
      return SiteModel.findByIdAndUpdate(id, fields, {new: true}).exec()
    }
  }
}

class User {
  constructor() {

    this.create = (fields) => {
      const { user, doc } = fields
      const um = userModel(doc.dbNm, doc.collectionNm)
      return new um(user).save()
    }

    this.update = (fields) => {
      const { userID, user, doc } = fields
      const um = userModel(doc.dbNm, doc.collectionNm)
      return um.findByIdAndUpdate(userID, user, {new: true}).exec()
    }

    this.fetchUserByEmail = (fields) => {
      const { email, doc } = fields
      const um = userModel(doc.dbNm, doc.collectionNm)
      return um.findOne({email}).exec()
    }

    this.fetchUsersByDomain = (fields) => {
      const { doc } = fields
      const um = userModel(doc.dbNm, doc.collectionNm)
      return um.find().exec()
    }
  }
}


function userModel(dbNm, collectionNm) {
  const db  = mongoose.createConnection(dbURI)
  const db2 = db.useDb(dbNm)
  return db2.model('Usr', UserSchema, collectionNm)
}


module.exports = { Site, User }