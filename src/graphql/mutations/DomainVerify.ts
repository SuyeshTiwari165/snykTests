import { gql } from "@apollo/client";
export const DOMAIN_VERIFY = gql`
mutation domainVerify($input: TargetInput!) {
    domainVerify(input:$input){
      status
    }
  }
`;
export const IP_VERIFY = gql`
mutation IPVerify($input: TargetInput!) {
  IPVerify(input:$input){
    status
  }
}
`
export const URL_VERIFY = gql`
mutation pturlVerify($input: TargetInput!) {
  pturlVerify(input:$input){
    status
  }
}
`

;