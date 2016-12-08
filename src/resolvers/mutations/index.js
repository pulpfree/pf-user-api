import * as auth from './auth'
import * as site from './site'
import * as user from './user'

export default {
  ...auth,
  ...site,
  ...user
}