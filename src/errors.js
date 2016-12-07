import { createError } from 'apollo-errors'

export const FooError = createError('FooError', {
  message: 'A foo error has occurred'
})

export const AlreadyAuthenticatedError = createError('FooError', {
  message: 'AlreadyAuthenticatedError error has occurred'
})

export const NotAuthenticatedError = createError('NotAuthenticated', {
  message: 'NotAuthenticated error has occurred'
})

export const NotAuthorizedError = createError('NotAuthorized', {
  message: 'NotAuthorizedError error has occurred'
})