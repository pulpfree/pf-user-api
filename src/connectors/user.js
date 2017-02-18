const SiteModel = require('../model/site')
const UserSchema = require('../model/user-schema')
import { userModel, contactModel } from './lib/utils'

export default class User {
  constructor() {

    this.create = (fields) => {
      const { siteDoc, user } = fields
      const um = userModel(siteDoc.dbNm, siteDoc.collections.user)
      const ct = contactModel(siteDoc.dbNm, siteDoc.collections.contact)
      // _id is populated upstream in reducer and needs to be removed
      // in order to create actual record id
      delete user.contact._id
      let contact = new ct(user.contact)
      contact.email = user.email
      return contact.save().then(cont => {
        user.contact = cont._id
        return new um(user).save()
      })
    }

    this.update = (fields) => {
      const { siteDoc, user } = fields
      const um = userModel(siteDoc.dbNm, siteDoc.collections.user)
      const ct = contactModel(siteDoc.dbNm, siteDoc.collections.contact)
      const contact = user.contact
      delete user.contact

      if (user.password && user.password.length > 0) {
        user.password = um.hashPassword(user.password)
      } else {
        delete user.password
      }
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