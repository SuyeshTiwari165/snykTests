import React from "react";
import Cookies from 'js-cookie';
import moment from "moment";
import LogoutPage from "../LogoutPage/LogoutPage";
import {
  Switch,
  Redirect,
  Route,
  BrowserRouter,
} from "react-router-dom";

export interface LoginProps {}
export const Logout: any = () => {
  localStorage.removeItem("partnerData");
  localStorage.removeItem("session");
  localStorage.removeItem("user");
  localStorage.removeItem("name");
  localStorage.removeItem("targetId");
  localStorage.removeItem("customClientUrl");
  localStorage.removeItem("ipRange");
  localStorage.removeItem("ipAddress");
  localStorage.removeItem('re-runTargetName');
  localStorage.removeItem("userName");
  localStorage.removeItem("password");
  localStorage.removeItem("vpnUserName");
  localStorage.removeItem("vpnPassword");
  localStorage.removeItem("winUsername");
  localStorage.removeItem("winPassword");
  localStorage.removeItem("WinTargetName");
  localStorage.removeItem("LinuxTargetName");
  Cookies.remove('ob_user', { path: '', domain: process.env.REACT_APP_DOMAIN });
  Cookies.remove('ob_session', { path: '', domain: process.env.REACT_APP_DOMAIN });
  Cookies.remove('ob_partnerData', { path: '', domain: process.env.REACT_APP_DOMAIN });
  Cookies.remove('ob_user', { path: '', domain: process.env.ADMIN_REACT_APP_DOMAIN });
  Cookies.remove('ob_session', { path: '', domain: process.env.ADMIN_REACT_APP_DOMAIN});
  Cookies.remove('ob_partnerData', { path: '',  domain: process.env.ADMIN_REACT_APP_DOMAIN});
  return( 
    <div>Logout Sucessfully!
      {window.location.replace("/logout")}
    </div>
 )
};
export default Logout;
