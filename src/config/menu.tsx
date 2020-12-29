import * as routeConstants from "../common/RouteConstants";

export const sideDrawerMenus = [
  {
    title: "Dashboard",
    path: routeConstants.DASHBOARD,
    icon: "dashboard",
    //   <img
    //   src={process.env.PUBLIC_URL + "/icons/svg-icon/dashboard.svg"}

    //   alt="user icon"
    // />,

    pathList: [routeConstants.DASHBOARD],
  },
  {
    title: "Clients",
    path: routeConstants.CLIENT,
    icon: "users",
    pathList: [routeConstants.CLIENT],
  },
  {
    title: "Users",
    path: routeConstants.PARTNER_USER,
    icon: "partners",
    pathList: [
      routeConstants.PARTNER_USER,
      routeConstants.PARTNER_USER_FORM_EDIT,
      routeConstants.PARTNER_USER_FORM,
    ],
  },
  //   {
  //   title: "Risk Assessmnt",
  //   path: routeConstants.RA_REPORT_LISTING,
  //   icon: "documents",
  //   pathList: [routeConstants.RA_REPORT_LISTING],
  // },
  // {
  //   title: "Help",
  //   path: "",
  //   icon: "helpmanual",
  //   pathList: [""],
  // },
];

export const sideDrawerAdminMenus = [
  {
    title: "Dashboard",
    path: routeConstants.ADMIN_DASHBOARD,
    icon: "dashboard",
    pathList: [routeConstants.ADMIN_DASHBOARD],
  },
  {
    title: "Partners",
    path: routeConstants.ADD_PARTNER,
    icon: "partners",
    pathList: [routeConstants.ADD_PARTNER],
  },

  // {
  //   title: "Admin",
  //   type: "admin",
  //   path: routeConstants.TEMPLATE,
  //   icon: "users",
  //   pathList: [
  //     routeConstants.TEMPLATE,
  //     routeConstants.LAW,
  //     routeConstants.STATE,
  //     routeConstants.ORGANIZATION_TYPE,
  //     routeConstants.RULE,
  //     routeConstants.POLICY,
  //     routeConstants.PIIDATA,
  //     routeConstants.PIICATEGORY,
  //   ],
  // },
  {
    title: "Help",
    path: "",
    icon: "prospecting",
    pathList: [""],
  },
];

export const topStepperMenu = [
  {
    title: "Logout",
    path: routeConstants.LOGOUT_URL,
    icon: "template1",
  },
];

export const raTopStepperMenu = [
  {
    title: "Task",
    path: routeConstants.TASK_DETAILS,
    icon: "tag",
  },
  {
    title: "Target",
    path: routeConstants.TARGET,
    icon: "speedSend",
  },
];
