const typeDefinitions = `

type Site {
  _id: String
  active: Boolean
  createdAt: String
  credentialKeyPassword: String
  credentialKeyUsername: String
  collectionNm: String
  dbNm: String
  domain: String
  name: String
  pemFilePrivate: String
  pemFilePublic: String
  resetURI: String
  roles: [SiteRole]
  signingMethod: String
  updatedAt: String
}

type SiteRole {
  id: String!
  label: String!
}

input SiteInput {
  _id: ID
  active: Boolean
  credentialKeyPassword: String!
  credentialKeyUsername: String!
  collectionNm: String!
  dbNm: String!
  domain: String!
  name: String!
  pemFilePrivate: String
  pemFilePublic: String
  resetURI: String!
  roles: [RoleInput]
  signingMethod: String!
}

input RoleInput {
  id: String!
  label: String!
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

type RootQuery {

  fetchSites(
    active: Boolean
    domain: String
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

}

schema {
  query: RootQuery
  mutation: RootMutation
}
`;

module.exports = [typeDefinitions]
