import React from "react";

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
  return window.location.replace("/login");
};
export default Logout;
