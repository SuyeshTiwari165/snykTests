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

export const VPN_DISCONNECTION = gql`
mutation disconnectVpn($input:FileUploadInput!){
  disconnectVpn(input:$input){
    success
  }
}
`;

export const TEST_WINDOWS_CONNECTION = gql`
mutation windowsVpnTest($input: TestConnectionInput!) {
  windowsVpnTest(input: $input) {
    success
  }
}`;