import { gql } from '@apollo/client';

export const GET_PARTNER = gql`
query getPartnerusers($orderBy: String) {
  getPartner (orderBy: [$orderBy]) {
    edges {
      node {
        id
        partnerName
        emailId
        mobileNumber
        createdDate
        address
      }
    }
  }
}
`;