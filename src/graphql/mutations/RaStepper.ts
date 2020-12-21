import { gql } from "@apollo/client";

export const RA_STEPPER = gql`
  {
    raStep @client
    activeStep @client
  }
`;
