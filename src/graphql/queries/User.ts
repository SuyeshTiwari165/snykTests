import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query{
    users {
      id
      username
    }
  }
`;

export const GET_USER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      id
      role {
        id
        name
      }
      email
      username
    }
  }
`;

export const GET_ROLE = gql`
  query getRoles {
    roles {
      id
      name
    }
  }
`; 

export const GET_ADMIN_USER = gql`
query getUserDetails($userid: String!) {
  getUserDetails(username: $userid) {
    edges {
      node {
        firstName
        lastName
        username
        isSuperuser
      }
    }
  }
}

`;

export const GET_ROLE_BASED_USER = gql `
query getRoleBasedUser($where: JSON) {
  users(where: $where) {
    id
    email
    role {
      name
      id
      type
    }
  }
}
`
