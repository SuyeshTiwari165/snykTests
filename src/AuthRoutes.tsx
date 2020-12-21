import React from "react";
// import { BrowserRouter as  Router, Route, Link, Switch } from "react-router-dom";
import { Switch, Route, RouteComponentProps, Redirect } from "react-router";
import Dashboard from "./containers/AdminPanel/Dashboard/Dashboard";
// import CompanyProfile from "./containers/CompanyProfile/CompanyProfile";
// import MainOffice from "./containers/MainOffice/MainOffice";
// import OtherOffice from "./containers/OtherOffice/OtherOffice";
// import Customer from "./containers/Customer/Customer";
// import Review from "./containers/Review/Review";
// import Compliance from "./containers/Workplan/Compliance/Compliance";
// import Target from "./containers/RiskAssessment/Target/Target";
// import TaskDetails from "./containers/RiskAssessment/TaskDetails/TaskDetails";
// import ReportStatus from "./containers/RiskAssessment/ReportStatus/ReportStatus";
// import RaReportListing from "./containers/RiskAssessment/RaReportListing/RaReportListing";
import Logout from "./containers/Auth/Logout/Logout";
import PartnerUser from "./containers/AdminPanel/Partner/PartnerUser/PartnerUser";
import PartnerUserForm from "./containers/AdminPanel/PartnerUserForm/PartnerUserForm";
// import Views from "./containers/Workplan/Views/Views";
import * as routeConstants from "./common/RouteConstants";
// import Client from "./containers/Client/Client";
// import ComplianceList from "./containers/ComplianceList/ComplianceList";
import TopStepperRoute from "./common/TopStepperRoute";
import LayoutRoute from "./common/LayoutRoute";

const defaultRedirect = () => <Redirect to={routeConstants.DASHBOARD} />;

export const AuthRoutes = (
  <Switch>
    <LayoutRoute path={routeConstants.PARTNER_USER_FORM} exact component={PartnerUserForm} />
    <LayoutRoute path={routeConstants.PARTNER_USER_FORM_ADD} exact component={PartnerUserForm} />
    <LayoutRoute path={routeConstants.PARTNER_USER_FORM_EDIT + ":id" }exact component={PartnerUserForm} />
    <LayoutRoute path={routeConstants.PARTNER_USER_FORM_EDIT+ "/:id "} exact component={PartnerUserForm} />
    <LayoutRoute path={routeConstants.DASHBOARD} exact component={Dashboard} />
    {/* <LayoutRoute path={routeConstants.CLIENT} exact component={Client} />
    <LayoutRoute
      path={routeConstants.COMPLIANCE_LIST}
      exact
      component={ComplianceList}
    /> */}
    <LayoutRoute
      path={routeConstants.PARTNER_USER}
      exact
      component={PartnerUser}
    />
    {/* <TopStepperRoute
      path={routeConstants.COMPANY_INFO}
      exact
      component={CompanyProfile}
    /> */}
    {/* <TopStepperRoute
      path={routeConstants.MAIN_OFFICE}
      exact
      component={MainOffice}
    /> */}
    {/* <TopStepperRoute
      path={routeConstants.OTHER_OFFICE}
      exact
      component={OtherOffice}
    /> */}
    {/* <TopStepperRoute
      path={routeConstants.CUSTOMER}
      exact
      component={Customer}
    /> */}
    {/* <TopStepperRoute path={routeConstants.REVIEW} exact component={Review} />
    <TopStepperRoute
      path={routeConstants.COMPLIANCE}
      exact
      component={Compliance}
    /> */}

    <LayoutRoute path={routeConstants.LOGOUT_URL} exact component={Logout} />
    {/* <LayoutRoute
      path={routeConstants.COMPLIANCE + "/view"}
      exact
      component={Views}
    />
    <LayoutRoute path={routeConstants.TARGET} exact component={Target} /> */}
    {/* <LayoutRoute
      path={routeConstants.TASK_DETAILS}
      exact
      component={TaskDetails}
    /> */}
    {/* <LayoutRoute
      path={routeConstants.REPORT_STATUS}
      exact
      component={ReportStatus}
    />
    <LayoutRoute
      path={routeConstants.RA_REPORT_LISTING}
      exact
      component={RaReportListing}
    /> */}
    <Route path="/" render={defaultRedirect} />
  </Switch>
);
