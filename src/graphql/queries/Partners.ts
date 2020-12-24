import { gql } from '@apollo/client';

export const GET_PARTNER = gql`
query getPartnerusers {
  getPartner {
    edges {
      node {
        id
        partnerName
        emailId
        mobileNumber
        address
      }
    }
  }
}
`;