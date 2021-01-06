import React from "react";

export interface LoginProps {}
export const Logout: any = () => {
  localStorage.removeItem("partnerData");
  localStorage.removeItem("session");
  localStorage.removeItem("user");
  return window.location.replace("/login");
};
export default Logout;
