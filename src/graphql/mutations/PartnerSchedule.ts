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