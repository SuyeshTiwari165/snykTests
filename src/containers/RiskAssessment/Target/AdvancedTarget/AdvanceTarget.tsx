import React, { useState, useEffect } from "react";
import styles from "./AdvanceTarget.module.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Typography, Grid, Tooltip } from "@material-ui/core";
import { Button } from "../../../../components/UI/Form/Button/Button";
import Cookies from "js-cookie";
import logout from "../../../Auth/Logout/Logout";
import * as routeConstant from "../../../../common/RouteConstants";
import { useHistory } from "react-router-dom";
import Input from "../../../../components/UI/Form/Input/Input";
import SimpleBackdrop from "../../../../components/UI/Layout/Backdrop/Backdrop";
import { GET_AVAILABLE_SERVER } from "../../../../graphql/queries/Target";
import { CREATE_TARGET } from "../../../../graphql/mutations/Target";
import {
  DOMAIN_VERIFY,
  IP_VERIFY,
  URL_VERIFY,
} from "../../../../graphql/mutations/DomainVerify";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../../common/MessageConstants";
import Alert from "../../../../components/UI/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { GET_SCAN_CONFIG } from "../../../../graphql/queries/ScanConfig";
import { CREATE_TASK } from "../../../../graphql/mutations/Task";
import moment from "moment";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import * as msgConstant from "../../../../common/MessageConstants";
// import { customClient } from "../../../../config/customClient";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/link-context";

