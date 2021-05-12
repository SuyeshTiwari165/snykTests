import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { ApolloLink } from "apollo-link";
import { onError } from "@apollo/link-error";
import { RA_URI } from ".";
import { setContext } from "@apollo/link-context";
import * as routeConstants from "../common/RouteConstants";

const subscribe = require("@jumpn/utils-graphql");

const ragqlClient = (auth_token: string | null) => {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: auth_token ? "jwt" + " " + auth_token : null,
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );

    if (networkError) console.log(`[Network error]: ${networkError}`);
  });
  let httpLink;
  let link;
  httpLink = createHttpLink({ uri: RA_URI });
  link = auth_token ? authLink.concat(httpLink) : httpLink;

  return new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });
};
export default ragqlClient;
