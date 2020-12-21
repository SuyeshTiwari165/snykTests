import React, { ReactNode } from "react";
import { Button } from "../Form/Button/Button";
import styles from "./AddEditForm.module.css";
import { Grid } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import ReplayIcon from '@material-ui/icons/Replay';

interface FormProps {
  open?: boolean;
  title?: string;
  handleOk?: Function | any;
  handleCancel?: Function | any;
  children?: ReactNode;
  buttonBackToList?: string;
  buttonOk?: string;
  buttonCancel?: string;
  colorOk?: "inherit" | "primary" | "secondary" | "default" | undefined;
  colorCancel?: "inherit" | "primary" | "secondary" | "default" | undefined;
  disabled?: boolean;
  alignButtons?: string;
  skipCancel?: boolean;
  pathName?: string;
  closeButtonPath?: string;
}

export const AddEditForm: React.SFC<FormProps> = ({
  open = true,
  title,
  handleOk,
  handleCancel,
  children,
  buttonBackToList = "Back to List",
  buttonOk = "Save",
  buttonCancel = "Cancel",
  colorOk = "primary",
  colorCancel = "secondary",
  disabled = false,
  skipCancel = false,
}) => {
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
    <Grid container>
      <Grid item xs={12} className={styles.backToListButton}>
        <Button
          variant={"contained"}
          onClick={handleCancel}
          color={colorCancel}
          data-testid="cancel-button"
        >
          <img
            src={
              process.env.PUBLIC_URL + "/icons/svg-icon/back-list.svg"
            }
            alt="user icon"
          /> &nbsp;
          {buttonBackToList}
        </Button>
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
      <Grid item xs={12} className={styles.saveButton}>
        <Button
          onClick={handleOk}
          color={colorOk}
          variant={"contained"}
          data-testid="ok-button"
          disabled={disabled}
        >
          {/* <SaveIcon /> */}
          &nbsp;
          {buttonOk}
        </Button>
        {cancelButtonDisplay}
      </Grid>
    </Grid>
  );
};
