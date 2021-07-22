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
            arr.push(element.node.vatScanConfigId)
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
        taskName: name + "_" + moment(new Date()).format("DD"),
        vatTarget: name,
        vatScanConfig: scanConfig,
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
            value={name.split("_")[0]}
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
                  </p>{" "}
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
