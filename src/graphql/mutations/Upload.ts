import { gql } from "@apollo/client";

export const UPLOAD_FILE = gql`
  mutation uploadFile(
    $refId: ID
    $ref: String
    $field: String
    $source: String
    $file: Upload!
  ) {
    upload(
      refId: $refId
      ref: $ref
      field: $field
      source: $source
      file: $file
    ) {
      id
      name
    }
  }
`;

// mutation uploadFile($file: Upload!) {
//   upload(file: $file) {
//     id
//     name
//     hash
//     url
//   }
// }