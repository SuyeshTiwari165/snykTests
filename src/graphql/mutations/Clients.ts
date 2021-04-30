import { gql } from "@apollo/client";

export const CREATE_CLIENT = gql`
mutation createCient($input: ClientInput!) {
  createClient(input: $input) {
    clientField {
      partnerId
      clientName
      emailId
      mobileNumber
      mailSend
    }
  }
}
`;

export const UPDATE_CLIENT = gql`
mutation updateClient($id: Int!, $ClientInput: ClientInput!) {
  updateClient(id: $id, input: $ClientInput) {
    clientFiled {
      partnerId
      clientName
      id
    }
  }
}
`;

export const DELETE_CLIENT = gql`
mutation deleteClient ($id:Int) {
  deleteClient(id:$id){
 status
    } 
     }
`;

