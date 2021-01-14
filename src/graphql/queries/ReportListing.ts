import { gql } from "@apollo/client";

export const GET_REPORT_LISTING = gql`
  query getReportStatus($clientid: ID!, $targetid: String) {
    getReportStatus(clientId: $clientid, vatTargetId_TargetName: $targetid) {
      edges {
        node {
          vatTargetId {
            id
            targetName
            vatTargetId
            publishedFlag
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
    $partnername: String
    $clientname: String
    $targetid: String
    $status: String
    $scanStartDate: DateTime
    $scanEndDate: DateTime
  ) {
    getReportStatus(
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
