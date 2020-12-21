import React from "react";
import { Switch, Route, Redirect } from "react-router";
import Logout from "./containers/Auth/Logout/Logout";
import Partner from "./containers/AdminPanel/Partner/Partner/Partner";
import PartnerUser from "./containers/AdminPanel/Partner/PartnerUser/PartnerUser";
import AdminDashboard from "./containers/AdminPanel/Dashboard/Dashboard";
import * as routeConstants from "./common/RouteConstants";
import PartnerUserForm from "./containers/AdminPanel/PartnerUserForm/PartnerUserForm";
import LayoutRoute from "./common/LayoutRoute";

const defaultRedirect = () => <Redirect to="/admin-dashboard" />;
export const AdminRoutes = (
  <Switch>
    <LayoutRoute path={routeConstants.PARTNER_USER_FORM} exact component={PartnerUserForm} />
    <LayoutRoute path={routeConstants.PARTNER_USER_FORM_ADD} exact component={PartnerUserForm} />
    <LayoutRoute path={routeConstants.PARTNER_USER_FORM_EDIT + ":id" }exact component={PartnerUserForm} />
    <LayoutRoute
      path={routeConstants.ADMIN_DASHBOARD}
      exact
      component={AdminDashboard}
    />
    <LayoutRoute path={routeConstants.ADD_PARTNER} exact component={Partner} />
    <LayoutRoute
      path={routeConstants.PARTNER_USER}
      exact
      component={PartnerUser}
    />
    <LayoutRoute path={routeConstants.LOGOUT_URL} exact component={Logout} />
    <Route path="/" render={defaultRedirect} />
  </Switch>
);
