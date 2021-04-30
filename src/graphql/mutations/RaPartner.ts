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
