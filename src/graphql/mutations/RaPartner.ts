import { gql } from "@apollo/client";

export const CREATE_PARTNER = gql`
mutation createPartner($input: PartnerInput!) {
  createPartner(input: $input) {
    partnerFiled {
      partnerName
      emailId
      mobileNumber
      address
    }
  }
}
`;

export const UPDATE_PARTNER = gql`
mutation updatePartner($id: Int, $partnerdata: PartnerInput!) {
  updatePartner(id: $id, input: $partnerdata) {
    partnerFiled {
      partnerName
      emailId
    }
  }
}
`;

export const DELETE_PARTNER = gql`
  mutation deletePartner($id: Int) {
    deletePartner(id: $id) {
      status
    }
  }
`;
export const PG_CREATE_PARTNER = gql`
mutation createPartner($input:PartnerInput!)
{
  createPartner(input:$input){
  partnerFiled{
    id
    partnerName
   
}}}
`;
export const PG_UPDATE_PARTNER = gql`
mutation updatePartner($pg360parterid:Int,$input:PartnerInput!){
  updatePartner(pg360PartnerId:$pg360parterid,input:$input){
    partnerFiled{
      id
      partnerName
      emailId
      mobileNumber
      address
      pg360PartnerId
      subscription
    }
  }
}
`;

export const PG_DELETE_PARTNER = gql`
mutation deletePartner($pg360PartnerId:Int) {
  deletePartner(pg360PartnerId:$pg360PartnerId){
 status
    }  }
`;
