import { gql } from "@apollo/client";

export const GET_REPORT_LISTING = gql`
  query getReportStatus(
    $clientname: String!
    $targetid: String
    $status: String
    $publishflag : String
    $reportCreationFlag: String,
    ) {
    getReportStatus(
      clientId_ClientName: $clientname, 
      vatTargetId_TargetName: $targetid, 
      scanRunStatus: $status,
      vatTargetId_PublishedFlag: $publishflag
      reportCreationFlag: $reportCreationFlag,
    ) {
      edges {
        node {
          vatTargetId {
            id
            targetName
            vatTargetId
            publishedFlag
            host
            scanType
          }
          vatTaskId {
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
  query getReportStatus(
    $orderBy: String
    $partnername: String
    $clientname: String
    $targetid: String
    $status: String
    $scanStartDate: DateTime
    $scanEndDate: DateTime
    $targetstatus : String
    $taskname : String
  ) {
    getReportStatus(
      orderBy: [$orderBy]
      partnerId_PartnerName: $partnername
      clientId_ClientName: $clientname
      vatTargetId_TargetName: $targetid
      scanRunStatus: $status
      scanStartDate_Gte: $scanStartDate
      scanEndDate_Lte: $scanEndDate
      vatTargetId_TargetStatus_Name:$targetstatus
      vatTaskId_TaskName :$taskname
    ) {
      edges {
        node {
          vatTargetId {
            id
            targetName
            vatTargetId
            publishedFlag
            host
            client {
              clientName
              id
            }
            partner {
              id
              partnerName
            }
            targetStatus{
              id
              name
            }
          }
          vatTaskId {
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

export const GET_REPORT_LISTING_STATUS = gql`
  query getTargetStatus($clientname: String) {
    getTargetStatus(clientName: $clientname) {
      clientName
      clientId
      targetName
      targetId
      host
      startDate
      reportCreationDate
      scanType
      status
      publishedFlag
      clientType
      external
      pentest
    }
  }
`;
export const GET_TARGET_STATUS_BY_TYPE = gql`
query getTarget($client_name:String,$client_type:String,$scan_type:String){
  getTarget(client_ClientName:$client_name,
    client_ClientType:$client_type,scanType:$scan_type)
  {
    edges{
      node{
        vatTargetId
        id
        publishedFlag
        targetName
        host
        targetStatus{
          id
          name
        }
        scanType
        client{
          id
          clientName

        }
      }
    }
  }
}
`;