const ContactSchema = require('./model/contact-schema')

export default class Contact {
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