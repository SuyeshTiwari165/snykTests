import React, { useState, useEffect } from "react";
import styles from "./AdvanceTarget.module.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  Typography,
  Grid,
  Tooltip,
} from "@material-ui/core";
import { Button } from "../../../../components/UI/Form/Button/Button";
import Cookies from "js-cookie";
import logout from "../../../Auth/Logout/Logout";
import * as routeConstant from "../../../../common/RouteConstants";
import { useHistory } from "react-router-dom";
import Input from "../../../../components/UI/Form/Input/Input";
import SimpleBackdrop from "../../../../components/UI/Layout/Backdrop/Backdrop";
import {
    CREATE_TARGET,
  } from "../../../../graphql/mutations/Target";
  import { useMutation, useLazyQuery } from "@apollo/client";
  import {
    FAILED,
    ALERT_MESSAGE_TIMER,
  } from "../../../../common/MessageConstants";
import Alert from "../../../../components/UI/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { GET_SCAN_CONFIG } from "../../../../graphql/queries/ScanConfig";
import {
    CREATE_TASK,
  } from "../../../../graphql/mutations/Task";
import moment from "moment";
import {
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles";

export const AdvanceTarget: React.FC = (props: any) => {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [isError, setIsError] = useState<any>({
    name: "",
    ipRange: "",
  });
  const [name, setName] = useState<String>("");
  const [ipRange, setIpRange] = useState<String>("");
  const clientInfo = props.location.state ? props.location.state.clientInfo : undefined;
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


  // useEffect(() => {
  //   if (
  //     formState.isDelete === true ||
  //     formState.isFailed === true ||
  //     formState.isSuccess === true ||
  //     formState.isUpdate === true
  //   ) {
  //     setTimeout(function () {
  //       handleAlertClose();
  //     }, ALERT_MESSAGE_TIMER);
  //   }
  // }, [formState]);

  useEffect(() => {
    if(scanConfig.length != 0) {
    createTasks()
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

  const [createTarget] = useMutation(CREATE_TARGET);
  const [createTask] = useMutation(CREATE_TASK);

const [getScanConfigData, { data: taskData, loading: taskLoading }] = useLazyQuery(
    GET_SCAN_CONFIG,
  {
    fetchPolicy: "cache-and-network",
    onCompleted: (data: any) => {
      if (data.getScanConfigurationdata.edges[0]) {
        let arr: any = [];
        data.getScanConfigurationdata.edges.map((element: any) => {
          if(element.node.scanConfigName === 'Full and fast') {
            arr.push(element.node.vatScanConfigId)
          }

        });
        setScanConfig(arr);
        // createTasks()
        
      }
    },
    onError: error => {
        setBackdrop(false);
    }
  }
);

  const handleBack = () => {
    if (Cookies.getJSON("ob_session")) {
      let data = {};
      data = { refetchData: true, clientInfo: clientInfo };
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
    let value = event.target.value;
    let isErrName = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      name: isErrName,
    }));
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

  const handleSubmitDialogBox = () => {
    setBackdrop(true);
      if(handleInputErrors()) {
      handleAlertClose();
    let input = {
        partner: partnerId.id,
        client: clientId,
        targetName: name,
        host: ipRange,
        startDate: startDate,
        scanType : "External"
      };
      createTarget({
        variables: {
          input,
        },
      })
        .then((userRes) => {
        //   setBackdrop(false);
          if(userRes.data.createTarget.targetField ==  null){
            setBackdrop(false);
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: " Name already present.",
            }));
            // setSubmitDisabled(true)
          }
          else {
        //   setSubmitDisabled(false)        
        getScanConfigData({
            variables: {
            clientId: userRes.data.createTarget.targetField.client.clientName,
          },
        })
        //   setFormState((formState) => ({
        //     ...formState,
        //     isSuccess: true,
        //     isUpdate: false,
        //     isDelete: false,
        //     isFailed: false,
        //     errMessage: "Target Created Successfully !",
        //   }));
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
          if (
            error.includes("Response Error 400. Target exists already")
          ) {
            error = " Target Name already present.";
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
    } else {
      setBackdrop(false);
        setFormState((formState) => ({
          ...formState,
          isSuccess: false,
          isUpdate: false,
          isDelete: false,
          isFailed: true,
          errMessage: " Please Fill Required Fields ",
        }));
      }
  }
  const createTasks = () => {
      console.log("clientInfo",clientInfo);
    let input = {
        partner: parseInt(partner.partnerId.id),
        client: clientInfo.name,
        taskName: "Task"+ " " + name,
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
          data = { refetchData: true, clientInfo: clientInfo };
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
        })
        .catch((err) => {
          setBackdrop(false);
          let error = err.message;
          if (
            error.includes("duplicate key value violates unique constraint")
          ) {
            error = " Name already present.";
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
  
  const theme = createMuiTheme({
    overrides: {
      MuiTooltip: {
        tooltip: {
          backgroundColor:"rgb(240, 102, 1, 0.8)",
          borderRadius : "12px",
          position: "relative",
          "&:before" : {
          content: "' '",
          width: "0px",
          height: "0px",
          zIndex: 9999,
          position:"absolute",
          }
        },
        tooltipPlacementRight: {
          "&:before" : {
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          borderRight:"6px solid rgba(240, 102, 1, 0.8)",
          left:"-6px",
          top:"45%",
          }
        },
        tooltipPlacementLeft: {
          "&:before" : { 
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft: "6px solid rgba(240, 102, 1, 0.8)", 
            right:"-6px",
            top:"45%",
          }
        },
        tooltipPlacementBottom: {
          "&:before" : { 
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderBottom: "6px solid rgba(240, 102, 1, 0.8)",
            left :"45%",
            top:"-6px",
          }
        },
        tooltipPlacementTop: {
          "&:before" : { 
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid rgba(240, 102, 1, 0.8)",
            left :"45%",
            bottom:"-6px",
          }
        }
      }
    }
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
      {backdrop ? <SimpleBackdrop/>: null}
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
          <Input
            type="text"
            label="Target Name"
            value={name}
            onChange={handleNameChange}
            required
            error={isError.name}
            helperText={isError.name}
          >
            Target Name
          </Input>
        </Grid>

        <Grid item xs={12} md={6}>
          <span className={styles.IPTooltip}>
          <MuiThemeProvider theme={theme}>

            <Tooltip
              open={open}
              onClose={handleToolTipClose}
              onOpen={handleToolTipOpen}
              placement="right"
              title={
                <React.Fragment>
                  <p>
                    <b>For IP Address </b>{" "}
                  </p>
                  <b>{"Single IP Address"}</b>
                  <em>{"(e.g. 192.168.x.xx)"}</em>{" "}
                  <p>
                    <b>{" Multiple IP Address"}</b> {"(e.g. 192.168.x.0-255)"}
                  </p>
                  <p>
                    <b>For Domain/URL </b>{" "}
                  <em>{"(e.g. webaccessnet.com)"}</em>{" "}
                  </p>
                  {" "}
                </React.Fragment>
              }
            >
              <Input
                type="text"
                label="URL / IP Range"
                value={ipRange}
                onChange={handleIpRangeChange}
                required
                error={isError.ipRange}
                helperText={isError.ipRange}
              >
                URL/IP Range
              </Input>

              {/* <ContactSupportIcon className={styles.CircleIcon} /> */}
            </Tooltip>
            </MuiThemeProvider>
          </span>
        </Grid>

        <Grid item xs={12} className={styles.ActionButtons}>
          <Button
            className={styles.borderLess}
            variant={"contained"}
            onClick={handleBack}
            color="primary"
            data-testid="cancel-button"
          >
            back
          </Button>
          <Button
            onClick={handleSubmitDialogBox}
            color="primary"
            variant={"contained"}
            data-testid="ok-button"
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default AdvanceTarget;
