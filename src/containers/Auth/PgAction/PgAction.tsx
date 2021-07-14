import React, { useState, useEffect } from "react";
import styles from "./PgAction.module.css";
import { Button } from "../../../components/UI/Form/Button/Button";
import { Typography } from "@material-ui/core";
import { useMutation, FetchResult, useLazyQuery } from "@apollo/client";
import { CompanyUser } from "../../../common/Roles";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";

// Pop-up box
import FormControl from "@material-ui/core/FormControl";
import Input from "../../../components/UI/Form/Input/Input";
import { USER_LOGIN } from "../../../graphql/mutations/User";
import { GET_PARTNER_USERDETAILS } from "../../../graphql/queries/PartnerUser";
import { GET_ADMIN_USER } from "../../../graphql/queries/User";
import { GET_PARTNER_ID_USER } from "../../../graphql/queries/PartnerUser";
import * as routeConstants from "../../../common/RouteConstants";
import Paper from "@material-ui/core/Paper";

export const PgAction: React.FC = (props: any) => {
  const history = useHistory();

  // Graphql

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [obSubscription, setOBSubscription] = useState<any>(false);
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [invalidSubs, setInvalidSubs] = useState(false);

  // Login User to get Authenticated.
  // const onAdminLogin = () => {
  //   login({
  //     variables: {
  //       username: "admin@webaccessglobal.com",
  //       password: "Musu30@in",
  //     },
  //   })
  //     .then((userRes) => {
  //       localStorage.setItem("session", userRes.data.tokenAuth.token);
  //     })
  //     .catch((Error) => {
  //       setInvalidLogin(true);
  //     });
  // };

  const [login] = useMutation(USER_LOGIN);


  const PartnerAdd=()=>{
    // onAdminLogin();
    history.push("/pg-partner-form/add")
  };

  const PartnerUpdate=()=>{
    // onAdminLogin();
    history.push("/pg-partner-form/edit/")
  };
  const PartnerDelete=()=>{
    // onAdminLogin();
    history.push("/pg-partner-form/delete/")
  };

  const AddPartnerUser = () => {
    // onAdminLogin();
    history.push("/pg-partner-user-form/add");
  };
  
  const updatePartnerUser = () => {
    // onAdminLogin();
    history.push("/pg-partner-user-form/edit/");
  };
  const deletePartnerUser = () => {
    // onAdminLogin();
    history.push("/pg-partner-user-form/delete/");
  }


  // Client
  const addClient = () => {
    // onAdminLogin();
    history.push("/pg-client-form/add");
  }
  const updateClient = () => {
    // onAdminLogin();
    history.push("/pg-client-form/edit");

  }
  const deleteClient = () => {
    // onAdminLogin();
    history.push("/pg-client-form/delete");
  }



  const handleClickLogin = () => {
    loginOB()
  }

  const loginOB = () => {
    login({
      variables: {
        username : email,
        password : password,
      },
    })
      .then((userRes) => {
        localStorage.setItem("session", userRes.data.tokenAuth.token);
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
        console.log(" localStorage",  localStorage.getItem("session"))
      })
      .catch((Error) => {
        setInvalidLogin(true);
      });
  };
  const [getAdminRole] = useLazyQuery(
    GET_ADMIN_USER, {
    onCompleted: (data: any) => {
      localStorage.setItem("user", JSON.stringify(data.getUserDetails.edges[0].node));
      if (data.getUserDetails.edges[0].node.isSuperuser == false) {
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

  const [getPartnerId] = useLazyQuery(
    GET_PARTNER_ID_USER, {
    onCompleted: (data: any) => {
      if(data.getPartnerUserDetails.edges[0].node.partnerId.subscription === "Yes") {
      localStorage.setItem("partnerData", JSON.stringify(data.getPartnerUserDetails.edges[0].node));
      window.location.replace(routeConstants.CLIENT);
      } else {
        setInvalidSubs(true);
        console.log("NO subscription");
        localStorage.removeItem("session");
      }
    },
    fetchPolicy: "cache-and-network",
  }
  );


  // const [getPartnerUser, { data: dataCo, loading: loadingCO }] = useLazyQuery(GET_PARTNER_USERDETAILS, {
  //   fetchPolicy: "cache-and-network",
  //   onCompleted (data: any) {
  //   console.log("getPartnerUser", data)
  //   },
  //   onError (err: any) { }
  // });


  const handleValueChange = (event: any) => {
    if (event.target.name === "email") {
      setEmail(event.target.value)
    }
    if (event.target.name === "password") {
      setPassword(event.target.value)
    }
  }

  const onSelectSubscription = (val: any) => {
    setInvalidSubs(false);
    if (val === "ob") {
      setOBSubscription(true)
    } else {
      setOBSubscription(false)
    }
  }

  return (
      <React.Fragment>
              <Paper>

        <Grid>
          <Grid container>
            <Grid item xs={12} md={7} lg={5}>
              <Typography component="h5" variant="h1">
                {"Partner"}
              </Typography>

              <Button
                onClick={PartnerAdd}
                variant="contained"
                color="primary"
              >
                Add
              </Button>
              <Button
                onClick={PartnerUpdate}
                variant="contained"
                color="primary"
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={PartnerDelete}
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
              {invalidSubs ? (
              <span>
                {obSubscription ?
                  <div className={styles.Errors}>
                    You do not have subscription of OB360.
                  </div>
                : null }
              </span>
            ) : null}
            {invalidLogin ? (
              <span>
                  <div className={styles.Errors}>
                     Incorrect username or password..
                  </div>
              </span>
            ) : null}
              <Grid container className={styles.subscriptionGrid}>
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
        </Paper>

      </React.Fragment>
  );
};
export default PgAction;
