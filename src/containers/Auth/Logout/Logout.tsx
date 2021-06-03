import React from "react";
import Cookies from 'js-cookie';
import moment from "moment";

export interface LoginProps {}
export const Logout: any = () => {
  localStorage.removeItem("partnerData");
  localStorage.removeItem("session");
  localStorage.removeItem("user");
  localStorage.removeItem("name");
  localStorage.removeItem("targetId");
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
  Cookies.remove('user', { path: '', domain: '.wastaging.com' });
  Cookies.remove('session', { path: '', domain: '.wastaging.com' });
  Cookies.remove('partnerData', { path: '', domain: '.wastaging.com' });
  return window.location.replace("/login");
};
export default Logout;
