import { FooError } from './errors'
import { isAuthenticatedResolver, isNotAuthenticatedResolver } from './lib/baseResolvers'

export const fetchSites = isAuthenticatedResolver.createResolver(
  async (_, { ...params}, ctx) => {
    const site = new ctx.constructor.Site()
    return await site.find(params)
  }
)

export const authUser = isNotAuthenticatedResolver.createResolver(
  async (_, { input }, ctx) => {
    const auth = new ctx.constructor.Auth()
    const res = await auth.authUser(input)
    // ctx.user = res
    // console.log('res:', res)
    return res
  }
)

const resolveFunctions = {
  RootQuery: {
    fetchSites,
    // async fetchSites(_, { ...params }, ctx) {
      /*console.log('ctx:', ctx)
      throw new FooError({
        data: {
          something: 'important'
        }
      })*/
    //   const site = new ctx.constructor.Site()
    //   return await site.find(params)
    // },
    fetchSiteById(_, { _id }, ctx) {
      if (!_id) return {}
      const site = new ctx.constructor.Site()
      return site.findSiteById(_id)
    },
    fetchUser(_, { domainID, email }, ctx) {
      const site = new ctx.constructor.Site()
      const user = new ctx.constructor.User()
      return site.findSiteById(domainID).then(siteDoc => {
        return user.fetchUserByEmail({email, siteDoc})
      })
    },
    fetchUsers(_, { domainID, email }, ctx) {
      const site = new ctx.constructor.Site()
      const user = new ctx.constructor.User()

      return site.findSiteById(domainID).then(siteDoc => {
        return user.fetchUsersByDomain({siteDoc})
      })
    }
  },
  RootMutation: {
    createSite(_, { input }, ctx) {
      const site = new ctx.constructor.Site()
      return site.create(input)
    },
    updateSite(_, { _id, input }, ctx) {
      const site = new ctx.constructor.Site()
      return site.update(_id, input)
    },
    removeSite(_, { _id }, ctx) {
      const site = new ctx.constructor.Site()
      let ret = site.remove(_id)
      return ret.then(res => {
        return res.result
      })
    },
    createUser(_, { input }, ctx) {
      const site = new ctx.constructor.Site()
      const user = new ctx.constructor.User()
      return site.findSiteById(input.domainID).then(siteDoc => {
        return user.create({siteDoc, user: input})
      })
    },
    updateUser(_, { input }, ctx) {
      const site = new ctx.constructor.Site()
      const user = new ctx.constructor.User()
      return site.findSiteById(input.domainID).then(siteDoc => {
        return user.update({siteDoc, user: input})
      })
    },
    removeUser(_, { _id, domainID }, ctx) {
      const usr = new ctx.constructor.User()
      let ret = usr.remove(_id, domainID)
      return ret.then(res => {
        return res.result
      })
    },
    /*authUser(_, { input }, ctx) {
      const auth = new ctx.constructor.Auth()
      return auth.authUser(input)
    },*/
    authUser,
    authLogoutUser(_, { _id }, ctx) {
      // console.log('_id:', _id)
      // ctx.user = null
      ctx.auth.isAuthenticated = false
      // console.log('ctx authLogoutUser:', ctx)
      return { ok: 1, n: 1 }
      // const auth = new ctx.constructor.Auth()
      // return auth.authLogoutUser(_id)
    },
    authValidate(_, { input }, ctx) {
      const auth = new ctx.constructor.Auth()
      return auth.authValidate(input)
    },
    authResetPasswd(_, { input }, ctx) {
      const auth = new ctx.constructor.Auth()
      return auth.authReset(input)
    },
    authResetToken(_, { input }, ctx) {
      const auth = new ctx.constructor.Auth()
      return auth.authResetToken(input)
    }
  },

}

module.exports = resolveFunctions;