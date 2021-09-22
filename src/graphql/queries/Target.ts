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
	  vpnFilePath
        }
        domainUsername
        domainPassword
        vpnUsername
        vpnPassword
        linuxIpAddress
        winIpAddress
        winUsername
        winPassword
        winName
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
export const GET_VPN_CONNECTED_CLIENTS = gql `
query ($vpnConnectFlag : String){
  getTarget(vpnConnectFlag: $vpnConnectFlag){
    edges{
      node{
        vatTargetId
        targetName
        client{
          clientName
          id
          vpnConnectFlag
        }
        vpnConnectFlag
      }
    }
  }
}
`

export const GET_PROSPECT_CLIENTS = gql `
query getTarget($partner_name:String,$client_type:String){
  getTarget(partner_PartnerName:$partner_name,
    client_ClientType:$client_type)
  {
    edges{
      node{
        id
        targetName
        publishedFlag
        targetStatus{
          id
          name
        }
        scanType
        client{
          id
          clientName
          clientType
        }
      }
    }
  }
}
`