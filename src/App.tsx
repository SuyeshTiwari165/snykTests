import React, { useState } from "react";
import {
  Switch,
  Redirect,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { Login } from "./containers/Auth/Login/Login";
import { Registration } from "./containers/Auth/Registration/Registration";
import { SessionContext } from "./context/session";
import { ApolloProvider } from "@apollo/client";
import ragqlClient from "./config/apolloclient";
import { ErrorHandler } from "./containers/ErrorHandler/ErrorHandler";
import { AuthRoutes } from "./AuthRoutes";
import { AdminRoutes } from "./AdminRoutes";
import styles from "./App.module.css";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme/";
import logout from "./containers/Auth/Logout/Logout";
import PgAction from "./containers/Auth/PgAction/PgAction";
import PartnerForm from "./containers/PG/Partner/Partner";
import DeletePartner from "./containers/PG/DeletePartner/DeletePartner";
import PartnerUserForm from "./containers/PG/PartnerUserForm/PartnerUserForm";
import DeletePartnerUser from "./containers/PG/DeletePartnerUser/DeletePartnerUser";
import ClientForm from "./containers/PG/ClientForm/ClientForm";
import DeleteClient from "./containers/PG/DeleteClient/DeleteClient";

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
  // const client = ragqlClient(accessToken);
  const client = authenticated ? ragqlClient(accessToken) : ragqlClient(null);

  if (accessToken) {
    setTimeout(function () {
      logout();
      window.location.replace("/login");
    }, 3600000);
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
        <Route path="/pg-action" exact component={PgAction} />
        <Route path="/pg-action" exact component={PgAction} />
        <Route path={"/pg-partner-form/add/"} exact component={PartnerForm} />
        <Route path={"/pg-partner-form/edit/" }exact component={PartnerForm} />
        <Route path={"/pg-partner-form/delete/" }exact component={DeletePartner} />
        <Route path={"/pg-partner-user-form/add/" }exact component={PartnerUserForm} />
        <Route path={"/pg-partner-user-form/edit/" }exact component={PartnerUserForm} />
        <Route path={"/pg-partner-user-form/delete/" }exact component={DeletePartnerUser} />
        <Route path={"/pg-client-form/add" }exact component={ClientForm} />
        <Route path={"/pg-client-form/edit" }exact component={ClientForm} />
        <Route path={"/pg-client-form/delete" }exact component={DeleteClient} />


        <Route path="/" render={() => <Redirect to="/login" />} />
      </Switch>
    );
  }

  return (
    <SessionContext.Provider value={values}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <ErrorHandler />
          <BrowserRouter>{routes}</BrowserRouter>
        </ThemeProvider>
      </ApolloProvider>
    </SessionContext.Provider>
  );
}

export default App;
