import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
query getCients($partnerId_PartnerName:String
  $orderBy: String
  ){
  getClient (orderBy: [$orderBy],partner_PartnerName:$partnerId_PartnerName){
    edges{
      node{
        emailId
        mobileNumber
        createdDate
        address
        id
        clientName
        mailSend
        partner {
          id
          partnerName
        }
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
