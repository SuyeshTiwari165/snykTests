import React, { useState, useEffect } from "react";
// import styles from "./PartnerUserForm.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography, FormHelperText } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Alert from "../../../components/UI/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {
    FAILED,
    SUCCESS,
    ALERT_MESSAGE_TIMER,
    DELETE,
  } from "../../../common/MessageConstants";
import Input from "../../../components/UI/Form/Input/Input";
import { Button } from "../../../components/UI/Form/Button/Button";
import { useHistory } from "react-router-dom";
import { useMutation, FetchResult, useLazyQuery,useQuery } from "@apollo/client";
import { PG_DELETE_CLIENT } from "../../../graphql/mutations/Clients";


export const DeleteClient: React.FC = (props: any) => {

  const history = useHistory();
  const [pgClientID, setPgClientID] = useState("");
  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });
  let PartnerID: any

  const [deleteClient] = useMutation(PG_DELETE_CLIENT);


  useEffect(() => {
    if (
      formState.isDelete === true ||
      formState.isFailed === true ||
      formState.isSuccess === true ||
      formState.isUpdate === true
    ) {
      setTimeout(function () {
        handleAlertClose();
      }, ALERT_MESSAGE_TIMER);
    }
  }, [formState]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "pgClientID") {
      setPgClientID(event.target.value);
    }
  };

  const handleAlertClose = () => {
    setFormState((formState) => ({
      ...formState,
      isSuccess: false,
      isUpdate: false,
      isDelete: false,
      isFailed: false,
      errMessage: "",
    }));
  }

  const handleSubmit = () => {
    
    deleteClient({
      variables: {
        pg360ClientId: JSON.parse(pgClientID)
      },
      context: {
        headers: {
          // any other headers you require go here
          Authorization: "jwt" + " " + localStorage.getItem("session"),
        },
      },
    })
    .then((res: any) => {
      if(res.data.deleteClient.status === "Client is deleted") {
      // setPgID("")
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: true,
        isFailed: false,
        errMessage: " " + "Client" + " ",
      }));
    }
    else{
      let error = res.data.deleteClient.status;        
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: " " + error,
      }));
    }
      // backToList();
    })
    .catch((err) => {
      let error = err.message;
      if (
        error.includes("duplicate key value violates unique constraint")
      ) {
        error = "Client Already Exists ";
      } else {
        error = err.message;
      }
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: error,
      }));
    });

  }
  const backToList = () => {
    history.push("/pg-action");
}


  return (
    <div>
      <React.Fragment>
        <CssBaseline />
        <Typography component="h5" variant="h1">
          <div>Delete Client</div>
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {formState.isFailed ? (
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleAlertClose}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {FAILED}
                {formState.errMessage}
              </Alert>
            ) : null}
            {formState.isSuccess ? (
              <Alert
                severity="success"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleAlertClose}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                User<strong>{formState.errMessage}</strong>
                {SUCCESS}
              </Alert>
            ) : null}
             {formState.isDelete ? (
              <Alert
                severity="success"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleAlertClose}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                User<strong>{formState.errMessage}</strong>
                {DELETE}
              </Alert>
            ) : null}
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              type="text"
              label="PG Client ID"
              name="pgClientID"
              value={pgClientID}
              onChange={handleChange}
            >
              PG Client ID
            </Input>
          </Grid>
          </Grid>
          <Grid item xs={12} md={6} >
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Grid>
        <Grid item xs={6}>
        <Button
          variant={"contained"}
          onClick={backToList}
          color="secondary"
          data-testid="cancel-button"
        >
          {"Cancel"}
        </Button>
        </Grid>
      </React.Fragment>
    </div>
  );
};
export default DeleteClient;
