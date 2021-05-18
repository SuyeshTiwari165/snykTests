import React from "react";

import { SideDrawer } from "./Navigation/SideDrawer/SideDrawer";
import styles from "./Layout.module.css";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import TopStepper from "./Navigation/TopStepper/TopStepper";
import { CompanyUser } from "../../../common/Roles";
import * as routeConstants from "../../../common/RouteConstants";

export interface LayoutProps {}

export const Layout: React.SFC<LayoutProps> = (props) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      <Header />
      <div className={styles.mainContainer}>
        {/* <SideDrawer /> */}
        <main className={styles.Main}>
          <div>{props.children}</div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
