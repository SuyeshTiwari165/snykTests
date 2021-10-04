import { gql } from "@apollo/client";

export const GET_PARTNER_SCHEDULE = gql`
query getPartnerSchedule($partnerId_PartnerName:String!){
    getPartnerSchedule(partnerId_PartnerName:$partnerId_PartnerName){
      edges{
        node{
          id
          tZone
          startDay
          endDay
          startTime
          endTime
          partner{
            id
            partnerName
          }
        }
      }
    }
  }
  `;