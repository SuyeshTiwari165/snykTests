import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser (
    $username: String!,
    $email: String!,
    $password: String!,
    $role: ID!
    $confirmed: Boolean!
    ) {
      createUser (input: {
        data: {
          username: $username
          email: $email
          password: $password
          role: $role
          confirmed: $confirmed
        }
      }) {
        user {
          id
          username
          email
        }
      }
    }
`;

export const USER_LOGIN = gql`
mutation TokenAuth($username: String!, $password: String!) {
  tokenAuth(username: $username, password: $password) {
    token
    payload
    refreshExpiresIn
  }
}

`;
export const UPDATE_USER = gql`
mutation (
  $id :ID!,
  $username: String!,
  $email: String!,
  $password: String,
  $role: ID!
  $confirmed: Boolean!
){
  updateUser
  (input: {where: {id: $id},
   data:
    {
    username: $username,
    email:  $email,
    password: $password,
    confirmed: $confirmed,
    role: $role
    }
  }) {
    user {
      id
      username
      email
    }
  }
}
`