import { gql } from "@apollo/client";

export const GET_TARGET = gql`
query getTarget($targetName: String, $host: String) {
  getTarget(targetName: $targetName, host_Icontains: $host) {
    edges {
      node {
        id
        targetName
        vatTargetId
        partner {
          id
          partnerName
        }
        client {
          id
          clientName
        }
        host
        vatCredentials {
          id
          vpnUsername
          domainUsername
          vpnPassword
          domainPassword
        }
      }
    }
  }
}
`;
export const GET_TARGET_ADMIN = gql `
query getTarget ($partnerName : String,$clientName : String ) {
  getTarget(partner_PartnerName:$partnerName,client_ClientName : $clientName){
    edges{
      node{
        vatTargetId
        targetName
      }
    }
  }
}
`