import { gql } from '@apollo/client';

export const GET_PARTNER_USER = gql`
query getPartnerUserDetails($partner: Int!,$userType:String,$orderBy : String) {
  getPartnerUserDetails(partnerId: $partner,userType:$userType, orderBy: [$orderBy]) {
    edges {
      node {
        id
        partnerId
        clientId
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
export const GET_PARTNER_USERS= gql`
query getPartnerUserDetails {
  getPartnerUserDetails {
    edges {
      node {
        id
        partnerId
        clientId
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
        partnerId
        clientId
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
