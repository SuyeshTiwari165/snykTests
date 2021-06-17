import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
query getCients($partnerId_PartnerName:String
  $orderBy: String
  ){
  getClient (orderBy: [$orderBy],partner_PartnerName:$partnerId_PartnerName){
    edges{
      node{
        emailId
        mobileNumber
        createdDate
        address
        id
        clientName
        mailSend
        subscription
        partner {
          id
          partnerName
        }
      }
    }
  }
}
`;

export const GET_CLIENT = gql`
query getClient(
  $clientName: String!
  $orderBy: String
  ) {
  getClient(clientName: $clientName,orderBy: [$orderBy]) {
    edges {
      node {
        id
        clientName
        createdDate
        emailId
        mobileNumber
        mailSend
      }
    }
  }
}
`;
export const GET_CLIENT_AND_LATEST_REPORTS = gql`
query reportForPg($partnerId:Int!,$pageNumber:Int,$page_size:Int){
   reportForPg(partnerId:$partnerId,pageNumber:$pageNumber,pageSize:$page_size){
  page
    pageSize
    totalRecords
    data{
      clientName
      clientId
      email
      targetName
      targetId
      status
      targetCreationDate
    }
  }}
  `;