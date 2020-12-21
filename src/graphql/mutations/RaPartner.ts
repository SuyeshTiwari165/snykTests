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




