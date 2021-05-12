import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { FormHelperText, makeStyles, createStyles } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Button } from "../../../components/UI/Form/Button/Button";
import styles from "./Login.module.css";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import * as validations from "../../../common/validateRegex";
import clsx from "clsx";
import { USER_LOGIN } from "../../../graphql/mutations/User";
import { GET_PARTNER_ID_USER } from "../../../graphql/queries/PartnerUser";
import { GET_ADMIN_USER } from "../../../graphql/queries/User";
import Loading from "../../../components/UI/Layout/Loading/Loading";
import SimpleBackdrop from "../../../components/UI/Layout/Backdrop/Backdrop";
import Input from "../../../components/UI/Form/Input/Input";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import * as routeConstants from "../../../common/RouteConstants";

export interface LoginProps { }

const useStyles = makeStyles(() =>
  createStyles({
    continueButton: {
      width: "340px",
      borderRadius: "12px",
      marginTop: "0px",
      color: "white",
    },
    inputField: {
      lineHeight: "32px",
    },
    titleText: {
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#12173D",
      display: "flex",
      alignItems: "start",
    },
  })
);

export const Login: React.FC<LoginProps> = () => {
  let user_id: any;
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sessionToken, setSessionToken] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [foundErrors, setFoundError] = useState(false);
  const classes = useStyles();
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [getPartnerId, { data: dataPId, loading: loadingPId }] = useLazyQuery(
    GET_PARTNER_ID_USER, {
    onCompleted: (data: any) => {
      localStorage.setItem("partnerData", JSON.stringify(data.getPartnerUserDetails.edges[0].node));
      window.location.replace(routeConstants.DASHBOARD);
    },
    fetchPolicy: "cache-and-network",
  }
  );
  const [getAdminRole, { data: dataAD, loading: loadingAD }] = useLazyQuery(
    GET_ADMIN_USER, {
    onCompleted: (data: any) => {
      localStorage.setItem("user", JSON.stringify(data.getUserDetails.edges[0].node));
      if (data.getUserDetails.edges[0].node.isSuperuser == true) {
        window.location.replace(routeConstants.ADMIN_DASHBOARD);
      } else {
        getPartnerId({
          variables: {
            userId: data.getUserDetails.edges[0].node.username,
          },
          context :{
            headers: {
              // any other headers you require go here
              'Authorization':  'jwt' + " " +  localStorage.getItem("session") 
            },
          }
        })
      }
    },
    fetchPolicy: "cache-and-network",
  }
  );
  const handlePasswordChange = () => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
    setPasswordError(false);
  };
  const [login, { data }] = useMutation(USER_LOGIN);

  const handleEmailChange = () => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(event.target.value);
    if (event.target.value) {
      if (!validations.EMAIL_REGEX.test(event.target.value)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
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
    if (!email || !validations.EMAIL_REGEX.test(email)) {
      setEmailError(true);
      foundErrors = true;
    } else if (email) {
      setEmailError(false);
    }
    if (!password) {
      setPasswordError(true);
      foundErrors = true;
    } else if (password) {
      setPasswordError(false);
    }
    setFoundError(foundErrors);
    return foundErrors;
  };

  if (loadingAD || showLoading) {
    return <SimpleBackdrop />;
  }

  const onLogin = () => {
    handleInputErrors();
    if (!handleInputErrors()) {
      setShowLoading(true);
      login({
        variables: {
          username: email,
          password: password,
        },
      })
        .then((userRes) => {
          getAdminRole({
            variables: {
              userid: userRes.data.tokenAuth.payload.username
            },
            context :{
              headers: {
                // any other headers you require go here
                'Authorization':  'jwt' + " " + userRes.data.tokenAuth.token 
              },
            }
          })
          localStorage.setItem("session", userRes.data.tokenAuth.token);
        })
        .catch((Error) => {
          setInvalidLogin(true);
          setShowLoading(false);
        });
    }
  };

  return (
    <div className={styles.Container}>
      <Card className={styles.root}>
        <Grid item xs={12} className={styles.siteInfo}>
          <form className={styles.Login} onSubmit={onLogin} noValidate>
            <div className={styles.Box}>
              <div className={styles.RALogoImg}>
                <img
                    src={
                      process.env.PUBLIC_URL +
                      "/icons/svg-icon/risk-assessments.svg"
                    }
                    alt="user icon"
                  />
              </div>
              <div className={styles.cyberComplianceLogo}>
              OB360
              </div>
              <div className={styles.Margin}>
                <FormControl className={styles.TextField} variant="outlined">
                  <Input
                    type="email"
                    label="Email Address"
                    // name="email"
                    value={email}
                    id="email-id"
                    onChange={handleEmailChange()}
                    error={emailError}
                    required
                    data-testid="email-id"
                    classes={{
                      root: styles.InputField,
                      notchedOutline: styles.InputField,
                      focused: styles.InputField,
                    }}
                  >
                    E-mail
                  </Input>
                  {emailError ? (
                    <FormHelperText classes={{ root: styles.FormHelperText }}>
                      Please enter valid email address.
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </div>
              <div
                className={clsx(
                  styles.Margin,
                  styles.BottomMargin,
                  styles.PasswordField
                )}
              >
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
                    data-testid="password"
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    required
                    onChange={handlePasswordChange()}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {passwordError ? (
                    <FormHelperText classes={{ root: styles.FormHelperText }}>
                      Please enter a password.
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </div>
              {invalidLogin ? (
                <div className={styles.Errors}>
                  Incorrect username or password.
                </div>
              ) : null}
              <Button
                id = {"login"}
                className={styles.ContinueButton}
                onClick={onLogin}
                color="default"
                variant={"contained"}
                type="submit"
              >
                Login
              </Button>
            </div>
          </form>
        </Grid>
      </Card>
    </div>
  );
};

export default Login;
