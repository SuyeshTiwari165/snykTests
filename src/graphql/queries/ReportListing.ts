import { gql } from "@apollo/client";

export const GET_REPORT_LISTING = gql`
  query getReportStatus(
    $clientname: String!
    $targetid: String
    $status: String
    $publishflag : String
    ) {
    getReportStatus(
      clientId_ClientName: $clientname, 
      vatTargetId_TargetName: $targetid, 
      scanRunStatus: $status,
      vatTargetId_PublishedFlag: $publishflag
    ) {
      edges {
        node {
          vatTargetId {
            id
            targetName
            vatTargetId
            publishedFlag
            host
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
  ) {
    getReportStatus(
      orderBy: [$orderBy]
      partnerId_PartnerName: $partnername
      clientId_ClientName: $clientname
      vatTargetId_TargetName: $targetid
      scanRunStatus: $status
      scanStartDate_Gte: $scanStartDate
      scanEndDate_Lte: $scanEndDate
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
