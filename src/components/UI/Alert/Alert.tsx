import React from "react";
import styles from "./Alert.module.css";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  MarginBottom: {
    marginBottom: "24px",
  },
}));

function Alert(
  props: JSX.IntrinsicAttributes & import("@material-ui/lab/Alert").AlertProps
) {
  const classes = useStyles();
  return (
    <MuiAlert
      elevation={6}
      severity={props.severity}
      variant="filled"
      action={props.action}
      {...props}
      className={classes.MarginBottom}
    />
  );
}

export default Alert;
