// import Site as SiteModel from './model/site'
const ContactSchema = require('./model/contact-schema')
const SiteModel = require('./model/site')
const UserSchema = require('./model/user-schema')
const mongoose = require('mongoose')

const dbURI = 'mongodb://localhost'

const CONTACT_COL = 'contacts'


class Site {
  constructor() {

    this.findSite = (name) => {
      const site = SiteModel.findOne({ name }, (error, data) => {
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
      const { site, user } = fields
      const um = userModel(site.dbNm, site.collectionNm)
      const ct = contactModel(site.dbNm, CONTACT_COL)
      let contact = new ct(user.contact)
      contact.email = user.email
      return contact.save().then(contact => {
        user.contact = contact._id
        return new um(user).save()
      })
    }

    this.update = (fields) => {
      const { site, user } = fields
      const um = userModel(site.dbNm, site.collectionNm)
      const ct = contactModel(site.dbNm, CONTACT_COL)
      const contact = user.contact
      delete user.contact
      return um.findByIdAndUpdate(user._id, user).exec().then(userRes => {
        return ct.findByIdAndUpdate(contact._id, contact).exec()
      })
    }

    this.fetchUserByEmail = (fields) => {
      const { email, doc } = fields
      const um = userModel(doc.dbNm, doc.collectionNm)
      return um.findOne({email}).exec()
    }

    this.fetchUsersByDomain = (fields) => {
      const { doc } = fields
      const ct = contactModel(doc.dbNm, CONTACT_COL)
      const um = userModel(doc.dbNm, doc.collectionNm)
      return um.find().populate('contact').sort({email: 1}).exec()
    }

    this.remove = (_id, domainID) => {
      return SiteModel.findById(domainID).exec().then(site => {
        const ct = contactModel(site.dbNm, CONTACT_COL)
        const um = userModel(site.dbNm, site.collectionNm)
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

module.exports = { Contact, Site, User }
