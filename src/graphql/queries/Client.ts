import { gql } from "@apollo/client";

export const GET_CLIENT = gql`
query{
  getClient{
    edges{
      node{
        emailId
        partnerId
        mobileNumber
        address
        ipRange
        pgClientId
        clientName
      }
    }
  }
}
`;
