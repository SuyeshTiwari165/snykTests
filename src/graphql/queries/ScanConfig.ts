import { gql } from "@apollo/client";

export const GET_SCAN_CONFIG  = gql`
query getScanConfigurationdata($clientId: Int){
  getScanConfigurationdata(clientId:$clientId){
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
