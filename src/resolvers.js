const resolveFunctions = {
  RootQuery: {
    fetchSites(_, { ...params }, ctx) {
      const site = new ctx.constructor.Site()
      return site.find(params)
    },
    fetchSiteById(_, { _id }, ctx) {
      if (!_id) return {}
      const site = new ctx.constructor.Site()
      return site.findSiteById(_id)
    },
    fetchUser(_, { domainID, email }, ctx) {
      const site = new ctx.constructor.Site()
      const user = new ctx.constructor.User()
      return site.findSiteById(domainID).then(doc => {
        return user.fetchUserByEmail({email, doc})
      })
    },
    fetchUsers(_, { domainID, email }, ctx) {
      if (!domainID) return []
      const site = new ctx.constructor.Site()
      const user = new ctx.constructor.User()
      return site.findSiteById(domainID).then(doc => {
        return user.fetchUsersByDomain({doc})
      })
    },
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
      // input.scope = input.scope.split(',')
      return site.findSiteById(input.domainID).then(site => {
        return user.create({site, user: input})
      })
    },
    updateUser(_, { input }, ctx) {
      const site = new ctx.constructor.Site()
      const user = new ctx.constructor.User()
      return site.findSiteById(input.domainID).then(site => {
        return user.update({site, user: input})
      })
    },
    removeUser(_, { _id, domainID }, ctx) {
      const usr = new ctx.constructor.User()
      let ret = usr.remove(_id, domainID)
      return ret.then(res => {
        return res.result
      })
    },
  },

}

module.exports = resolveFunctions;