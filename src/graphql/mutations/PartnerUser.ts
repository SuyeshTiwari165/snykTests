import { gql } from "@apollo/client";

export const CREATE_PARTNER_USER = gql`
mutation createUser($input: UserInput!) {
  createUser(input: $input) {
    userField {
      firstName
      lastName
      username
    }
  }
}

`;

export const UPDATE_PARTNER_USER = gql`
mutation updateUser($id: Int, $userdata: UserInput!) {
  updateUser(id: $id, input: $userdata) {
    userField {
      firstName
      lastName
      username
    }
  }
}

`;


