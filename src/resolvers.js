const resolveFunctions = {
  RootQuery: {
    fetchSites(_, {...params}, ctx) {
      const site = new ctx.constructor.Site()
      return site.find(params)
    },
    fetchSiteById(_, _id, ctx) {
      const site = new ctx.constructor.Site()
      return site.findSiteById(_id)
    },
    fetchUser(_, {domainID, email}, ctx) {
      const site = new ctx.constructor.Site()
      const user = new ctx.constructor.User()
      return site.findSiteById(domainID).then(doc => {
        return user.fetchUserByEmail({email, doc})
      })
    },
    fetchUsers(_, {domainID, email}, ctx) {
      const site = new ctx.constructor.Site()
      const user = new ctx.constructor.User()
      return site.findSiteById(domainID).then(doc => {
        return user.fetchUsersByDomain({doc})
      })
    }
  },
  RootMutation: {
    createSite(_, { ...siteArgs }, ctx) {
      console.log('siteArgs:', siteArgs)
      const site = new ctx.constructor.Site()
      return site.create(siteArgs)
    },
    updateSite(root, { _id, ...siteArgs }, ctx) {
      const site = new ctx.constructor.Site()
      return site.update(_id, siteArgs)
    },
    createUser(_, {active, email, domainID, password, scope}, ctx) {
      const site = new ctx.constructor.Site()
      const user = new ctx.constructor.User()
      const userFields = {active, email, password, scope}
      return site.findSiteById(domainID).then(doc => {
        return user.create({doc, user: userFields})
      })
    },
    updateUser(_, { domainID, userID, ...userArgs}, ctx) {
      const site = new ctx.constructor.Site()
      const user = new ctx.constructor.User()
      return site.findSiteById(domainID).then(doc => {
        return user.update({doc, userID, user: userArgs})
      })
    }
  },

}

module.exports = resolveFunctions;