export const AdvanceTarget: React.FC = (props: any) => {
  const history = useHistory();
  const [backendUrl, setBackendurl] = useState<any>("");
  const [open, setOpen] = React.useState(false);
  const [targetOpen, setTargetOpen] = React.useState(false);
  const [isError, setIsError] = useState<any>({
    name: "",
    ipRange: "",
  });
  const [param, setParams] = useState<any>({});
  const [name, setName] = useState<String>("");
  const [ipRange, setIpRange] = useState<any>("");
  const clientInfo = props.location.state
    ? props.location.state.clientInfo
    : undefined;
  const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");
  const [backdrop, setBackdrop] = useState(false);
  const partnerId = partner.partnerId;
  const clientId = clientInfo ? parseInt(clientInfo.clientId) : undefined;
  const startDate = new Date();
  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });
  const [scanConfig, setScanConfig] = useState<any>([]);
  const tempScheduleDate = new Date().toISOString();
  const [createTargetFlag, setcreateTargetFlag] = useState(false);
  const [flagtrue, setflagtrue] = useState(false);
  // const [httpLink, sethttpLink] = useState<any>();
  useEffect(() => {
    if (props?.location.state) {
      setParams(props.location.state);
    }
  }, []);

  useEffect(() => {
    if (scanConfig.length != 0) {
      createTasks();
    }
  }, [scanConfig]);

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

  const session = Cookies.getJSON("ob_session");
  const accessToken = session ? session : null;
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: accessToken ? "jwt" + " " + accessToken : null,
      },
    };
  });
  useEffect(() => {
    if (availableServer && backendUrl !== "") {
      submitAction();
    }
  }, [backendUrl]);
  console.log("backendUrl", backendUrl);
  let link: any;
  let httpLink: any;
  httpLink = createHttpLink({
    uri: backendUrl + "/graphql/",
  });
  const [
    getAvailableServer,
    {
      data: availableServer,
      loading: availableServerLoading,
      error: availableServerError,
    },
  ] = useLazyQuery(GET_AVAILABLE_SERVER, {
    onCompleted: (data: any) => {
      if (data?.getAvailableServer[0].url) {
        setBackendurl(data?.getAvailableServer[0].url);
      }
    },
    fetchPolicy: "network-only",
  });

  link = accessToken ? authLink.concat(httpLink) : httpLink;

  const customClient: any = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });

  // const [createTarget] = useMutation(CREATE_TARGET);
  const [createTask] = useMutation(CREATE_TASK, {
    client: customClient,
  });
  const [domainVerify] = useMutation(DOMAIN_VERIFY);
  const [IPVerify] = useMutation(IP_VERIFY);
  const [urlVerify] = useMutation(URL_VERIFY);

  const [getScanConfigData, { data: taskData, loading: taskLoading }] =
    useLazyQuery(GET_SCAN_CONFIG, {
      fetchPolicy: "network-only",
      onCompleted: (data: any) => {
        if (data.getScanConfigurationdata.edges[0]) {
          let arr: any = [];
          data.getScanConfigurationdata.edges.map((element: any) => {
            if (element.node.scanConfigName === "Full and fast") {
              arr.push(element.node.vatScanConfigId);
            }
          });
          setScanConfig(arr);
          // createTasks()
        }
      },
      onError: (error) => {
        setBackdrop(false);
      },
    });

  const handleBack = () => {
    if (Cookies.getJSON("ob_session")) {
      let data = {};
      data = { refetchData: true, clientInfo: clientInfo };
      if (param.previousPage === "client") {
        history.push(routeConstant.CLIENT, data);
        localStorage.removeItem("name");
        localStorage.removeItem("targetId");
        localStorage.removeItem("ipRange");
        localStorage.removeItem("ipAddress");
        localStorage.removeItem("re-runTargetName");
        localStorage.removeItem("userName");
        localStorage.removeItem("password");
        localStorage.removeItem("vpnUserName");
        localStorage.removeItem("vpnPassword");
        localStorage.removeItem("vpnFilePath");
        localStorage.removeItem("WinTargetName");
        localStorage.removeItem("LinuxTargetName");
      } else {
        history.push(routeConstant.RA_REPORT_LISTING, data);
        localStorage.removeItem("name");
        localStorage.removeItem("targetId");
        localStorage.removeItem("ipRange");
        localStorage.removeItem("ipAddress");
        localStorage.removeItem("re-runTargetName");
        localStorage.removeItem("userName");
        localStorage.removeItem("password");
        localStorage.removeItem("vpnUserName");
        localStorage.removeItem("vpnPassword");
        localStorage.removeItem("vpnFilePath");
        localStorage.removeItem("WinTargetName");
        localStorage.removeItem("LinuxTargetName");
      }
    } else {
      logout();
    }
  };
  const handleToolTipClose = () => {
    setOpen(false);
  };

  const handleToolTipOpen = () => {
    setOpen(true);
  };
  const handleTargetToolTipClose = () => {
    setTargetOpen(false);
  };

  const handleTargetToolTipOpen = () => {
    setTargetOpen(true);
  };


  const validURL = (str: any) => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  console.log("validURL", validURL(ipRange));
  const handleIpRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIpRange(event.target.value);
    let value = event.target.value;
    let isErrIpRange = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      ipRange: isErrIpRange,
    }));
    // setSubmitDisabled(checkValidation);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    if (!/[^a-zA-Z0-9\- ]/.test(event.target.value)) {
      let value = event.target.value;
      let isErrName = value.length <= 0 ? "Required" : "";
      setIsError((isError: any) => ({
        ...isError,
        name: isErrName,
      }));
    }
    if (/[^a-zA-Z0-9\- ]/.test(event.target.value)) {
      setIsError((isError: any) => ({
        ...isError,
        name: "Invalid Scan Name",
      }));
    }
    // setSubmitDisabled(checkValidation);
  };

  const handleInputErrors = () => {
    let error = true;
    if (name === "") {
      error = false;
      let isErrName = name.length <= 0 ? "Required" : "";
      setIsError((error: any) => ({
        ...error,
        name: isErrName,
      }));
    }
    if (ipRange === "") {
      error = false;
      let isErrIpRange = ipRange.length <= 0 ? "Required" : "";
      setIsError((error: any) => ({
        ...error,
        ipRange: isErrIpRange,
      }));
    }
    return error;
  };

  // const testfunc = () => {
  //   getAvailableServer();
  // }

  const handleSubmitDialogBox = () => {
    if (handleInputErrors() === false) {
      setBackdrop(false);
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: " Please fill in all the required fields",
      }));
    }
    if (handleInputErrors()) {
      //   console.log("getAvailableServer", backendUrl);
      // }
      // if (backendUrl !== "") {
      setBackdrop(true);
      if (/[^a-zA-Z0-9\- \/]/.test(name.toString())) {
        setBackdrop(false);
      } else {
        // Check Domain Connectipn
        let input = {
          host: ipRange,
          scanType: "External",
        };
        if (validURL(ipRange)) {
          // IPVerify({
          //   variables: {
          //     input,
          //   },
          // })
          //   .then((userRes) => {
          //     if (userRes.data.IPVerify.status === "Valid IP address") {
          //       // setcreateTargetFlag(true);
          getAvailableServer();
          //     } else if (
          //       userRes.data.IPVerify.status === "Provide single ip address"
          //     ) {
          //       setBackdrop(false);
          //       setFormState((formState) => ({
          //         ...formState,
          //         isSuccess: false,
          //         isUpdate: false,
          //         isDelete: false,
          //         isFailed: true,
          //         errMessage: " Please Enter Single IP Address",
          //       }));
          //     } else if (userRes.data.IPVerify.status === "IP is not working") {
          //       setBackdrop(false);
          //       setFormState((formState) => ({
          //         ...formState,
          //         isSuccess: false,
          //         isUpdate: false,
          //         isDelete: false,
          //         isFailed: true,
          //         errMessage:
          //           " Please provide a valid URL or IP address and ensure that it is publicly hosted and accessible",
          //       }));
          //     } else {
          //       setBackdrop(false);
          //       setFormState((formState) => ({
          //         ...formState,
          //         isSuccess: false,
          //         isUpdate: false,
          //         isDelete: false,
          //         isFailed: true,
          //         errMessage: " Please fill in all the required fields",
          //       }));
          //     }
          //   })
          //   .catch((err) => {
          //     setBackdrop(false);
          //     let error = err.message;
          // setFormState((formState) => ({
          //   ...formState,
          //   isSuccess: false,
          //   isUpdate: false,
          //   isDelete: false,
          //   isFailed: true,
          //   errMessage: error,
          // }));
          //   });
        } else {
          setBackdrop(false);
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: false,
            isFailed: true,
            errMessage: "Please enter Valid IP ",
          }));
        }
        // else {
        //   domainVerify({
        //     variables: {
        //       input,
        //     },
        //   })
        //     .then((userRes) => {
        //       console.log("userRes", userRes);
        //       if (
        //         userRes.data.domainVerify.status === "Domain name is registered"
        //       ) {
        //         console.log("status", userRes.data.domainVerify.status);
        //         getAvailableServer();
        //       } else if (
        //         userRes.data.domainVerify.status ===
        //         "Domain name is not registered"
        //       ) {
        //         setBackdrop(false);
        //         setFormState((formState) => ({
        //           ...formState,
        //           isSuccess: false,
        //           isUpdate: false,
        //           isDelete: false,
        //           isFailed: true,
        //           errMessage:
        //             " Please provide a valid URL or IP address and ensure that it is publicly hosted and accessible",
        //         }));
        //       } else {
        //         setBackdrop(false);
        //         setFormState((formState) => ({
        //           ...formState,
        //           isSuccess: false,
        //           isUpdate: false,
        //           isDelete: false,
        //           isFailed: true,
        //           errMessage: " Please fill in all the required fields ",
        //         }));
        //       }
        //     })
        //     .catch((err) => {
        //       setBackdrop(false);
        //       let error = err.message;
        //       setFormState((formState) => ({
        //         ...formState,
        //         isSuccess: false,
        //         isUpdate: false,
        //         isDelete: false,
        //         isFailed: true,
        //         errMessage: error,
        //       }));
        //     });
        // }
      }
    }
  };

  const [createTarget] = useMutation(CREATE_TARGET, {
    client: customClient,
  });

  const submitAction = () => {
    if (validURL(ipRange)) {
      handleAlertClose();
      let input = {
        partner: partnerId.id,
        client: clientId,
        targetName: name,
        host: ipRange,
        startDate: startDate,
        scanType: "External",
      };
      createTarget({
        variables: {
          input,
        },
      })
        .then((userRes) => {
          //   setBackdrop(false);
          if (userRes.data.createTarget.status === "Duplicate") {
            setBackdrop(false);
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: " Scan name exists. Add another name",
            }));
            // setSubmitDisabled(true)
          } else if (userRes.data.createTarget.status === "Success") {
            // else {
            //   setSubmitDisabled(false)
            console.log("status", userRes.data.createTarget.status);
            getScanConfigData({
              variables: {
                clientId:
                  userRes.data.createTarget.targetField.client.clientName,
              },
            });
            //   setFormState((formState) => ({
            //     ...formState,
            //     isSuccess: true,
            //     isUpdate: false,
            //     isDelete: false,
            //     isFailed: false,
            //     errMessage: "Target Created Successfully !",
            //   }));
          } else {
            setBackdrop(false);
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: " Failed to create Scan Please Try Again",
            }));
          }
        })
        .catch((err) => {
          //   setSubmitDisabled(false)
          setBackdrop(false);
          let error = err.message;
          if (
            error.includes("duplicate key value violates unique constraint")
          ) {
            error = " Name already present.";
          }
          if (error.includes("Response Error 400. Target exists already")) {
            error = " Scan Name already present.";
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
    } else {
      setBackdrop(false);
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: "Please Enter Valid IP ",
      }));
    }
  };
  const createTasks = () => {
    console.log("clientInfo", clientInfo);
    let input = {
      partner: parseInt(partner.partnerId.id),
      client: clientInfo.name,
      taskName: "Task" + " " + name,
      vatTarget: name,
      vatScanConfig: scanConfig,
      // vatScanConfig : "599ff530-0dbf-4edb-a54a-0d49f0ca67d3",
      scheduleDate: tempScheduleDate,
    };
    createTask({
      variables: {
        input,
      },
    })
      .then((userRes) => {
        if (userRes.data.createTask.status === "Success") {
          let formState2 = {
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: msgConstant.SCAN_SUCCESS_MSG,
          };
          setBackdrop(false);
          setFormState((formState) => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: "",
          }));
          let data = {};
          data = {
            refetchData: true,
            clientInfo: clientInfo,
            formState: formState2,
          };
          history.push(routeConstant.RA_REPORT_LISTING, data);
          localStorage.removeItem("name");
          localStorage.removeItem("targetId");
          localStorage.removeItem("ipRange");
          localStorage.removeItem("ipAddress");
          localStorage.removeItem("re-runTargetName");
          localStorage.removeItem("userName");
          localStorage.removeItem("password");
          localStorage.removeItem("vpnUserName");
          localStorage.removeItem("vpnPassword");
          localStorage.removeItem("WinTargetName");
          localStorage.removeItem("LinuxTargetName");
        } else {
          setBackdrop(false);
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: false,
            isFailed: true,
            errMessage: "Failed to create Scan Please Try Again",
          }));
        }
      })
      .catch((err) => {
        setBackdrop(false);
        let error = err.message;
        if (error.includes("duplicate key value violates unique constraint")) {
          error = " Name already present.";
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

  const theme = createMuiTheme({
    overrides: {
      MuiTooltip: {
        tooltip: {
          backgroundColor: "rgb(240, 102, 1, 0.8)",
          borderRadius: "12px",
          position: "relative",
          "&:before": {
            content: "' '",
            width: "0px",
            height: "0px",
            zIndex: 9999,
            position: "absolute",
          },
        },
        tooltipPlacementRight: {
          "&:before": {
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderRight: "6px solid rgba(240, 102, 1, 0.8)",
            left: "-6px",
            top: "45%",
          },
        },
        tooltipPlacementLeft: {
          "&:before": {
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft: "6px solid rgba(240, 102, 1, 0.8)",
            right: "-6px",
            top: "45%",
          },
        },
        tooltipPlacementBottom: {
          "&:before": {
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderBottom: "6px solid rgba(240, 102, 1, 0.8)",
            left: "45%",
            top: "-6px",
          },
        },
        tooltipPlacementTop: {
          "&:before": {
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid rgba(240, 102, 1, 0.8)",
            left: "45%",
            bottom: "-6px",
          },
        },
      },
    },
  });

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        External Vulnerability Test for{" "}
        {props.location.state !== undefined &&
        props.location.state.clientInfo !== undefined
          ? props.location.state.clientInfo.name
          : null}
      </Typography>
      {backdrop ? <SimpleBackdrop /> : null}
      <Grid container className={styles.backToListButtonPanel}>
        <Grid item xs={12} md={12} className={styles.backToListButton}>
          {/* {userRole === "SuperUser" ? ( */}
          <Button
            className={styles.BackToButton}
            variant={"contained"}
            onClick={handleBack}
            color="secondary"
            data-testid="cancel-button"
          >
            <img
              src={process.env.PUBLIC_URL + "/icons/svg-icon/back-list.svg"}
              alt="user icon"
            />
            &nbsp; Back to List
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} className={styles.AlertWrap}>
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
              <strong>{formState.errMessage}</strong>
              {/* {SUCCESS} */}
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
              <strong>{formState.errMessage}</strong>
              {/* {SUCCESS} */}
            </Alert>
          ) : null}
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
        <Grid item xs={12} md={6}>
          <span className={styles.IPTooltip}>
            {/* <MuiThemeProvider theme={theme}> */}
            <Tooltip
              open={targetOpen}
              onClose={handleTargetToolTipClose}
              onOpen={handleTargetToolTipOpen}
              placement="bottom-end"
              title={
                <React.Fragment>
                  <p>
                    <b> Scan Name can't contain any special characters. </b>{" "}
                  </p>{" "}
                </React.Fragment>
              }
            >
              <Input
                type="text"
                label="Scan Name"
                value={name}
                onChange={handleNameChange}
                required
                error={isError.name}
                helperText={isError.name}
              >
                Scan Name
              </Input>
            </Tooltip>
            {/* </MuiThemeProvider> */}
          </span>
        </Grid>

        <Grid item xs={12} md={6}>
          <span className={styles.IPTooltip}>
            {/* <MuiThemeProvider theme={theme}> */}

            <Tooltip
              open={open}
              onClose={handleToolTipClose}
              onOpen={handleToolTipOpen}
              placement="bottom-end"
              title={
                <React.Fragment>
                  <p>
                    <b>Please enter data in the below formats </b>{" "}
                  </p>
                  <b>{"Single IP Address"}</b>
                  <em>{"(e.g. 192.168.x.xx)"}</em>{" "}
                  {/* <p>
                    <b>{" Multiple IP Address"}</b> {"(e.g. 192.168.x.0-255 or 192.168.x.0, 192.168.x.2)"}
                  </p> */}
                  <p>
                    <b>For Domain/URL </b> <em>{"(e.g. domainname.com)"}</em>{" "}
                  </p>{" "}
                </React.Fragment>
              }
            >
              <Input
                type="text"
                label="URL / IP"
                value={ipRange}
                onChange={handleIpRangeChange}
                required
                error={isError.ipRange}
                helperText={isError.ipRange}
              >
                URL/IP
              </Input>

              {/* <ContactSupportIcon className={styles.CircleIcon} /> */}
            </Tooltip>
            {/* </MuiThemeProvider> */}
          </span>
        </Grid>

        <Grid item xs={12} className={styles.ActionButtons}>
          <Button
            onClick={handleSubmitDialogBox}
            color="primary"
            variant={"contained"}
            data-testid="ok-button"
          >
            Queue Scan
          </Button>
          <Button
            className={styles.borderLess}
            variant={"contained"}
            onClick={handleBack}
            color="primary"
            data-testid="cancel-button"
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default AdvanceTarget;
