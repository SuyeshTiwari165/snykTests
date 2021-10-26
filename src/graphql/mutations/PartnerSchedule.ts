import { gql } from "@apollo/client";

export const PARTNER_SCHEDULE = gql`
mutation createPartnerShedule($input:PartnerScheduleInput!){
    createPartnerShedule(input:$input){
      scheduleFiled{
        id
        partner{
          id
          partnerName
        }
  
      }
    }
  }
  `;
export const PARTNER_SCHEDULE_DELETE = gql`
mutation deletePartnerShedule($id:Int){
  deletePartnerShedule(partnerScheduleId:$id){
 status
 }
 }
  `;

export const PARTNER_SCHEDULE_EDIT = gql`
  mutation updatePartnerShedule($input:PartnerScheduleInput!){
    updatePartnerShedule(input:$input){
    scheduleFiled{
     id
     partner{
       id
       partnerName
     }
     tZone
     startDay
     endDay
     startTime
     endTime
   }
   }
   }
   `;
