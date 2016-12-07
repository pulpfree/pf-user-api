// import Site as SiteModel from './model/site'
const ContactSchema = require('./model/contact-schema')
const SiteModel = require('./model/site')
const UserSchema = require('./model/user-schema')
const mongoose = require('mongoose')
const rp = require('request-promise')
const constants = require('./config/constants')

const dbURI = constants.database.uri

//todo: require config with proper dev and prod domains in uri
class Auth {
  constructor() {

    this.authUser = (fields) => {

      const payload = {
        username: fields.email,
        password: fields.password,
        domainID: fields.domainID
      }
      const options = {
        body:   payload,
        json:   true,
        method: 'POST',
        uri:    constants.APIPaths.login,
      }
      return rp(options)
    }

    this.authValidate = (fields) => {
      console.log('constants.:', constants)
      const payload = {
        domainID: fields.domainID,
      }
      const options = {
        body:   payload,
        headers: {
          Authorization: `Bearer ${fields.token}`
        },
        json:   true,
        method: 'POST',
        uri:    constants.APIPaths.validate,
      }
      console.log('options:', options)
      return rp(options)
    }

    this.authReset = (fields) => {

      const payload = {
        domainID: fields.domainID,
        email:    fields.email,
      }
      const options = {
        body:   payload,
        json:   true,
        method: 'POST',
        uri:    constants.APIPaths.resetRequest
      }
      return rp(options)
    }

    this.authResetToken = (fields) => {
      const payload = {
        domainID: fields.domainID,
        email:    fields.email,
        password: fields.password,
        resetToken: fields.resetToken
      }
      const options = {
        body:   payload,
        json:   true,
        method: 'POST',
        uri:    constants.APIPaths.resetToken
      }
      return rp(options)
    }
  }
}

class Site {
  constructor() {

    this.findSite = (domainID) => {
      const site = SiteModel.findOne({ domainID }, (error, data) => {
        return data
      })
      return site
    }

    this.find = (params) => {
      return SiteModel.find(params).sort({name: 1}).exec()
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

    this.remove = (_id) => {
      return SiteModel.remove({_id: _id})
    }
  }
}

class User {
  constructor() {

    this.create = (fields) => {
      const { siteDoc, user } = fields
      const um = userModel(siteDoc.dbNm, siteDoc.collections.user)
      const ct = contactModel(siteDoc.dbNm, siteDoc.collections.contact)
      let contact = new ct(user.contact)
      contact.email = user.email
      return contact.save().then(contact => {
        user.contact = contact._id
        return new um(user).save()
      })
    }

    this.update = (fields) => {
      const { siteDoc, user } = fields
      const um = userModel(siteDoc.dbNm, siteDoc.collections.user)
      const ct = contactModel(siteDoc.dbNm, siteDoc.collections.contact)
      const contact = user.contact
      delete user.contact
      return um.findByIdAndUpdate(user._id, user, {new: true}).exec().then(userRes => {
        return ct.findByIdAndUpdate(contact._id, contact, {new: true}).exec().then(contact => {
          userRes.contact = contact
          return Promise.resolve(userRes)
        })
      })
    }

    this.fetchUserByEmail = (fields) => {
      const { email, siteDoc } = fields
      // FIXME: oddly the usermodel will not populate the contact when querying for a single user
      const ct = contactModel(siteDoc.dbNm, siteDoc.collections.contact)
      const um = userModel(siteDoc.dbNm, siteDoc.collections.user)
      return um.findOne({email}).then(user => {
        const contactID = user.contact
        return ct.findById(user.contact).exec().then(contact => {
          user.contact = contact
          return Promise.resolve(user)
        })
      })
    }

    this.fetchUsersByDomain = (fields) => {
      const { siteDoc } = fields
      // const ct = contactModel(siteDoc.dbNm, siteDoc.collections.contact)
      const um = userModel(siteDoc.dbNm, siteDoc.collections.user)
      return um.find().populate('contact').sort({email: 1}).exec()
    }

    this.remove = (_id, domainID) => {
      return SiteModel.findById(domainID).exec().then(siteDoc => {
        const ct = contactModel(siteDoc.dbNm, siteDoc.collections.contact)
        const um = userModel(siteDoc.dbNm, siteDoc.collections.user)
        return um.findById(_id).exec().then(user => {
          return ct.remove({_id: user.contact}).then(res => {
            return um.remove({_id: _id})
          })
        })
      })
    }
  }
}

class Contact {
  constructor() {

    this.create = (fields) => {
      return new ContactModel(fields).save()
    }

    this.update = (id, fields) => {
      return ContactModel.findByIdAndUpdate(id, fields, {new: true}).exec()
    }

    this.fetchByType = (type) => {
      return ContactModel.find(type).exec()
    }
  }
}


function userModel(dbNm, collectionNm) {
  const db  = mongoose.createConnection(dbURI)
  const db2 = db.useDb(dbNm)
  db2.model('ContactSchema', ContactSchema, 'contacts')
  return db2.model('Usr', UserSchema, collectionNm)
}

function contactModel(dbNm, collectionNm) {
  const db  = mongoose.createConnection(dbURI)
  const db2 = db.useDb(dbNm)
  return db2.model('ContactSchema', ContactSchema, collectionNm)
}

module.exports = { Auth, Contact, Site, User }
