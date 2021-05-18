import React, { useState, useEffect } from "react";
import styles from "./Partner.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import { Button } from "../../../components/UI/Form/Button/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AddEditForm } from "../../../components/UI/AddEditForm/AddEditForm";
import Input from "../../../components/UI/Form/Input/Input";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Alert from "../../../components/UI/Alert/Alert";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import * as routeConstant from "../../../common/RouteConstants";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "../../../components/UI/Table/MaterialTable";
import Loading from "../../../components/UI/Layout/Loading/Loading";
import {
  SUCCESS,
  UPDATE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../common/MessageConstants";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import logout from "../../../containers/Auth/Logout/Logout";
import SimpleBackdrop from "../../../components/UI/Layout/Backdrop/Backdrop";
import {
  PG_CREATE_PARTNER,
  PG_UPDATE_PARTNER,
} from "../../../graphql/mutations/RaPartner";
export const PartnerForm: React.FC = (props: any) => {
  const [partnerName, setPartnerName] = useState("");
  const [pgpartnerId, setPGpartnerId] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  //table
  const column = [
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Phone", field: "phone" },
  ];

  const [isError, setIsError] = useState<any>({
    partnerName: "",
    address: "",
    email: "",
    phoneNumber: "",
    pgpartnerId:""
  });

  const history = useHistory();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [OBsubscription, setOBsubscription] = useState<any>(false);
  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });

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

// Graphql
const [createPartner] = useMutation(PG_CREATE_PARTNER);
const [updatePartner] = useMutation(PG_UPDATE_PARTNER);
  
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
    if (event.target.name === "partnerName") {
      setPartnerName(event.target.value);
    }
    if (event.target.name === "pgpartnerId") {
      setPGpartnerId(event.target.value);
    }
    if (event.target.name === "email") {
      setEmail(event.target.value);
    }
    if (event.target.name === "phoneNumber") {
      setPhoneNumber(event.target.value);
    }
    if (event.target.name === "address") {
      setAddress(event.target.value);
    }
    setSubmitDisabled(checkValidation);
  };

  const checkValidation = () => {
    let validation = false;
    if (isError.partnerName !== "" && isError.address !== "") {
      validation = true;
    }
    return validation;
  };

  const handleSubmit = () => {
    if(props.location.pathname.includes("/pg-partner-form/edit")){
      // OrgDataByPgID() 
      UpdatePartner()
    }else {
      CreatePartner()
    }
  };

  const CreatePartner = () => {
    createPartner({
      variables: {
        input: {
          partnerName: partnerName,
          emailId: email,
          mobileNumber: phoneNumber,
          address: address,
          pg360PartnerId: pgpartnerId,
          subscription: OBsubscription ? "Yes" : "No"
        }
      },
          context :{
            headers: {
              // any other headers you require go here
              'Authorization':  'jwt' + " " +  localStorage.getItem("session") 
            },
          }
    }).then((res: any) => {
      setFormState((formState) => ({
        ...formState,
        isSuccess: true,
        isUpdate: false,
        isDelete: false,
        isFailed: false,
        errMessage: " " + partnerName + " ",
      }));
      // backToList();
    })
    .catch((err) => {
      // setLoader(false)
      let error = err.message;
      if (
        error.includes(
          "duplicate key value violates unique constraint"
        )
      ) {
        error = " Partner Name Already Exists ";
      }
       else {
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

  const UpdatePartner = () => {
    updatePartner({
      variables: {
        pg360parterid: pgpartnerId,
        input: {
          partnerName: partnerName,
          emailId: email,
          mobileNumber: phoneNumber,
          address: address,
          subscription: OBsubscription ? "Yes" : "No"
        }
      },
          context :{
            headers: {
              // any other headers you require go here
              'Authorization':  'jwt' + " " +  localStorage.getItem("session") 
            },
          }
    }).then((res: any) => {
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: true,
        isDelete: false,
        isFailed: false,
        errMessage: " " + partnerName + " ",
      }));
      // backToList();
    })
    .catch((err) => {
      // setLoader(false)
      let error = err.message;
      if (
        error.includes(
          "duplicate key value violates unique constraint"
        )
      ) {
        error = " Partner Name Already Exists ";
      }
       else {
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

  const backToList = ()=>{
    history.push("/pg-action");
  };

  const handleSubscription = (
    event: any,
    value: React.SetStateAction<boolean>
  ) => {
    if (event.target.name === "OBsubscription") {
      setOBsubscription(value);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        {props.location.pathname.includes("/pg-partner-form/edit") ? "Edit Partner " : "Add Partner "} 
      </Typography>
      { showBackdrop ? <SimpleBackdrop /> : null}
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
              User<strong>{formState.errMessage}</strong>
              {UPDATE}
            </Alert>
          ) : null}
        </Grid>
        {/* <AddEditForm
          handleOk={handleSubmit}
        > */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Input
                type="text"
                label="PG Partner ID"
                name="pgpartnerId"
                value={pgpartnerId}
                onChange={handleChange}
              >
                Partner Name
              </Input>
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                type="text"
                label="Partner Name"
                name="partnerName"
                value={partnerName}
                onChange={handleChange}
              >
                Partner Name
              </Input>
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                type="text"
                label="Email"
                name="email"
                value={email}
                onChange={handleChange}
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
            <Grid item xs={12} md={6}>
              <Input
                type="text"
                label="Address"
                name="address"
                value={address}
                onChange={handleChange}
              >
                Address
              </Input>
            </Grid>
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
            <Grid item xs={12} md={6}>
          <Button
            // className={styles.ContinueButton}
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            // type="submit"
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
        {/* </AddEditForm> */}
    </React.Fragment>
  );
};

export default PartnerForm;
