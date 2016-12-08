const SiteModel = require('../model/site')

export default class Site {
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