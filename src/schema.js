const typeDefinitions = `

type Site {
  _id: String
  active: Boolean
  createdAt: String
  credentials: SiteCredentials
  collections: SiteCollections
  dbNm: String
  domainID: String
  name: String
  pemFiles: SitePemFiles
  resetURI: String
  roles: [SiteRole]
  signingMethod: String
  updatedAt: String
}

type SiteCredentials {
  password: String
  username: String
}

type SiteCollections {
  contact: String
  user: String
}

type SitePemFiles {
  private: String
  public: String
}

type SiteRole {
  id: String!
  label: String!
}

input SiteInput {
  _id: ID
  active: Boolean
  credentials: CredentialsInput!
  collections: CollectionsInput!
  dbNm: String!
  domainID: String!
  name: String!
  pemFiles: PemFilesInput
  resetURI: String!
  roles: [RoleInput]
  signingMethod: String!
}

input RoleInput {
  id: String!
  label: String!
}

input CredentialsInput {
  password: String!
  username: String!
}

input CollectionsInput {
  contact: String!
  user: String!
}

input PemFilesInput {
  private: String
  public: String
}

type UserContactName {
  first: String
  last: String
}

type UserContact {
  _id: ID
  email: String
  name: UserContactName
}

type UserScope {
  id: String
  label: String
}

type User {
  _id: String
  active: Boolean
  contact: UserContact
  email: String
  password: String
  scope: [UserScope]
  scopeBits: Int
}

input UserContactInput {
  _id: ID
  email: String
  name: UserContactNameInput
}

input UserContactNameInput {
  first: String
  last: String
}

input UserScopeInput {
  id: String
  label: String
}

input UserInput {
  _id: ID
  active: Boolean
  contact: UserContactInput
  domainID: ID!
  email: String!
  password: String
  scope: [UserScopeInput]
  scopeBits: Int
}

type RemoveResult {
  ok: Int
  n: Int
}

input AuthInput {
  email: String!
  password: String!
  domainID: String!
}

type AuthResult {
  id: ID
  contact: UserContactName
  email: String
  scope: [UserScope]
  token: String
}

input AuthValidateInput {
  domainID: ID
  token: String
}

type AuthValidateResult {
  exp: Int
  iat: Int
  iss: String
  jti: String
}

input AuthResetPasswdInput {
  domainID: ID
  email: String
}

type AuthResetPasswdResult {
  ok: Boolean
  result: String
}

input AuthResetTokenInput {
  domainID: ID
  email: String
  password: String
  resetToken: String
}

type AuthResetTokenResult {
  id: ID
  contact: UserContactName
  email: String
  scope: [UserScope]
  scopeBits: Int
  token: String
}

type RootQuery {

  fetchSites(
    active: Boolean
    domainID: String
    name: String
  ): [Site]

  fetchSiteById(
    _id: ID
    roles: [RoleInput]
  ): Site

  fetchUser(
    domainID: ID
    email: String
  ): User

  fetchUsers(
    domainID: ID
  ): [User]

}

type RootMutation {

  createSite(input:SiteInput): Site

  updateSite(
    _id: ID!
    input: SiteInput
  ): Site

  removeSite(_id:ID!): RemoveResult

  createUser(input:UserInput): User

  updateUser(
    input: UserInput!
  ): User

  removeUser(_id:ID!, domainID:ID!): RemoveResult

  authUser(input:AuthInput): AuthResult

  authLogoutUser(_id:ID): RemoveResult

  authValidate(input:AuthValidateInput): AuthValidateResult

  authResetPasswd (input:AuthResetPasswdInput): AuthResetPasswdResult

  authResetToken (input:AuthResetTokenInput): AuthResetTokenResult

}

schema {
  query: RootQuery
  mutation: RootMutation
}
`;

module.exports = [typeDefinitions]
