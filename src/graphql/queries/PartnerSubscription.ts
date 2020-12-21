import { gql } from "@apollo/client";

export const GET_PARTNER_SUBSCRIPTION = gql`
  query getPartnerSubs($where: JSON, $sort: String) {
    partnerSubscriptions(where: $where, sort: $sort) {
      id
      contact_id {
        id
        name
        email
        phone
      }
      cc_subscription
      ra_subscription
    }
  }
`
