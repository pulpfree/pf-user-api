const constants = require('../config/constants')
const rp = require('request-promise')

export default class Auth {
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