import React, { useState, useEffect } from "react";
import styles from "./PartnerUserForm.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography, FormHelperText } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Input from "../../../components/UI/Form/Input/Input";
import Alert from "../../../components/UI/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {
  useMutation,
  FetchResult,
  useLazyQuery,
  useQuery,
} from "@apollo/client";
import { CREATE_USER, UPDATE_USER } from "../../../graphql/mutations/User";
import { GET_ROLE } from "../../../graphql/queries/User";
import { CompanyUser } from "../../../common/Roles";
import { useHistory } from "react-router-dom";
import * as routeConstant from "../../../common/RouteConstants";
import {
  FAILED,
  SUCCESS,
  ALERT_MESSAGE_TIMER,
  UPDATE,
} from "../../../common/MessageConstants";
import { Button } from "../../../components/UI/Form/Button/Button";
import {
  PG_CREATE_USER,
  PG_UPDATE_USER,
} from "../../../graphql/mutations/Registration";

export const PartnerUserForm: React.FC = (propsData: any) => {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [pgID, setPgID] = useState("");
  const [pgUserID, setPgUserID] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  // const [partnerID, setPartnerID] = useState<any>();
  let PartnerID: any;

  const [createPartnerUser] = useMutation(PG_CREATE_USER);
  const [updatePartnerUser] = useMutation(PG_UPDATE_USER);

  // const [confirmPassError, setConfirmPassError] = useState(false);
  const [isError, setIsError] = useState<any>({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    phoneNumber: "",
    pgID: "",
    pgUserID: "",
  });
  const contact = JSON.parse(localStorage.getItem("contact") || "{}");
  let partnerUserdata: any;
  if (propsData.location.state !== null) {
    partnerUserdata = propsData.location.state
      ? propsData.location.state.propsData
      : null;
  }

  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });

  // const [getRole, { data: userData, loading: userLoading }] = useLazyQuery(
  //   GET_ROLE,
  //   {
  //     fetchPolicy: "cache-and-network",
  //     onCompleted: () => {},
  //     onError: () => {
  //       setShowBackdrop(false);
  //       history.push(routeConstant.ADMIN_DASHBOARD);
  //     },
  //   }
  // );

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
    if (event.target.name === "pgUserID") {
      setPgUserID(event.target.value);
    }
    if (event.target.name === "pgID") {
      setPgID(event.target.value);
    }
    if (event.target.name === "firstName") {
      setFirstName(event.target.value);
    }
    if (event.target.name === "lastName") {
      setLastName(event.target.value);
    }
    if (event.target.name === "email") {
      let errors = "";
      setEmail(event.target.value);
    }
    if (event.target.name === "phoneNumber") {
      setPhoneNumber(event.target.value);
    }
    setSubmitDisabled(checkValidation);
  };

  const checkValidation = () => {
    let validation = false;
    return validation;
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

  const backToList = () => {
    history.push("/pg-action");
  };

  const handleSubmit = () => {
    // if (!handleInputErrors()) {
    if (propsData.location.pathname.includes("/pg-partner-user-form/edit")) {
      updatePartnerUser({
        variables: {
          pg360UserId: pgUserID,
          input: {
            firstName: firstName,
            lastName: lastName,
            username: email,
            password: password,
            mobileNumber: phoneNumber,
            // email: email
          },
        },
        context: {
          headers: {
            // any other headers you require go here
            Authorization: "jwt" + " " + localStorage.getItem("session"),
          },
        },
      })
        .then((res: any) => {
          // if(res.data.deletePartner.status === "Partner is deleted") {
          // setPgID("")
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: true,
            isDelete: false,
            isFailed: false,
            errMessage: " " + "User" + " ",
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
    if (propsData.location.pathname.includes("/pg-partner-user-form/add")) {
      createPartnerUser({
        variables: {
          input: {
            pg360partnerId: JSON.parse(pgID),
            firstName: firstName,
            lastName: lastName,
            username: email,
            // email: email,
            mobileNumber: phoneNumber,
            pg360UserId: JSON.parse(pgUserID),
            password : password
          },
        },
        context: {
          headers: {
            // any other headers you require go here
            Authorization: "jwt" + " " + localStorage.getItem("session"),
          },
        },
      })
        .then((res: any) => {
          // if(res.data.deletePartner.status === "Partner is deleted") {
          // setPgID("")
          setFormState((formState) => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: " " + "User" + " ",
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

  const handlePasswordChange =
    () => (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
      let err = event.target.value === "" || null ? "Password is Required" : "";
      setIsError((error: any) => ({
        ...error,
        password: err,
      }));
    };

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        <div>
          {propsData.location.pathname.includes("/pg-partner-user-form/edit")
            ? "Edit User "
            : "Add User "}
          {/* {rowData ? rowData.contact_id.name : null} */}
        </div>
      </Typography>

      {/* <AddEditForm handleOk={handleSubmit} handleCancel={backToList}> */}
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
        {!propsData.location.pathname.includes(
          "/pg-partner-user-form/edit/"
        ) ? (
          <Grid item xs={12} md={6}>
            <Input
              type="text"
              label="PG Partner ID"
              name="pgID"
              value={pgID}
              onChange={handleChange}
              error={isError.pgID}
              helperText={isError.pgID}
            >
              Pg Id
            </Input>
          </Grid>
        ) : null}
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="PG User ID"
            name="pgUserID"
            value={pgUserID}
            onChange={handleChange}
            error={isError.pgUserID}
            helperText={isError.pgUserID}
          >
            pgUserID
          </Input>
        </Grid>

        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="Phone Number"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleChange}
            error={isError.phoneNumber}
            helperText={isError.phoneNumber}
          >
            Phone Number
          </Input>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={handleChange}
            error={isError.firstName}
            helperText={isError.firstName}
          >
            First Name
          </Input>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={handleChange}
            error={isError.lastName}
            helperText={isError.lastName}
          >
            Last Name
          </Input>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="Email"
            name="email"
            value={email}
            onChange={handleChange}
            error={isError.email}
            helperText={isError.email}
          >
            E-mail
          </Input>
        </Grid>

        <Grid item xs={12} md={6} className={styles.ConfirmPasswordWrap}>
          <FormControl className={styles.TextField} variant="outlined">
            <InputLabel classes={{ root: styles.FormLabel }}>
              Password
            </InputLabel>
            <OutlinedInput
              classes={{
                root: styles.InputField,
                notchedOutline: styles.InputField,
                focused: styles.InputField,
              }}
              // type={showPassword ? "text" : "password"}
              type={"text"}
              label="Password"
              value={password}
              onChange={handlePasswordChange()}
              name="password"
              required
              error={isError.password}
              // endAdornment={
              //   <InputAdornment position="end">
              //     <IconButton
              //       aria-label="toggle password visibility"
              //       onClick={() => {
              //         setShowPassword(!showPassword);
              //       }}
              //       onMouseDown={handleMouseDownPassword}
              //       edge="end"
              //     >
              //       {showPassword ? <Visibility /> : <VisibilityOff />}
              //     </IconButton>
              //   </InputAdornment>
              // }
            />
            {isError.password ? (
              <FormHelperText
                error={isError.password}
                classes={{ root: styles.FormHelperText }}
              >
                Password is Required.
              </FormHelperText>
            ) : null}
          </FormControl>
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

export default PartnerUserForm;
