const typeDefinitions = `

type Site {
  _id: String
  active: Boolean
  credentialKeyPassword: String!
  credentialKeyUsername: String!
  collectionNm: String!
  dbNm: String!
  domain: String!
  name: String!
  resetURI: String!
}

type User {
  _id: String
  active: Boolean
  email: String
  password: String
  scope: String
  scopeBits: Int
}

type RootQuery {

  fetchSites(
    active: Boolean
    domain: String
    name: String
  ): [Site]

  fetchSiteById(
    _id: String
  ): Site

  fetchUser(
    domainID: String
    email: String
  ): User

  fetchUsers(
    domainID: String
  ): [User]
}

type RootMutation {

  createSite(
    collectionNm: String!
    credentialKeyPassword: String!
    credentialKeyUsername: String!
    dbNm: String!
    domain: String!
    name: String!
    resetURI: String!
  ): Site

  updateSite(
    _id: String
    active: Boolean
    collectionNm: String
    credentialKeyPassword: String
    credentialKeyUsername: String
    dbNm: String
    domain: String
    name: String
    resetURI: String
    # credentialKeys: CredentialKeys
  ): Site

  createUser(
    active: Boolean
    domainID: String!
    email: String!
    password: String!
    scope: [String]
  ): User

  updateUser(
    domainID: String!
    userID: String!
    active: Boolean
    email: String
    password: String
    scope: String
  ): User
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`;

module.exports = [typeDefinitions]
