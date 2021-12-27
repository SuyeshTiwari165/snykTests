import { gql } from "@apollo/client";

export const GET_SCAN_CONFIG = gql`
  query getScanConfigurationdata {
    getScanConfigurationdata {
      edges {
        node {
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
