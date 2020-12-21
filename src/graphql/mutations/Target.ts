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
mutation deleteTarget($id:Int!){
  deleteTarget(id:$id){
    targetField{
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
