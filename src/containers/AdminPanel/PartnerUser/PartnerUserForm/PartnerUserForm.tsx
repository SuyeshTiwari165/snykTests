import React, { useState, useEffect } from "react";
import styles from "./PartnerUserForm.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography, FormHelperText } from "@material-ui/core";
import { Button } from "../../../../components/UI/Form/Button/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AddEditForm } from "../../../../components/UI/AddEditForm/AddEditForm";
import Input from "../../../../components/UI/Form/Input/Input";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Alert from "../../../../components/UI/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "../../../../components/UI/Table/MaterialTable";
import Loading from "../../../../components/UI/Layout/Loading/Loading";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {
  useQuery,
  useMutation,
  FetchResult,
  useLazyQuery,
} from "@apollo/client";
import AutoCompleteDropDown from "../../../../components/UI/Form/Autocomplete/Autocomplete";
import * as validations from "../../../../common/validateRegex";
import logout from "../../../Auth/Logout/Logout";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import * as routeConstant from "../../../../common/RouteConstants";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { GET_PARTNER_USER, GET_PARTNER_USERDETAILS, GET_PARTNER_ID_USER } from "../../../../graphql/queries/PartnerUser";
import { CREATE_PARTNER_USER, UPDATE_PARTNER_USER } from "../../../../graphql/mutations/PartnerUser";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../../common/MessageConstants";

interface partnerValues {
  id: number;
  name: string;
  __typename: string;
}

