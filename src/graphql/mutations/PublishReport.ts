import { gql } from "@apollo/client";

export const PUBLISH_REPORT = gql`
  mutation publishedReport($input:TargetInput!){
    publishedReport(input:$input){
      success
    }
  }
`;