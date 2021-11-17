import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
mutation createTask($input: TaskInput!) {
  createTask(input: $input) {
    taskField {
      id
      taskName
      vatTaskId
      partner {
        id
        partnerName
      }
      client {
        id
        clientName
      }
      vatTarget {
        id
        vatTargetId
        targetName
      }
      vatScanConfig {
        vatScanConfigId
        scanConfigName
      }
      vatScanner {
        vatScannerId
        name
      }
    }
    status
  }
}
`;

export const UPDATE_TASK = gql`
mutation updateTask($input: TaskInput!,$id:Int!){
  updateTask(input:$input,id:$id)
  {
    taskField{
      id
      taskName
      vatTaskId
      partner{
        id
        partnerName
      }
      client{
        id
        clientName
      }
      vatTarget{
        vatTargetId
        targetName
      }
      vatScanConfig{
        vatScanConfigId
        scanConfigName
      
      }
      vatScanner{
        vatScannerId
        name
      }
    }
  }
}

`;

export const DELETE_TASK = gql`
mutation deleteTask($id:Int!){
  deleteTask(id:$id){
    taskField{
      taskName
      vatTaskId
      partner{
        id
        partnerName
      }
      client{
        id
        clientName
      }
      vatTarget{
        vatTargetId
        targetName
      }
      vatScanConfig{
        vatScanConfigId
        scanConfigName
      
      }
      vatScanner{
        vatScannerId
        name
      }
       } 
   }
 }
`;
