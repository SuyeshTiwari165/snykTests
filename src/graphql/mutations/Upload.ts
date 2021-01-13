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

export const UPLOAD_VPN_FILE = gql`
  mutation uploadFile($input: FileUploadInput!) {
    uploadFile(input: $input) {
      success
    }
  }
`;

export const ZIP_FILE = gql`
  mutation uploadZipFile($input:FileUploadInput!){
    uploadZipFile(input:$input){
      success
    }
  }
`;

