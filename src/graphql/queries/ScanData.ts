import { gql } from "@apollo/client";

export const GET_SCANDATA = gql`
query{
  getScandata{
    edges{
      node{
        vatScannerId
        name
        id
        partnerId
        clientId
      }
    }
  }
}
`;
