import { isAuthenticatedResolver, isNotAuthenticatedResolver } from '../lib/baseResolvers'

export const authUser = isNotAuthenticatedResolver.createResolver(
  async (_, { input }, ctx) => {
    const auth = new ctx.constructor.Auth()
    const res = await auth.authUser(input)
    // ctx.user = res
    // console.log('res:', res)
    return res
  }
)

export const authLogoutUser = isNotAuthenticatedResolver.createResolver(
  async (_, { _id }, ctx) => {
    // console.log('_id:', _id)
    // ctx.user = null
    ctx.auth.isAuthenticated = false
    // console.log('ctx authLogoutUser:', ctx)
    return await { ok: 1, n: 1 }
    // const auth = new ctx.constructor.Auth()
    // return auth.authLogoutUser(_id)
  }
)

export const authValidate = isNotAuthenticatedResolver.createResolver(
  async (_, { input }, ctx) => {
    const auth = new ctx.constructor.Auth()
    return await auth.authValidate(input)
  }
)

export const authResetPasswd = isNotAuthenticatedResolver.createResolver(
  async (_, { input }, ctx) => {
    const auth = new ctx.constructor.Auth()
    return await auth.authReset(input)
  }
)

export const authResetToken = isNotAuthenticatedResolver.createResolver(
  async (_, { input }, ctx) => {
    const auth = new ctx.constructor.Auth()
    return await auth.authResetToken(input)
  }
)