import React, { ReactNode } from "react";
import { Button } from "../Form/Button/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import styles from "./DialogBox.module.css";
import classes from "./DialogBox.module.css";

interface DialogProps {
  open?: boolean;
  title?: string;
  handleOk?: Function | any;
  handleCancel?: Function | any;
  children?: ReactNode;
  buttonOk?: string;
  buttonCancel?: string;
  colorOk?: "inherit" | "primary" | "secondary" | "default" | undefined;
  colorCancel?: "inherit" | "primary" | "secondary" | "default" | undefined;
  disabled?: boolean;
  alignButtons?: string;
  skipCancel?: boolean;
  classes? : any;
  dialogBoxMsg?: string;
  pathName?: string;
  closeButtonPath?: string;
}

export const DialogBox: React.SFC<DialogProps> = ({
  open = true,
  title,
  handleOk,
  handleCancel,
  children,
  buttonOk = "Confirm",
  buttonCancel = "Cancel",
  colorOk = "primary",
  colorCancel = "secondary",
  disabled = false,
  alignButtons,
  skipCancel = false,
  classes
}) => {
  // const handleCancelButton = () => {
  //   handleCancel();
  // };

  // const handleOKButton = () => {
  //   handleOk();
  // };

  let cancelButtonDisplay = null;
  if (!skipCancel) {
    cancelButtonDisplay = (
      <Button
        variant={"contained"}
        onClick={handleCancel}
        color={colorCancel}
        data-testid="cancel-button"
      >
        {buttonCancel}
      </Button>
    );
  }

  return (
    <div>
      <Dialog
        data-testid="dialogBox"
        open={open}
        classes={{
          root: classes.root ? classes.root :styles.ReactRootDialog,
          container:classes.container ? classes.container : styles.Dialogbox,
          paper: classes.paper ? classes.paper : styles.DialogboxPaper,
          scrollPaper: classes.scrollPaper ? classes.scrollPaper : styles.ScrollPaper,
        }}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={styles.DialogTitle}>
          {title}
        </DialogTitle>
        <DialogContent className={styles.DialogBody}>{children}</DialogContent>
        <DialogActions className={`${styles.DialogActions} ${alignButtons}`}>
          <Button
            onClick={handleOk}
            color={colorOk}
            variant={"contained"}
            data-testid="ok-button"
            disabled={disabled}
          >
            {buttonOk}
          </Button>
          {cancelButtonDisplay}
        </DialogActions>
      </Dialog>
    </div>
  );
};
