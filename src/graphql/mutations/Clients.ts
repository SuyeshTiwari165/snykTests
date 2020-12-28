import { gql } from "@apollo/client";

export const CREATE_CLIENT = gql`
mutation createCient($input: ClientInput!) {
  createClient(input: $input) {
    clientField {
      partnerId
      clientName
      emailId
      mobileNumber
    }
  }
}
`;

export const UPDATE_CLIENT = gql`
mutation updatePartner($id: Int, $partnerdata: PartnerInput!) {
  updatePartner(id: $id, input: $partnerdata) {
    partnerFiled {
      partnerName
      emailId
    }
  }
}

`;


