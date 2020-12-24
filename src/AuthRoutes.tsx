import React from "react";
// import { BrowserRouter as  Router, Route, Link, Switch } from "react-router-dom";
import { Switch, Route, RouteComponentProps, Redirect } from "react-router";
import Dashboard from "./containers/AdminPanel/Dashboard/Dashboard";
import Target from "./containers/RiskAssessment/Target/Target";
import TaskDetails from "./containers/RiskAssessment/TaskDetails/TaskDetails";
import ReportStatus from "./containers/RiskAssessment/ReportStatus/ReportStatus";
import RaReportListing from "./containers/RiskAssessment/RaReportListing/RaReportListing";
import Logout from "./containers/Auth/Logout/Logout";
import PartnerUser from "./containers/AdminPanel/PartnerUser/PartnerUser/PartnerUser";
import PartnerUserForm from "./containers/AdminPanel/PartnerUser/PartnerUserForm/PartnerUserForm";
import PartnerForm from "./containers/AdminPanel/Partner/PartnerForm/PartnerForm";
import * as routeConstants from "./common/RouteConstants";
import Client from "./containers/Client/Client";
import TopStepperRoute from "./common/TopStepperRoute";
import LayoutRoute from "./common/LayoutRoute";

const defaultRedirect = () => <Redirect to={routeConstants.DASHBOARD} />;

export const AuthRoutes = (
  <Switch>
    <LayoutRoute
      path={routeConstants.PARTNER_USER_FORM}
      exact
      component={PartnerUserForm}
    />
    <LayoutRoute
      path={routeConstants.PARTNER_USER_FORM_ADD}
      exact
      component={PartnerUserForm}
    />
    <LayoutRoute
      path={routeConstants.PARTNER_USER_FORM_EDIT + ":id"}
      exact
      component={PartnerUserForm}
    />
    <LayoutRoute
      path={routeConstants.PARTNER_USER_FORM_EDIT + "/:id "}
      exact
      component={PartnerUserForm}
    />
    <LayoutRoute path={routeConstants.DASHBOARD} exact component={Dashboard} />
    <LayoutRoute path={routeConstants.CLIENT} exact component={Client} />
    <LayoutRoute
      path={routeConstants.PARTNER_USER}
      exact
      component={PartnerUser}
    />
    <LayoutRoute path={routeConstants.LOGOUT_URL} exact component={Logout} />
    <LayoutRoute path={routeConstants.TARGET} exact component={Target} />
    <LayoutRoute
      path={routeConstants.TASK_DETAILS}
      exact
      component={TaskDetails}
    />
    <LayoutRoute
      path={routeConstants.REPORT_STATUS}
      exact
      component={ReportStatus}
    />
    <LayoutRoute
      path={routeConstants.RA_REPORT_LISTING}
      exact
      component={RaReportListing}
    />
    <Route path="/" render={defaultRedirect} />
  </Switch>
);
