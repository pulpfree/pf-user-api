import { isAuthenticatedResolver } from '../lib/baseResolvers'

export const fetchUsers = isAuthenticatedResolver.createResolver(
  async (_, { domainID, email }, ctx) => {
    const site = new ctx.constructor.Site()
    const user = new ctx.constructor.User()

    return await site.findSiteById(domainID).then(siteDoc => {
      return user.fetchUsersByDomain({siteDoc})
    })
  }
)

export const fetchUser = isAuthenticatedResolver.createResolver(
  async (_, { domainID, email }, ctx) => {
    const site = new ctx.constructor.Site()
    const user = new ctx.constructor.User()
    return await site.findSiteById(domainID).then(siteDoc => {
      return user.fetchUserByEmail({email, siteDoc})
    })
  }
)