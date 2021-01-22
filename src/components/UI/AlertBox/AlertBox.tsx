import React from "react";
import styles from './AlertBox.module.css';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
// import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import { Button } from "../Form/Button/Button";


const AlertBox = (props: any) => {
  return (
    <Dialog
      open={props.open}
      aria-labelledby="form-dialog-title"
      disableBackdropClick
      disableEscapeKeyDown
      classes={{
        container: styles.Alertbox,
        paper: styles.AlertboxPaper,
        scrollPaper: styles.ScrollPaper,
      }}
    >
      <DialogTitle id="form-dialog-title">
        {props.DialogTitle ? props.DialogTitle : ""}
        <Link color="primary" to={{ pathname: props.cancelButtonPath ? props.cancelButtonPath : "" }}>
          <IconButton
            aria-label="close"
            style={{
              position: "absolute",
              right: "12px",
              top: "8px",
            }}
            onClick={props.cancelButtonPath}
          >
            <CloseIcon />
          </IconButton>
        </Link>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{props.dialogBoxMsg}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {props.buttonName !== '' ? <Link color="primary" to={{ pathname: props.pathName }}>
          <Button variant="contained" color="primary" onClick={props.handleOkay}>
            {props.buttonName}
          </Button>
        </Link> : null}
        <Link color="primary" to={{ pathname: props.closeButtonPath }}>
          <Button variant="contained" color="primary" onClick={props.handleClose}>
            {props.CloseButtonName ? props.CloseButtonName : 'Close'}
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  )
};

export default AlertBox;