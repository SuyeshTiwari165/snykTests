import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import styles from "./Backdrop.module.css";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#ffffff"
    },
    backdroptext: {
      color: "#ffffff"
    }
  })
);

export default function SimpleBackdrop() {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(true);
  return (
    <Backdrop className={classes.backdrop} open={true}>
      <div className={styles.CenterItems}>
        <div className={styles.LoadingPadding}>
          <CircularProgress style={{ color: "white" }} />
        </div>
        <div className={classes.backdroptext}>Loading...</div>
      </div>
    </Backdrop>
  );
}
