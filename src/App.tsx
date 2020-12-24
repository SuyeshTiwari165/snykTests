import React, { useState } from "react";
import logo from "./logo.svg";
import {
  Switch,
  RouteComponentProps,
  Redirect,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { Layout } from "./components/UI/Layout/Layout";
import { Login } from "./containers/Auth/Login/Login";
import { Registration } from "./containers/Auth/Registration/Registration";
import { SessionContext } from "./context/session";
import { ApolloProvider } from "@apollo/client";
import gqlClient from "./config/apolloclient";
import { ErrorHandler } from "./containers/ErrorHandler/ErrorHandler";
import { AuthRoutes } from "./AuthRoutes";
import { AdminRoutes } from "./AdminRoutes";
import styles from "./App.module.css";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme/";
import logout from "./containers/Auth/Logout/Logout";
import { CompanyUser } from "./common/Roles";

function App() {
  const session = localStorage.getItem("session");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [authenticated, setAuthenticated] = useState(session ? true : false);
  const values = {
    authenticated: authenticated,
    setAuthenticated: (value: any) => {
      setAuthenticated(value);
    },
  };
  const accessToken = session ? session : null;
  const client = gqlClient(null);
  if (authenticated) {
    setTimeout(function () {
      logout();
      window.location.replace("/login");
    }, 1000 * 60 * 60);
  }
  let routes;

  if (authenticated) {
    if (user.isSuperuser !== true) {
      routes = <div>{AuthRoutes}</div>;
    }
    if (user.isSuperuser === true) {
      routes = <div>{AdminRoutes}</div>;
    }
  } else if (!authenticated) {
    routes = (
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/registration" exact component={Registration} />
        <Route path="/" render={() => <Redirect to="/login" />} />
      </Switch>
    );
  }

  return (
    // <SessionContext.Provider value={values}>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <ErrorHandler />
        <BrowserRouter>{routes}</BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
    // </SessionContext.Provider>
  );
}

export default App;
