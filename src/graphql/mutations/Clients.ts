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

export const PG_ADD_CLIENT = gql`
mutation createClient($input:ClientInput!){  
  createClient(input:$input)
  {
    clientField{
      id
      clientName
    }
  }}
  `;
 
  
export const PG_UPDATE_CLIENT = gql`
mutation updateClient($pgclientid:Int,$input:ClientInput!){
  updateClient(pg360ClientId:$pgclientid,input:$input)
  {
    clientFiled{
      partnerId
      clientName
    }
  }
}
  `;

  export const PG_DELETE_CLIENT = gql`
  mutation ($pg360ClientId:Int) {
    deleteClient(pg360ClientId:$pg360ClientId){
   status
      }  }
  `;
  