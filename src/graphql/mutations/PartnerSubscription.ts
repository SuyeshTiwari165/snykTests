import { gql } from "@apollo/client";

export const CRREATE_PARTNER_SUBSCRIPTION = gql`
  mutation createPartnerSubscription(
    $contact_id: ID!,
    $CCSubscription: Boolean!,
    $RASubscription: Boolean!
  ) {
    createPartnerSubscription(
      input: {
        data: {
          contact_id: $contact_id
          cc_subscription: $CCSubscription
          ra_subscription: $RASubscription
        }
      }
    ) {
      partnerSubscription {
        id
      }
    }
  }
`;

export const UPDATE_PARTNER_SUBSCRIPTIONS = gql`
mutation updatePartnerSubscription (
  $contact_id: ID!,
  $CCSubscription: Boolean!,
  $RASubscription: Boolean!,
  $id :ID!
  ) {
    updatePartnerSubscription (input: { where: { id: $id}
      data: {
        contact_id: $contact_id
        cc_subscription: $CCSubscription
        ra_subscription: $RASubscription
      }
    }) {
      partnerSubscription {
        id
      }
    }
  }
`;