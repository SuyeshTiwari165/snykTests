import { gql } from "@apollo/client";

export const TEST_CONNECTION = gql`
  mutation vpnConnection($input: TestConnectionInput!) {
    vpnConnection(input: $input) {
      success
    }
  }
`;
