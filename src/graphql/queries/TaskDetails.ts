import { gql } from "@apollo/client";

export const GET_TASK_DETAILS = gql`
query getTask($taskName: String, $targetName: String, $clientName:String) {
  getTask(taskName_Icontains: $taskName, vatTarget_TargetName: $targetName, client_ClientName:$clientName) {
    edges {
      node {
        id
        taskName
        vatTaskId
        vatScanConfigList
        partner {
          id
          partnerName
        }
        client {
          id
          clientName
        }
        vatTarget {
          id
          vatTargetId
          targetName
        }
        vatScanConfig {
          vatScanConfigId
          scanConfigName
        }
        vatScanner {
          vatScannerId
          name
        }
        scheduleDate
      }
    }
  }
}

`;