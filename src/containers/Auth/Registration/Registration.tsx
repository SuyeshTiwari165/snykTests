import React, { useEffect, useState } from "react";
import { Typography, FormHelperText } from "@material-ui/core";
import styles from "./Registration.module.css";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Button } from "../../../components/UI/Form/Button/Button";
import { Redirect, Link } from "react-router-dom";
import * as validations from "../../../common/validateRegex";
import * as routeConstant from "../../../common/RouteConstants";
// import { GET_ROLE } from "../../../graphql/queries/User";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
// import {
//   CREATE_CONTACT,
//   CREATE_USER,
//   CREATE_INDIVIDUAL
// } from "../../../graphql/mutations/Registration";
// import {
//   useQuery,
//   useLazyQuery,
//   useMutation,
//   ApolloError,
//   FetchResult
// } from "../../../config/node_modules/@apollo/client";
import { CompanyUser } from "../../../common/Roles";
export interface RegistrationProps {}

export const Registration: React.SFC<RegistrationProps> = () => {
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState();
  // const [createContact] = useMutation(CREATE_CONTACT);
  // const [createUser] = useMutation(CREATE_USER);
  // const [createIndividual] = useMutation(CREATE_INDIVIDUAL);
  const [ifSuccess, setIfSuccess] = useState(false);

  // const [
  //   getRole,
  //   { data: userData, error: userError, loading: userLoading }
  // ] = useLazyQuery(GET_ROLE);

  useEffect(() => {
    // getRole();
  }, []);

  let UserRole: any;
  // useEffect(() => {
  //   if (userData) {
  //     for (let i in userData.roles) {
  //       if (userData.roles[i].name === CompanyUser)
  //         UserRole = parseInt(userData.roles[i].id);
  //     }
  //   }
  //   setUserRole(UserRole);
  // }, [userData]);

  const handlePasswordChange = () => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
    setPasswordError(false);
  };

  const handleFirstNameChange = () => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFirstName(event.target.value);
    setFirstNameError(false);
  };

  const handleLastNameChange = () => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLastName(event.target.value);
    setLastNameError(false);
  };

  const handleEmailChange = () => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(event.target.value);
    setEmailError(false);
  };

  const handlePhoneNumberChange = () => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPhoneNumber(event.target.value);
    setPhoneNumberError(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleInputErrors = () => {
    let foundErrors = false;
    if (!firstName) {
      setFirstNameError(true);
      foundErrors = true;
    } else if (firstName) {
      setFirstNameError(false);
    }
    if (!lastName) {
      setLastNameError(true);
      foundErrors = true;
    } else if (lastName) {
      setLastNameError(false);
    }
    if (!email || !validations.EMAIL_REGEX.test(email)) {
      setEmailError(true);
      foundErrors = true;
    } else if (email) {
      setEmailError(false);
    }
    if (!phoneNumber || !validations.PHONE_REGEX.test(phoneNumber)) {
      setPhoneNumberError(true);
      foundErrors = true;
    } else if (phoneNumber) {
      setPhoneNumberError(false);
    }
    if (!password || !validations.PASSWORD_REGEX.test(password)) {
      setPasswordError(true);
      foundErrors = true;
    } else if (password) {
      setPasswordError(false);
    }

    return foundErrors;
  };

  const insertIntoUser = () => {
    // if (userRole) {
    //   createUser({
    //     variables: {
    //       username: email.toLowerCase(),
    //       email: email.toLowerCase(),
    //       password: password,
    //       role: userRole,
    //       confirmed: true
    //     }
    //   })
    //     .then(userRes => {
    //       insertIntoContact(userRes);
    //     })
    //     .catch(err => {
    //       // setErrorMessage('We are unable to register, kindly contact your technical team.');
    //     });
    // }
  };

  const insertIntoContact = (
    // userRes: FetchResult<any, Record<string, any>, Record<string, any>>
  ) => {
    // createContact({
    //   variables: {
    //     name: firstName + " " + lastName,
    //     email: email.toLowerCase(),
    //     phone: phoneNumber,
    //     contact_type: "Individual",
    //     user_id: userRes.data.createUser.user.id
    //   }
    // })
    //   .then(conRes => {
    //     insertIntoIndividual(conRes);
    //   })
    //   .catch(err => {});
  };

  const insertIntoIndividual = (
    // conRes: FetchResult<any, Record<string, any>, Record<string, any>>
  ) => {
    // createIndividual({
    //   variables: {
    //     first_name: firstName,
    //     last_name: lastName,
    //     contact_id: conRes.data.createContact.contact.id
    //   }
    // })
    //   .then(res => {
    //     setIfSuccess(true); // redirect user to login page
    //   })
    //   .catch(err => {});
  };

  const handleSubmit = () => {
    if (!handleInputErrors()) {
      insertIntoUser();
    }

    // if (!userNameError && !phoneNumberError && !passwordError) {
    //   axios
    //     .post(REACT_APP_GLIFIC_AUTHENTICATION_API, {
    //       user: {
    //         phone: phoneNumber,
    //       },
    //     })
    //     .then((response: any) => {
    //       setAuthMessage(response);
    //     })
    //     .catch((error: any) => {
    //       // For now let's set an error message manually till the backend give us nicer messages
    //       //setErrorMessage(error.response.data.error.message);
    //       setErrorMessage('We are unable to register, kindly contact your technical team.');
    //     });
    // }
  };

  if (ifSuccess) {
    return (
      <Redirect
        to={{
          pathname: routeConstant.LOGIN_URL
          // state: { from: props.location },
        }}
      />
    );
  }

  return (
    <div className={styles.Container}>
      <Card className={styles.root}>
        <Grid item xs={12} className={styles.Registration}>
          <div className={styles.Box}>
            <div className={styles.RegistrationLogo}>CyberCompliance360</div>
            <div className={styles.BoxTitle}>
              <Typography variant="h3" classes={{ root: styles.TitleText }}>
                Register
              </Typography>
            </div>
            {/* {ifEmailExist ? (
            <Collapse in={open}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {authPageConstants.EMAIL_ALREADY_EXIST}
              </Alert>
            </Collapse>
          ) : null}
          {ifFailure ? (
            <Collapse in={open}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {authPageConstants.REGISTER_ERROR}
              </Alert>
            </Collapse>
          ) : null} */}
            <div className={styles.CenterBox}>
              <div className={styles.Margin}>
                <FormControl variant="outlined">
                  <InputLabel classes={{ root: styles.FormLabel }}>
                    First Name*
                  </InputLabel>
                  <OutlinedInput
                    classes={{
                      root: styles.InputField,
                      notchedOutline: styles.InputField,
                      input: styles.Input
                    }}
                    data-testid="firstname"
                    error={firstNameError}
                    id="firstname"
                    label="First Name*"
                    type="text"
                    value={firstName}
                    onChange={handleFirstNameChange()}
                  />
                  {firstNameError ? (
                    <FormHelperText classes={{ root: styles.FormHelperText }}>
                      First Name required.
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </div>
              <div className={styles.Margin}>
                <FormControl variant="outlined">
                  <InputLabel classes={{ root: styles.FormLabel }}>
                    Last Name*
                  </InputLabel>
                  <OutlinedInput
                    classes={{
                      root: styles.InputField,
                      notchedOutline: styles.InputField,
                      input: styles.Input
                    }}
                    data-testid="lastname"
                    error={lastNameError}
                    id="lastname"
                    label="Last Name*"
                    type="text"
                    value={lastName}
                    onChange={handleLastNameChange()}
                  />
                  {lastNameError ? (
                    <FormHelperText classes={{ root: styles.FormHelperText }}>
                      Last Name required.
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </div>
              <div className={styles.Margin}>
                <FormControl variant="outlined">
                  <InputLabel classes={{ root: styles.FormLabel }}>
                    Email Address*
                  </InputLabel>
                  <OutlinedInput
                    classes={{
                      root: styles.InputField,
                      notchedOutline: styles.InputField,
                      input: styles.Input
                    }}
                    data-testid="email"
                    error={emailError}
                    id="email"
                    label="Email Address*"
                    type="text"
                    value={email}
                    onChange={handleEmailChange()}
                  />
                  {emailError ? (
                    <FormHelperText classes={{ root: styles.FormHelperText }}>
                      Please enter valid email address.
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </div>
              <div className={styles.Margin}>
                <FormControl variant="outlined">
                  <InputLabel classes={{ root: styles.FormLabel }}>
                    Password
                  </InputLabel>
                  <OutlinedInput
                    classes={{
                      root: styles.InputField,
                      notchedOutline: styles.InputField,
                      input: styles.Input
                    }}
                    data-testid="password"
                    error={passwordError}
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    onChange={handlePasswordChange()}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <Visibility classes={{ root: styles.IconButton }} />
                          ) : (
                            <VisibilityOff
                              classes={{ root: styles.IconButton }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />

                  {passwordError ? (
                    <FormHelperText classes={{ root: styles.FormHelperText }}>
                      Password must contain Uppercase character,<br></br>{" "}
                      Special character(@*&=+), Digits(0-9) <br></br>and minimum
                      8 characters.
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </div>
              <div className={styles.Margin}>
                <FormControl variant="outlined">
                  <InputLabel classes={{ root: styles.FormLabel }}>
                    Phone number
                  </InputLabel>
                  <OutlinedInput
                    classes={{
                      root: styles.InputField,
                      notchedOutline: styles.InputField,
                      input: styles.Input
                    }}
                    data-testid="phoneNumber"
                    error={phoneNumberError}
                    id="phone-number"
                    label="Your phone number"
                    type="integer"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange()}
                  />
                  {phoneNumberError ? (
                    <FormHelperText classes={{ root: styles.FormHelperText }}>
                      Please enter valid phone number.
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </div>
              {errorMessage &&
              !firstNameError &&
              !lastNameError &&
              !passwordError &&
              !phoneNumberError ? (
                <div className={styles.ErrorMessage}>{errorMessage}</div>
              ) : null}
              <div className={styles.Margin}>
                <Button
                  data-testid="registrationButton"
                  onClick={handleSubmit}
                  color="primary"
                  variant={"contained"}
                  className={styles.ContinueButton}
                >
                  CONTINUE
                </Button>
              </div>
            </div>

            <div className={styles.Or}>
              <div className={styles.OrText}>OR</div>
            </div>
            <div className={styles.Link}>
              <Link to="/login">LOGIN TO CyberCompliance360</Link>
            </div>
          </div>
        </Grid>
      </Card>
    </div>
  );
};

export default Registration;
