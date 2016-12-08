import { isAuthenticatedResolver } from '../lib/baseResolvers'

export const createUser = isAuthenticatedResolver.createResolver(
  async (_, { input }, ctx) => {
    const site = new ctx.constructor.Site()
    const user = new ctx.constructor.User()
    return await site.findSiteById(input.domainID).then(siteDoc => {
      return user.create({siteDoc, user: input})
    })
  }
)

export const updateUser = isAuthenticatedResolver.createResolver(
  async (_, { input }, ctx) => {
    const site = new ctx.constructor.Site()
    const user = new ctx.constructor.User()
    return await site.findSiteById(input.domainID).then(siteDoc => {
      return user.update({siteDoc, user: input})
    })
  }
)

export const removeUser = isAuthenticatedResolver.createResolver(
  async (_, { _id, domainID }, ctx) => {
    const usr = new ctx.constructor.User()
    let ret = await usr.remove(_id, domainID)
    return ret.then(res => {
      return res.result
    })
  }
)