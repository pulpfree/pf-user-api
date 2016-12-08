
import { isAuthenticatedResolver } from '../lib/baseResolvers'

export const fetchSites = isAuthenticatedResolver.createResolver(
  async (_, { ...params}, ctx) => {
    const site = new ctx.constructor.Site()
    return await site.find(params)
  }
)

export const fetchSiteById = isAuthenticatedResolver.createResolver(
  async (_, { _id }, ctx) => {
    if (!_id) return {}
    const site = new ctx.constructor.Site()
    return await site.findSiteById(_id)
  }
)