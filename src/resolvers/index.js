import queries from './queries'
import mutations from './mutations'

const resolveFunctions = {
  RootQuery: {
    ...queries
  },
  RootMutation: {
    ...mutations
  }
}

module.exports = resolveFunctions