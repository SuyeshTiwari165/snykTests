import React, { useEffect, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/link-context";

const session = Cookies.getJSON("ob_session");
const accessToken = session ? session : null;
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: accessToken ? "jwt" + " " + accessToken : null,
    },
  };
});

let httpLink: any;
let link: any;
httpLink = createHttpLink({
  uri: "https://ob360-backend-staging.piisecured.com/graphql/",
});

link = accessToken ? authLink.concat(httpLink) : httpLink;
export const customClient: any = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});
