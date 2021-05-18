import React, { useEffect, useState } from "react";
import styles from "./ClientForm.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import { Button } from "../../../components/UI/Form/Button/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AddEditForm } from "../../../components/UI/AddEditForm/AddEditForm";
import Input from "../../../components/UI/Form/Input/Input";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Alert from "../../../components/UI/Alert/Alert";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {
  SUCCESS,
  UPDATE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../common/MessageConstants";
import { useHistory } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { PG_ADD_CLIENT , PG_UPDATE_CLIENT } from "../../../graphql/mutations/Clients";
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';


export const ClientForm: React.FC = (props: any) => {
  const history = useHistory();
  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<any>(true);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [OBsubscription, setOBsubscription] = useState<any>(false);
  const [isError, setIsError] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [ContactId, setContactId] = useState("");
  const [pgClientId, setPgClientId] = useState("");
  const [pgPartnerId, setPgPartnerId] = useState("");
  // const [emailUpdates, setEmailUpdates] = React.useState({
  //   checkedB: false,
  // });
  const [createClient] = useMutation(PG_ADD_CLIENT);
  const [updateClient] = useMutation(PG_UPDATE_CLIENT);


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

  const handleSubscription = (
    event: any,
    value: React.SetStateAction<boolean>
  ) => {
    if (event.target.name === "OBsubscription") {
      setOBsubscription(value);
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
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "pgClientId") {
      setPgClientId(event.target.value);
    }
    // if (event.target.name === "pgPartnerID") {
    //   setPgPartnerID(event.target.value);
    // }
    if (event.target.name === "FirstName") {
      setFirstName(event.target.value);
    }
    if (event.target.name === "LastName") {
      setLastName(event.target.value);
    }
    if (event.target.name === "email") {
      setEmail(event.target.value);
    }
    if (event.target.name === "phoneNumber") {
      setPhoneNumber(event.target.value);
    }
    if (event.target.name === "pgPartnerId") {
      setPgPartnerId(event.target.value);
    }
  };

  const handleSubmit = () => {
    if (props.location.pathname.includes("/pg-client-form/add")) {
      createClient({
        variables: {
          input: {
            pg360partnerId: pgPartnerId,
            clientName: firstName + lastName,
            emailId: email,
            mobileNumber: phoneNumber,
            // address: addre,
            mailSend: false,
            pg360ClientId:pgClientId,
            subscription: OBsubscription ? "Yes" : "No"
          }
        },
        context: {
          headers: {
            // any other headers you require go here
            Authorization: "jwt" + " " + localStorage.getItem("session"),
          },
        },
      }).then((res: any) => {
        // if(res.data.deletePartner.status === "Partner is deleted") {
        // setPgID("")
        setFormState((formState) => ({
          ...formState,
          isSuccess: true,
          isUpdate: false,
          isDelete: false,
          isFailed: false,
          errMessage: " " + "Client" + " ",
        }));
        // backToList();
      })
      .catch((err) => {
        let error = err.message;
        if (
          error.includes("duplicate key value violates unique constraint")
        ) {
          error = " Partner User Already Exists ";
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
    if (props.location.pathname.includes("/pg-client-form/edit")) {
      updateClient({
        variables: {
          pgclientid : pgClientId,
          input: {
            clientName: firstName + lastName,
            emailId: email,
            mobileNumber: phoneNumber,
            // address: addre,
            mailSend: false,
            subscription: OBsubscription ? "Yes" : "No"
          }
        },
        context: {
          headers: {
            // any other headers you require go here
            Authorization: "jwt" + " " + localStorage.getItem("session"),
          },
        },
      }).then((res: any) => {
        // if(res.data.deletePartner.status === "Partner is deleted") {
        // setPgID("")
        setFormState((formState) => ({
          ...formState,
          isSuccess: false,
          isUpdate: true,
          isDelete: false,
          isFailed: false,
          errMessage: " " + "Client" + " ",
        }));
        // backToList();
      })
      .catch((err) => {
        let error = err.message;
        if (
          error.includes("duplicate key value violates unique constraint")
        ) {
          error = " Partner User Already Exists ";
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
  };

  const backToList = () => {
    history.push("/pg-action");
    setIsError({ error: null });
    setContactId("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setOBsubscription(false);
    // setCreateFlag(false);
  };
  // const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setEmailUpdates({ ...emailUpdates, [event.target.name]: event.target.checked });
  // };
  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        {<div> {props.location.pathname.includes("/pg-client-form/edit") ? "Edit Client" : "Add Client"} </div>}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
              Client<strong>{formState.errMessage}</strong>
              {SUCCESS}
            </Alert>
          ) : null}
          {formState.isUpdate ? (
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
              Client<strong>{formState.errMessage}</strong>
              {UPDATE}
            </Alert>
          ) : null}
        </Grid>
        {props.location.pathname.includes("/pg-client-form/add") ?
          <Grid item xs={12} md={6}>
            <Input
              type="text"
              label="PG Partner ID"
              name="pgPartnerId"
              value={pgPartnerId}
              onChange={handleChange}
            >
              PG User ID
            </Input>
          </Grid>
        : null}
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="PG Client ID"
            name="pgClientId"
            value={pgClientId}
            onChange={handleChange}
          >
            PG Client ID
            </Input>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="First Name *"
            name="FirstName"
            value={firstName}
            onChange={handleChange}
            error
            helperText={isError.firstName}
          >
            First Name
            </Input>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="Last Name *"
            name="LastName"
            value={lastName}
            onChange={handleChange}
            error
            helperText={isError.lastName}
          >
            Last Name
            </Input>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="Email *"
            name="email"
            value={email}
            onChange={handleChange}
            error
            helperText={isError.email}
          >
            E-mail
            </Input>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="Phone Number"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleChange}
          >
            Phone Number
            </Input>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={6} className={styles.SubscriptionBox}>
                  <FormControlLabel
                    control={
                      <Switch
                        // disabled={
                        //   subscriptionList
                        //     ? !subscriptionList.ra_subscription
                        //     : false
                        // }
                        checked={OBsubscription}
                        onChange={handleSubscription}
                        name="OBsubscription"
                        color="primary"
                      />
                    }
                    label="OB Subscription"
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid item xs={12} md={6}>
          <FormControlLabel
            className={styles.CheckboxLabel}
        control={
          <Checkbox
            checked={emailUpdates.checkedB}
            onChange={handleCheckBoxChange}
            color="primary"
            name="checkedB"
            // value={emailUpdates}
          />
        }
        label="Do Not Email"
      />
      </Grid> */}
            <Grid item xs={12} md={6}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
            >
              Submit
          </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant={"contained"}
              onClick={backToList}
              color="secondary"
              data-testid="cancel-button"
            >
              {"Cancel"}
            </Button>
          </Grid>
          </Grid>

        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default ClientForm;
