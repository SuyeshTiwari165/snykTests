import React from "react";

export interface LoginProps {}
export const Logout: any = () => {
  localStorage.removeItem("contact");
  localStorage.removeItem("session");
  localStorage.removeItem("user");
  console.log("logout page click");
  return window.location.replace("/login");
};
export default Logout;
