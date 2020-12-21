import { gql } from '@apollo/client';

export const GET_CONTACT = gql`
	query ($id: ID){
	  contacts(where: { user_id: $id }) {
	    id
	    name
	    email
	    contact_type
	    user_id{id}
	  }
	}
`;

export const GET_CONTACT_INFO = gql`
  query getContact($where: JSON, $sort: String) {
    contacts(where: $where, sort: $sort) {
      id
      name
      email
      phone
      contact_type
      user_id {
        id
        username
        role {
          id
          name
        }
      }
      compliance_versions {
        id
        compliances {
          id
        }
      }
    }
  }
`;