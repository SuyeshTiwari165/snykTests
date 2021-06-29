import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import styles from "./LogoutPage.module.css";

export const LogoutPage: React.FC = (props: any) => {
  return (
    <React.Fragment>
    <div className={styles.logoutPage}>
      <Paper className={styles.paper}>
        <Typography component="h5" variant="h3">
          You have Successfully Logged out from OB360
        </Typography>
      </Paper>
      </div>
    </React.Fragment>
  );
};
export default LogoutPage;
