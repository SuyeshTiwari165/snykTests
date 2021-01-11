import { gql } from "@apollo/client";

export const GET_REPORT_LISTING = gql`
query getReportStatus($clientid:Int!,$targetid:String){
  getReportStatus(clientId:$clientid,vatTargetId_TargetName:$targetid){
    edges{
      node{
        partnerId
        clientId
        vatTargetId{
          id
          targetName
          vatTargetId
        }
        vatTaskId{
          id
          vatTaskId
          taskName
        }
        scanStartDate
        scanEndDate
        scanRunStatus
      }
    }
  }
}
`;
export const GET_ADMIN_REPORT_LISTING = gql`
query getReportStatus{
  getReportStatus {
    edges{
      node{
        partnerId
        clientId
        vatTargetId{
          id
          targetName
          vatTargetId
        }
        vatTaskId{
          id
          vatTaskId
          taskName
        }
        scanStartDate
        scanEndDate
        scanRunStatus
      }
    }
  }
}
`;