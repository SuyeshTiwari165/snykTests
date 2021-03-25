import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
query getCients($partnerId: Int!
  $orderBy: String
  ){
  getClient (orderBy: [$orderBy],partnerId:$partnerId){
    edges{
      node{
        emailId
        partnerId
        mobileNumber
        createdDate
        address
        id
        clientName
        mailSend
      }
    }
  }
}
`;

export const GET_CLIENT = gql`
query getClient(
  $clientName: String!
  $orderBy: String
  ) {
  getClient(clientName: $clientName,orderBy: [$orderBy]) {
    edges {
      node {
        id
        clientName
        createdDate
        emailId
        mobileNumber
        mailSend
      }
    }
  }
}
`;
