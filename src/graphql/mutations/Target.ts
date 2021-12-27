import { gql } from "@apollo/client";

export const CREATE_TARGET = gql`
mutation createTarget($input: TargetInput!)
    {
    createTarget(input: $input){
    targetField{
      id
      vatTargetId
      targetName
      host
      vpnFilePath
      partner{
        id
        partnerName
  }
  targetStatus{
    id
    name
  }
  client{
    id
    clientName
  }
},
status
  }
  }

`;

export const UPDATE_TARGET = gql`
mutation updateTarget($input: TargetInput!,$id:Int!){
  updateTarget(input:$input,id:$id)
  {
    targetField{
      id
      vatTargetId
      targetName
      host
      partner{
        id
        partnerName
      }
      client{
        id
        clientName
      }
    }
  }
}

`;

export const DELETE_TARGET = gql`
mutation deleteTarget($id:Int!,$firstName:String,$lastName:String){
  deleteTarget(id:$id,firstName: $firstName,lastName:$lastName){
    status 
   }
 }
`;

export const DELETE_TARGET_FROM_LIST = gql`
  mutation deleteTargetFromList(
    $id: Int!
    $firstName: String
    $lastName: String
    $token: String
  ) {
    deleteTargetFromList(
      id: $id
      firstName: $firstName
      lastName: $lastName
      token: $token
    ) {
      status
    }
  }
`;

export const CREATE_TARGET_RERUN = gql`
mutation createTargetRerun($input:TargetInput!) {
  createTargetRerun(input:$input){
    targetField{
      id
      vpnFilePath
      partner{
        id
         partnerName
      }
      client{
        id
         clientName
      }
     targetName
    }
  }
}
`;
