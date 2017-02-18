import { AlreadyAuthenticatedError, NotAuthenticatedError, NotAuthorizedError } from './errors'

import createResolver from '../lib/createResolver';

export const baseResolver = createResolver();

export const isAuthenticatedResolver = baseResolver.createResolver(
  (root, args, context) => {
    // console.log('context.auth in isAuth:', context.auth)
    if (!context.auth.isAuthenticated) throw new NotAuthenticatedError
  }
)

export const isNotAuthenticatedResolver = baseResolver.createResolver(
  (root, args, context) => {
    // console.log('context.auth in isNotAuth:', context.auth)
    // console.log('context in isNotAuthenticatedResolver:', context.auth)
    if (context.auth.isAuthenticated) throw new AlreadyAuthenticatedError()
    // if (context.user && context.user.id) throw new AlreadyAuthenticatedError();
  }
)

/*export const isExpertResolver = isAuthenticatedResolver.createResolver(
  async (root, args, context) => {
    const expert = await context.user.getExpert();

    if (!expert) throw new NotAuthorizedError();

    context.user.Expert = expert;
  }
)*/

/*export const isCustomerResolver = isAuthenticatedResolver.createResolver(
  async (root, args, context) => {
    const customer = await context.user.getCustomer();

    if (!customer) throw new NotAuthorizedError();

    context.user.Customer = customer;
  }
);*/
