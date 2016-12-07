
// let siteID
// Create site
export const siteFields = {
  active: false,
  credentials:{
    password: 'password',
    username: 'email'
  },
  collections:{
    contact: 'cc',
    user: 'uu'
  },
  dbNm: 'db-test',
  domainID: 'ca.test.zz',
  name: 'AZ',
  pemFiles:{
    private: 'ff',
    public: 'ff'
  },
  resetURI: 'rr',
  roles:[
    {id: 'supervisor',label: 'Supervisor'},
    {id: 'admin',label: 'Administrator'}
  ],
  signingMethod: 'RSA'
}

export const createSite = {
  "query":`mutation createSite($fields: SiteInput!) {
    createSite(input: $fields) {
      _id
      active
      credentials {
        password
        username
      }
      collections {
        contact
        user
      }
      dbNm
      domainID
      name
      pemFiles {
        private
        public
      }
      resetURI
      roles {
        id
        label
      }
      signingMethod
      }
    }`,
    "variables":{
      "fields": siteFields
    },
    "operationName":"createSite"
  }



// Update site

export const updateSite = {
  "query":`mutation updateSite($_id: ID!, $fields: SiteInput!) {
    updateSite(_id: $_id, input: $fields) {
      _id
      active
      credentials {
        password
        username
      }
      collections {
        contact
        user
      }
      dbNm
      domainID
      name
      pemFiles {
        private
        public
      }
      resetURI
      roles {
        id
        label
      }
      signingMethod
      }
    }`,
    "variables":{
      "_id": siteFields._id,
      "fields": siteFields
    },
    "operationName":"updateSite"
  }

export const siteQuery = {
  "query":`query fetchSites {
    fetchSites {
      _id
      active
      credentials {
        password
        username
      }
      collections {
        contact
        user
      }
      dbNm
      domainID
      name
      pemFiles {
        private
        public
      }
      resetURI
      roles {
        id
        label
      }
      signingMethod
    }
  }`,
  "operationName":"fetchSites"
}

export const removeSite = {
  "query": `mutation removeSite($_id: ID!) {
    removeSite(_id: $_id) {
      ok
      n
    }
  }`,
  variables: {
    "_id": siteFields._id
  },
  "operationName":"removeSite"
}


export const userFields = {
  active: false,
  domainID: null,
  email: 'test@example.com',
  contact:{
    name:{
      first: 'Test',
      last: 'Dummie'
    }
  },
  password:null,
  scope:[],
}

export const fetchUserQuery = {
  "query": `query fetchUser($domainID: ID, $email:String) {
    fetchUser(domainID:$domainID, email:$email) {
      _id
      active
      contact {
        _id
        email
        name {
          first
          last
        }
      }
      email
      scope {
        id
        label
      }
    }
  }`,
  variables: {
    email: userFields.email,
    domainID: userFields.domainID
  },
  operationName: 'fetchUser',
}

export const fetchUsersQuery = {
  "query": `query fetchUsers($domainID: ID) {
    fetchUsers(domainID: $domainID) {
      _id
      active
      contact {
        _id
        email
        name {
          first
          last
        }
      }
      email
      scope {
        id
        label
      }
    }
  }`,
  variables: {
    domainID: null,
  },
  "operationName":"fetchUsers"
}

export const createUser = {
  "query":`mutation createUser($fields: UserInput!) {
    createUser(input: $fields) {
      _id
      active
      contact {
        _id
        email
        name {
          first
          last
        }
      }
      email
      scope {
        id
        label
      }
    }
  }`,
  variables:{
    fields: userFields
  },
  operationName: 'createUser'
}

export const updateUser = {
  "query":`mutation updateUser($fields: UserInput!) {
    updateUser(input: $fields) {
      _id
      active
      contact {
        _id
        email
        name {
          first
          last
        }
      }
      email
      scope {
        id
        label
      }
    }
  }`,
  "variables":{
    "fields": userFields,
    _id: userFields._id
  },
  "operationName":"updateUser"
}

export const removeUser = {
  "query": `mutation removeUser($_id: ID!, $domainID: ID!) {
    removeUser(_id: $_id, domainID: $domainID) {
      ok
      n
    }
  }`,
  variables: {
    _id: userFields._id,
    domainID: userFields.domainID
  },
  "operationName":"removeUser"
}



