import { gql } from "@apollo/client";

export const TEST_CONNECTION = gql`
  mutation vpnConnection($input: TestConnectionInput!) {
    vpnConnection(input: $input) {
      success
    }
  }
`;

export const TEST_LINUX_CONNECTION = gql`
  mutation domainConnection($input: TestConnectionInput!) {
    domainConnection(input: $input) {
      success
    }
  }
`;
