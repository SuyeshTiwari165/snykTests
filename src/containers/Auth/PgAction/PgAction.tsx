import React, { useState, useEffect } from "react";
import styles from "./PgAction.module.css";
import { Button } from "../../../components/UI/Form/Button/Button";
import * as routeConstant from "../../../common/RouteConstants";
import { Typography } from "@material-ui/core";
import { useMutation, FetchResult, useLazyQuery } from "@apollo/client";
import { CompanyUser } from "../../../common/Roles";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import { DialogBox } from "../../../components/UI/DialogBox/DialogBox";

// Pop-up box
import FormControl from "@material-ui/core/FormControl";
import Input from "../../../components/UI/Form/Input/Input";



export const PgAction: React.FC = (props: any) => {
  const [userRole, setUserRole] = useState();
  const history = useHistory();
  const [openDialogBox, setOpenDialogBox] = useState<boolean>(false);

  // Graphql

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  // const [subscription, setSubscription] = useState("");
  const [ccSubscription, setCCSubscription] = useState<any>(false);
  const [raSubscription, setRASubscription] = useState<any>(false);
  const [obSubscription, setOBSubscription] = useState<any>(false);
  const [invalidLogin, setInvalidLogin] = useState(false);


  // Login User to get Authenticated.
  const onLogin = () => {
    // login({
    //   variables: {
    //     identifier: "webaccessuser@webaccessglobal.com",
    //     password: "Musu30@in",
    //   },
    // })
    //   .then((userRes) => {
    //     localStorage.setItem("user", JSON.stringify(userRes.data.login));
    //     localStorage.setItem("session", userRes.data.login.jwt);
    //   })
    //   .catch((Error) => {
    //     console.log("Error Response", Error);
    //   });
  };



  const PartnerAdd=()=>{
    // onLogin()
    // history.push("/pg-partner-form/add")
  };

  const PartnerUpdate=()=>{
    // onLogin()
    // history.push("/pg-partner-form/edit/")
  };

  const AddPartnerUser = () => {
    // history.push("/pg-partner-user-form");
  };
  
  const updatePartnerUser = () => {
    // history.push("/pg-partner-user-form/edit/");
  };
  const deletePartnerUser = () => {
    // history.push("/pg-delete-partner-user");
  }


  // Client
  const addClient = () => {
    // history.push("/pg-client-form/add");
  }
  const updateClient = () => {
    // history.push("/pg-client-form/edit");

  }
  const deleteClient = () => {
    // history.push("/pg-client-form/delete");
  }



  const handleClickLogin = () => {
    // let val = {
    //   subscription: "cc"
    // }
    // loginQuery(email, password);
  }


  const navigateTo = () => {
    let val = {
      // cc_subscription: ccSubscription,
      // ra_subscription: raSubscription,
      ob_subscription: obSubscription
    }
    history.push(routeConstant.CLIENT, val);
  }

  const handleValueChange = (event: any) => {
    console.log("console.log >", event.target.value);
    if (event.target.name === "email") {
      setEmail(event.target.value)
    }
    if (event.target.name === "password") {
      setPassword(event.target.value)
    }
  }

  const onSelectSubscription = (val: any) => {
    if (val === "cc") {
      setCCSubscription(true)
    } else {
      setCCSubscription(false)
    }
    if (val === "ra") {
      setRASubscription(true)
    } else {
      setRASubscription(false)
    }
    if (val === "ob") {
      setOBSubscription(true)
    } else {
      setOBSubscription(false)
    }
  }

  return (
      <React.Fragment>
        <Grid>
          <Grid container>
            <Grid item xs={12} md={7} lg={5}>
              <Typography component="h5" variant="h1">
                {"Partner"}
              </Typography>

              <Button
                // className={styles.ContinueButton}
                onClick={PartnerAdd}
                variant="contained"
                color="primary"
                // type="submit"
              >
                Add
              </Button>
              <Button
                // className={styles.ContinueButton}
                onClick={PartnerUpdate}
                variant="contained"
                color="primary"
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="primary"
                // className={styles.ContinueButton}
                // onClick={onLogin}
                // type="submit"
              >
                Delete
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} md={7} lg={5}>
              <Typography component="h5" variant="h1">
                {"Partner User"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={AddPartnerUser}
              >
                {"Add"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={updatePartnerUser}
              >
                {"Update"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={deletePartnerUser}
              >
                {"Delete"}
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} md={7} lg={5}>
              <Typography component="h5" variant="h1">
                {"Client"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={addClient}
              >
                {"Add"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={updateClient}
              >
                {"Update"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={deleteClient}
              >
                {"Delete"}
              </Button>
            </Grid>
          </Grid>
          <Grid container className={styles.loginBorder}>
            <Grid item xs={12} sm={4}>
              <Typography component="h5" variant="h1">
                {"Login"}
              </Typography>
              <Grid>
                <FormControl className={styles.TextField} variant="outlined">
                  <Input
                    type="email"
                    label="Email Address"
                    name="email"
                    value={email}
                    id="email-id"
                    onChange={handleValueChange}
                    data-testid="email-id"
                    classes={{
                      root: styles.InputField,
                      notchedOutline: styles.InputField,
                      focused: styles.InputField,
                    }}
                  >
                    E-mail
                  </Input>
                </FormControl>
              </Grid>
              <Grid>
                <FormControl className={styles.TextField} variant="outlined">
                  <Input
                    type="password"
                    label="Password"
                    name="password"
                    value={password}
                    id="email-id"
                    onChange={handleValueChange}
                    classes={{
                      root: styles.InputField,
                      notchedOutline: styles.InputField,
                      focused: styles.InputField,
                    }}
                  >
                    Password
                  </Input>
                </FormControl>
              </Grid>
              {invalidLogin ? (
                <div className={styles.Errors}>
                  Incorrect username or password.
                </div>
              ) : null}
              <Grid container className={styles.subscriptionGrid}>
                {/* <div className={styles.TabOptions}>
                  <Button
                    className={ccSubscription ? styles.TabOptionsActive : styles.TabOptionsInactive}
                    onClick={() => onSelectSubscription('cc')}
                  >
                    <div className={ccSubscription ? styles.para : styles.TabOptionsInactive}>
                      {"CC360"}
                    </div>
                  </Button>
                </div>
                <div className={styles.TabOptions}>
                  <Button
                    className={raSubscription ? styles.TabOptionsActive : styles.TabOptionsInactive}
                    onClick={() => onSelectSubscription("ra")}
                  >
                    <div className={raSubscription ? styles.para : styles.TabOptionsInactive}>
                      {"RA360"}
                    </div>
                  </Button>
                </div> */}
                <div className={styles.TabOptions}>
                  <Button
                    className={obSubscription ? styles.TabOptionsActive : styles.TabOptionsInactive}
                    onClick={() => onSelectSubscription("ob")}
                  >
                    <div className={obSubscription ? styles.para : styles.TabOptionsInactive}>
                      {"OB360"}
                    </div>
                  </Button>
                </div>
              </Grid>
              <Grid className={styles.FooterActions}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClickLogin}
                >
                  {"Login"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
  );
};
export default PgAction;