export const PartnerUserForm: React.FC = (propsData: any) => {
  // console.log("Partner user props >", propsData.location.state);
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [partnerUserID, setPartnerUserID] = useState("");
  const [partnerID, setPartnerID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rowData, setRowData] = useState<any>();
  const [passRegError, setPassRegError] = useState(false);
  const [confirmPassError, setConfirmPassError] = useState(false);
  const [isError, setIsError] = useState<any>({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    phoneNumber: "",
  });
  const contact = JSON.parse(localStorage.getItem("contact") || "{}");
  let partnerdata: any;
  if (propsData.location.state !== null) {
    partnerdata = propsData.location.state
      ? propsData.location.state
      : null;
  }
  const user = JSON.parse(localStorage.getItem("user") || "{}");


  const [getpartnerUserData, { data: PartneruserData, loading: loadPartner }] = useLazyQuery(
    GET_PARTNER_ID_USER, {
    onCompleted: (data: any) => {
      setRowData(true)
      setPartnerID(data.getPartnerUserDetails.edges[0].node.partnerId)
      setPartnerUserID(data.getPartnerUserDetails.edges[0].node.userId.id)
      setFirstName(data.getPartnerUserDetails.edges[0].node.userId.firstName)
      setLastName(data.getPartnerUserDetails.edges[0].node.userId.lastName)
      setEmail(data.getPartnerUserDetails.edges[0].node.userId.email)
      setPhoneNumber(data.getPartnerUserDetails.edges[0].node.mobileNumber)
    }, fetchPolicy: "cache-and-network",
    // onError: (error: any) => {
    //   logout()
    // }
  },

  );
  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });

  const [createPartnerUser] = useMutation(CREATE_PARTNER_USER);
  const [updatePartnerUser] = useMutation(UPDATE_PARTNER_USER);

  useEffect(() => {
    if (propsData.location.pathname.includes("/partner-user-form/edit"))
      getpartnerUserData({
        variables: {
          userId: propsData.location.state.rowData ? propsData.location.state.rowData.email : propsData.location.state.email
        },
      })
  }, []);

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
    if (formState.isSuccess === true || formState.isUpdate === true) {
      console.log("propsData",propsData);
      if (propsData.location.state != null) {
        propsData.location.state.formState = formState;
        backToList();
      }
    }
  }, [formState]);

  if (loadPartner) return <Loading />;
  // if (errorOrg) {
  //   let error = { message: "Error" };
  //   return (
  //     <div className="error">
  //       Error!
  //       {logout()}
  //     </div>
  //   );
  // }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "firstName") {
      setFirstName(event.target.value);
      let err =
        event.target.value === "" || null ? "First Name is Required" : "";
      setIsError((error: any) => ({
        ...error,
        firstName: err,
      }));
    }
    if (event.target.name === "lastName") {
      setLastName(event.target.value);
      let err =
        event.target.value === "" || null ? " Last Name is Required" : "";
      setIsError((error: any) => ({
        ...error,
        lastName: err,
      }));
    }
    if (event.target.name === "email") {
      let errors = "";
      setEmail(event.target.value);
      let err = event.target.value === "" || null ? "Email is Required" : "";
      setIsError((error: any) => ({
        ...error,
        email: err,
      }));
      if (!err) {
        if (!validations.EMAIL_REGEX.test(event.target.value)) {
          errors = "Please enter valid email address.";
          setIsError((error: any) => ({
            ...error,
            email: errors,
          }));
        }
      }
    }
    if (event.target.name === "phoneNumber") {
      setPhoneNumber(event.target.value);
    }
    setSubmitDisabled(checkValidation);
  };

  const checkValidation = () => {
    let validation = false;
    // if (isError.partnerName !== "" && isError.address !== "") {
    //   validation = true;
    // }
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
    history.push(routeConstant.PARTNER_USER, propsData.location.state);
  };
  const handleInputErrors = () => {
    let foundErrors = false;
    if (!firstName) {
      let err = "First Name is Required";
      setIsError((error: any) => ({
        ...error,
        firstName: err,
      }));
      foundErrors = true;
    }
    if (!lastName) {
      let err = "Last Name is Required";
      setIsError((error: any) => ({
        ...error,
        lastName: err,
      }));
      foundErrors = true;
    }
    if (!email) {
      let errors = "Email is Required";
      setIsError((error: any) => ({
        ...error,
        email: errors,
      }));
      foundErrors = true;
    }
    if (email && !validations.EMAIL_REGEX.test(email)) {
      let errors = "Please enter valid email address.";
      setIsError((error: any) => ({
        ...error,
        email: errors,
      }));
      foundErrors = true;
    }
    if (!password && !rowData) {
      let errors = "Password is Required";
      setIsError((error: any) => ({
        ...error,
        password: errors,
      }));
      foundErrors = true;
    }
    if (!confirmPassword && !rowData) {
      let errors = "Confirm Password is Required";
      setIsError((error: any) => ({
        ...error,
        confirmPassword: errors,
      }));
      foundErrors = true;
    }
    if (confirmPassword && password != confirmPassword) {
      setConfirmPassError(true);
      foundErrors = true;
    }
    // if (password && !validations.PASSWORD_REGEX.test(password))  {
    //     setPassRegError(true);
    //   foundErrors = true;
    // }

    return foundErrors;
  };
  const handleSubmit = () => {
    if (!handleInputErrors()) {
      if (propsData.location.pathname.includes("/partner-user-form/edit")) {
        updateIntoUser();
      } else {
        insertIntoUser();
      }
    }
  };

  const insertIntoUser = () => {
    createPartnerUser({
      variables: {
        input: {
          partnerId: propsData.location.state.partner_id,
          firstName: firstName,
          lastName: lastName,
          username: email.toLowerCase(),
          password: password,
          mobileNumber: phoneNumber
        }
      }
    }).then((response: any) => {
      setFormState((formState) => ({
        ...formState,
        isSuccess: true,
        isUpdate: false,
        isDelete: false,
        isFailed: false,
        errMessage: " " + firstName + " " + lastName + " ",
      }));
      // backToList();
    })
    .catch((err) => {
      let error = err.message;
      if (
        error.includes(
          "duplicate key value violates unique constraint"
        )
      ) {
        error = " Email already exists.";
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
  };

  const updateIntoUser = () => {
    if (password) {
      updatePartnerUser({
        variables: {
          id: partnerUserID,
          userdata: {
            firstName: firstName,
            lastName: lastName,
            username: email.toLowerCase(),
            password: password,
            mobileNumber: phoneNumber
          }
        }
      }).then((response: any) => {
      console.log("response",response)
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: true,
        isDelete: false,
        isFailed: false,
        errMessage: " " + firstName + " " + lastName + " ",
      }));
      // backToList();
      })
    }else {
      updatePartnerUser({
        variables: {
          id: partnerUserID,
          userdata: {
            firstName: firstName,
            lastName: lastName,
            username: email.toLowerCase(),
            mobileNumber: phoneNumber
          }
        }
      }).then((response: any) => {
        console.log("response", response)
        backToList();
      })
    }
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handlePasswordChange = () => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
    let err = event.target.value === "" || null ? "Password is Required" : "";
    setIsError((error: any) => ({
      ...error,
      password: err,
    }));
    // setPasswordError(false);
  };
  const handleConfirmPasswordChange = () => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
    let err =
      event.target.value === "" || null ? "Confirm Password is Required" : "";
    setIsError((error: any) => ({
      ...error,
      confirmPassword: err,
    }));
    if (password != event.target.value) {
      setConfirmPassError(true);
    } else {
      setConfirmPassError(false);
      setIsError({ error: null });
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        <div>
          {rowData ? "Edit User: " : "Add User "}
          {rowData ? rowData.name : null}
        </div>
      </Typography>
      <AddEditForm handleOk={handleSubmit} handleCancel={backToList}>
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
          </Grid>
          <Grid item xs={6}>
            <Input
              type="text"
              label="First Name*"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              error={isError.firstName}
              helperText={isError.firstName}
            >
              First Name
            </Input>
          </Grid>
          <Grid item xs={6}>
            <Input
              type="text"
              label="Last Name*"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              error={isError.lastName}
              helperText={isError.lastName}
            >
              Last Name
            </Input>
          </Grid>
          <Grid item xs={6}>
            <Input
              type="text"
              label="Email*"
              name="email"
              value={email}
              onChange={handleChange}
              error={isError.email}
              helperText={isError.email}
            >
              E-mail
            </Input>
          </Grid>
          <Grid item xs={6}>
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
          <Grid item xs={6} className={styles.ConfirmPasswordWrap}>
            <FormControl className={styles.TextField} variant="outlined">
              <InputLabel classes={{ root: styles.FormLabel }}>
                Password*
              </InputLabel>
              <OutlinedInput
                classes={{
                  root: styles.InputField,
                  notchedOutline: styles.InputField,
                  focused: styles.InputField,
                }}
                type={showPassword ? "text" : "password"}
                label="Password*"
                value={password}
                onChange={handlePasswordChange()}
                name="password"
                required
                error={isError.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
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
          {!rowData ? (
            <Grid item xs={6} className={styles.ConfirmPasswordWrap}>
              <FormControl className={styles.TextField} variant="outlined">
                <InputLabel classes={{ root: styles.FormLabel }}>
                  Confirm Password*
                </InputLabel>
                <OutlinedInput
                  classes={{
                    root: styles.InputField,
                    notchedOutline: styles.InputField,
                    focused: styles.InputField,
                  }}
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password*"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange()}
                  name="confirmPassword"
                  required
                  error={isError.confirmPassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                            <VisibilityOff />
                          )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {isError.confirmPassword ? (
                  <FormHelperText
                    error={isError.confirmPassword}
                    classes={{ root: styles.FormHelperText }}
                  >
                    Confirm Password is Required.
                  </FormHelperText>
                ) : null}
                {confirmPassError ? (
                  isError.confirmPassword ? null : (
                    <FormHelperText classes={{ root: styles.FormHelperText }}>
                      Confirm Password should be same
                    </FormHelperText>
                  )
                ) : null}
              </FormControl>
            </Grid>
          ) : null}
        </Grid>
      </AddEditForm>
    </React.Fragment>
  );
};

export default PartnerUserForm;
