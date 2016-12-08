import { isAuthenticatedResolver } from '../lib/baseResolvers'

export const createSite = isAuthenticatedResolver.createResolver(
  async (_, { input }, ctx) => {
    const site = new ctx.constructor.Site()
    return await site.create(input)
  }
)

export const updateSite = isAuthenticatedResolver.createResolver(
  async (_, { _id, input }, ctx) => {
    const site = new ctx.constructor.Site()
    return site.update(_id, input)
  }
)

export const removeSite = isAuthenticatedResolver.createResolver(
  async (_, { _id }, ctx) => {
    const site = new ctx.constructor.Site()
    let ret = await site.remove(_id)
    return ret.then(res => {
      return res.result
    })
  }
)