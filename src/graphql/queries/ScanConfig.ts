import { gql } from "@apollo/client";

export const GET_SCAN_CONFIG  = gql`
query getScanConfigurationdata($clientId: String){
  getScanConfigurationdata(client_ClientName:$clientId){
    edges{
      node{
        id
        vatScanConfigId
        scanConfigName
        creationTime
        familyCount
        nvtCount
      }
    }
  }
}
`;
