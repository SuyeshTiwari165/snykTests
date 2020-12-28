import { gql } from "@apollo/client";

export const GET_CLIENT = gql`
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
