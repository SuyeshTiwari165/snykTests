import { gql } from "@apollo/client";

export const GET_TARGET = gql`
query getTarget($targetName: String) {
  getCredentialsDetails(vatTarget_TargetName: $targetName) {
    edges {
      node {
        Partner {
          id
          partnerName
        }
        client {
          id
          clientName
        }
        vatTarget {
          id
          targetName
          host
        }
        domainUsername
        domainPassword
        vpnUsername
        vpnPassword
        linuxIpAddress
        winIpAddress
        winUsername
        winPassword
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