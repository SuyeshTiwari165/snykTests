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

export const CREATE_CONTACT = gql`
  mutation CreateContact (
    $name: String!,
    $email: String!,
    $phone: String!,
    $contact_type: String!
    $user_id: ID!
    ) {
      createContact (input: {
        data: {
          name: $name
          email: $email
          phone: $phone
          contact_type: $contact_type
          user_id: $user_id
        }
      }) {
        contact {
          id
          name
          email
          phone
          contact_type
        }
      }
    }
`;

export const CREATE_INDIVIDUAL = gql`
  mutation CreateIndividual (
    $first_name: String!
    $last_name: String!
    $contact_id: ID!
    ) {
      createIndividual(input: {
        data : {
          first_name: $first_name
          last_name: $last_name
          contact_id: $contact_id
        }
      }) {
        individual {
          id
          first_name
          last_name
        }
      }
    }
`;