import { gql } from '@apollo/client';
// From Admin
export const GET_PARTNER_USER = gql`
query getPartnerUserDetails($partner: String!, $userType: String, $orderBy: String) {
  getPartnerUserDetails(partnerId_PartnerName: $partner, userType: $userType, orderBy: [$orderBy]) {
    edges {
      node {
        id
        partnerId {
          id
          partnerName
          subscription
          pg360PartnerId
        }
        clientId {
          id
          clientName
        }
        userId {
          id
          username
          dateJoined
          firstName
          lastName
        }
        userType
        mobileNumber
        vatUserId
      }
    }
  }
}

`;
// To Display all partner users Count
export const GET_PARTNER_USERS= gql`
query getPartnerUserDetails {
  getPartnerUserDetails(userType: "Partner") {
    edges {
      node {
        id
        partnerId {
          id
          partnerName
          subscription
        }
        userId {
          username
          dateJoined
          firstName
          lastName
        }
        userType
        mobileNumber
        vatUserId
      }
    }
  }
}
`;

export const GET_PARTNER_USERDETAILS = gql`
query getUserDetails($userid: String!) {
  getUserDetails(username: $userid) {
    edges {
      node {
        id
        firstName
        lastName
        dateJoined
        username
        email
      }
    }
  }
}
`;


export const GET_PARTNER_ID_USER = gql`
query getPartnerUserDetails($userId: String!){
  getPartnerUserDetails(userId_Username:$userId){
    edges{
      node{
        id
        partnerId{
          id
         partnerName
        subscription
        }
        userId{
          email
          id
          username
          firstName
          lastName
        }
        userType
        mobileNumber
        vatUserId
      }
    }

  }
}
`;
