import React from "react";
import { Switch, Route, Redirect } from "react-router";
import Logout from "./containers/Auth/Logout/Logout";
import Partner from "./containers/AdminPanel/Partner/Partner/Partner";
import PartnerUser from "./containers/AdminPanel/PartnerUser/PartnerUser/PartnerUser";
import AdminDashboard from "./containers/AdminPanel/Dashboard/Dashboard";
import * as routeConstants from "./common/RouteConstants";
import PartnerUserForm from "./containers/AdminPanel/PartnerUser/PartnerUserForm/PartnerUserForm";
import PartnerForm from "./containers/AdminPanel/Partner/PartnerForm/PartnerForm";
import LayoutRoute from "./common/LayoutRoute";
import ReportStatus from "./containers/AdminPanel/ReportStatus/ReportStatus";
import Client from "./containers/Client/Client/Client";
import Target from "./containers/RiskAssessment/Target/Target";
import TaskDetails from "./containers/RiskAssessment/TaskDetails/TaskDetails";
import RaReportListing from "./containers/RiskAssessment/RaReportListing/RaReportListing";
import VpnStatus from "./containers/AdminPanel/VpnStatus/VpnStatus";
import { Prospects } from "./containers/Prospects/Prospects";

const defaultRedirect = () => <Redirect to="/admin-dashboard" />;
export const AdminRoutes = (
  <Switch>
    <LayoutRoute path={routeConstants.PARTNER_USER_FORM} exact component={PartnerUserForm} />
    <LayoutRoute path={routeConstants.PARTNER_USER_FORM_ADD} exact component={PartnerUserForm} />
    <LayoutRoute path={routeConstants.PARTNER_USER_FORM_EDIT + ":id"} exact component={PartnerUserForm} />
    <LayoutRoute path={routeConstants.PARTNER_USER_FORM} exact component={PartnerForm} />
    <LayoutRoute path={routeConstants.PARTNER_FORM_ADD} exact component={PartnerForm} />
    <LayoutRoute path={routeConstants.PARTNER_FORM_EDIT + ":id"} exact component={PartnerForm} />
    <LayoutRoute path={routeConstants.ADMIN_REPORT_STATUS} exact component={ReportStatus} />
    <LayoutRoute path={routeConstants.ADMIN_VPN_STATUS} exact component={VpnStatus} />

    <LayoutRoute
      path={routeConstants.RA_REPORT_LISTING}
      exact
      component={RaReportListing}
    />
    <LayoutRoute
      path={routeConstants.ADMIN_DASHBOARD}
      exact
      component={AdminDashboard}
    />
    <LayoutRoute path={routeConstants.ADD_PARTNER} exact component={Partner} />
    <LayoutRoute path={routeConstants.CLIENT} exact component={Client} />
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
      path={routeConstants.PARTNER_USER}
      exact
      component={PartnerUser}
    />
    <LayoutRoute
      path={routeConstants.VIEW_PROSPECT}
      exact
      component={Prospects}
    />
    <LayoutRoute path={routeConstants.LOGOUT_URL} exact component={Logout} />
    <Route path="/" render={defaultRedirect} />
  </Switch>
);