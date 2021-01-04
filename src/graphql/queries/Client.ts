import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
query getCients($partnerId: Int!){
  getClient (partnerId:$partnerId){
    edges{
      node{
        emailId
        partnerId
        mobileNumber
        address
        id
        clientName
      }
    }
  }
}
`;

export const GET_CLIENT = gql`
query getClient($clientName: String!) {
  getClient(clientName: $clientName) {
    edges {
      node {
        id
        clientName
        emailId
        mobileNumber
      }
    }
  }
}
`;
