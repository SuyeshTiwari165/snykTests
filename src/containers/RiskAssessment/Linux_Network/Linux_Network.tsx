import React, { useState, useEffect } from "react";
import styles from "./Linux_Network.module.css";
import CssBaseLine from "@material-ui/core/CssBaseline"
import Typography from "@material-ui/core/Typography"
import RaStepper from "../component/RaStepper/RaStepper";
import IconButton from "@material-ui/core/IconButton";
import Input from "../../../components/UI/Form/Input/Input";
import SimpleBackdrop from "../../../components/UI/Layout/Backdrop/Backdrop";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Grid } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import { FormHelperText, makeStyles, createStyles } from "@material-ui/core";
import { GET_TARGET } from "../../../graphql/queries/Target";
import { GET_TASK_DETAILS } from "../../../graphql/queries/TaskDetails";
import FormControl from "@material-ui/core/FormControl";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import {
  CREATE_TARGET,
  UPDATE_TARGET,
  DELETE_TARGET,
} from "../../../graphql/mutations/Target";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Button } from "../../../components/UI/Form/Button/Button";
import { useHistory } from "react-router-dom";
import { setRaStepper } from "../common/SetRaStepper";
import { useApolloClient } from "@apollo/client";
import * as routeConstant from "../../../common/RouteConstants";
import * as msgConstant from "../../../common/MessageConstants";
import AlertBox from "../../../components/UI/AlertBox/AlertBox";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "../../../components/UI/Alert/Alert";
import stepper from "../common/raStepperList.json";
import { TEST_LINUX_CONNECTION } from "../../../graphql/mutations/VPNConnection"
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../common/MessageConstants";

export const Linux_Network: React.FC = (props: any) => {
  const history = useHistory();
  const client = useApolloClient();
  const [scanConfigList, setScanConfigList] = useState<any>([]);
  const [ipAddress, setIpAddress] = useState<String>("");
  const [ipRange, setIpRange] = useState<String>("");
  const [userName, setUserName] = useState<String>("");
  const targetId = JSON.parse(localStorage.getItem("targetId") || "{}");
  const VPNUsername = JSON.parse(localStorage.getItem("vpnUserName") || "{}");
  const VPNPassword = JSON.parse(localStorage.getItem("vpnPassword") || "{}");
  const [vpnUserName, setVpnUserName] = useState<String>("");
  const [targetName, setTargetName] = useState<String>("");
  const [vpnPassword, setVpnPassword] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [dialogBoxMsg, setDialogBoxMsg] = useState("");
  const networkType = "Linux";
  const [connectionSuccess, SetConnectionSuccess] = useState(false);
  const [showDialogBox, setShowDialogBox] = useState<boolean>(false);
  const [linuxDomain, setLinuxDomain] = useState(false);
  const [editDataId, setEditDataId] = useState<Number | null>();
  const [showPassword, setShowPassword] = useState(false);
  if (props.location.state) {
    if (editDataId === null || editDataId === undefined && localStorage.getItem("targetId") !== "{") {
      setEditDataId(JSON.parse(localStorage.getItem("targetId") || "{}"));
    }
  };

  const startDate = new Date();
  const [updateTarget] = useMutation(UPDATE_TARGET);
  const [backdrop, setBackdrop] = useState(false);
  const [isError, setIsError] = useState<any>({
    name: "",
    ipAddress: "",
    userName: "",
    password: "",
    vpnUserName: "",
    vpnPassword: "",
  });
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });
  const clientInfo = props.location.state ? props.location.state.clientInfo : undefined;
  const ReRunTargetName = JSON.parse(localStorage.getItem("re-runTargetName") || "{}");
  const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");
  const partnerId = partner.partnerId;
  const clientId = clientInfo ? parseInt(clientInfo.clientId) : undefined;
  const targetInfo = props.location.state ? props.location.state.targetInfo : undefined;
  const [testVpnConnection] = useMutation(TEST_LINUX_CONNECTION);
  const name = localStorage.getItem("name") ? JSON.parse(localStorage.getItem("name") || '') :  null;
  const LinuxTargetName = localStorage.getItem("LinuxTargetName") ? JSON.parse(localStorage.getItem("LinuxTargetName") || '') :  null;
  const [createTarget] = useMutation(CREATE_TARGET);
  const [getTaskData, { data: taskData, loading: taskLoading }] = useLazyQuery(
    GET_TASK_DETAILS,
    {
      onCompleted: (data: any) => {
        if (data.getTask.edges && data.getTask.edges[0]) {
          setScanConfigList(data.getTask.edges[0].node.vatScanConfigList);
        }
      },
      fetchPolicy: "cache-and-network",
    }
  );
  const
    { data: targetData, loading: targetLoading, error: targetError }
      = useQuery(GET_TARGET, {
        variables: {
          targetName: props.location.state && props.location.state.editData ? (targetName ? targetName : ReRunTargetName) : (ReRunTargetName ? ReRunTargetName : targetName),
        },
        onCompleted: (data: any) => {
          if (targetData && data.getCredentialsDetails.edges[0]) {
            setIpAddress(data.getCredentialsDetails.edges[0].node.linuxIpAddress);
            setUserName(
              data.getCredentialsDetails.edges[0].node
                ? data.getCredentialsDetails.edges[0].node.domainUsername
                : null
            );
            // setPassword(
            //   data.getCredentialsDetails.edges[0].node
            //     ? data.getCredentialsDetails.edges[0].node.domainPassword
            //     : null
            // );
          }
          // else {
          //   // let error = err.message;
          //   setFormState((formState) => ({
          //     ...formState,
          //     isSuccess: false,
          //     isUpdate: false,
          //     isDelete: false,
          //     isFailed: true,
          //     errMessage: "",
          //   }));
          //   setTimeout(() => {
          //     history.push(routeConstant.RA_REPORT_LISTING, props.location.state)
          //   }, 1000);
          // }
        },
        onError: (err) => {
          let error = err.message;
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: false,
            isFailed: true,
            errMessage: error,
          }));
        },
        fetchPolicy: "cache-and-network",
      });

  useEffect(() => {
    setRaStepper(client, stepper.LinuxNetwork.name, stepper.LinuxNetwork.value, props.location.state);
    console.log("PROPS>",props.location.state)
    if(props.location.state != undefined && props.location.state.editLinuxData && props.location.state.editLinuxData === true) {
      console.log("props.location.state.editLinuxData",props.location.state.editLinuxData)
      setSubmitDisabled(false);
      setFormState(formState => ({
        ...formState,
        isSuccess: true,
        isUpdate: false,
        isDelete: false,
        isFailed: false,
        errMessage: "Connection Already Tested"
      }));
    }
  }, []);

  useEffect(() => {
    if (targetId && editDataId !== undefined) {
      setIpRange(JSON.parse(localStorage.getItem("ipRange") || ""));
      // setTargetName(JSON.parse(localStorage.getItem("name") || "{}"));
      setTargetName(LinuxTargetName ? LinuxTargetName : name)
      if (localStorage.getItem("vpnUserName") !== null) {
        setVpnUserName(JSON.parse(localStorage.getItem("vpnUserName") || "{}"));
      };
      if (localStorage.getItem("vpnPassword") !== null) {
        // setVpnPassword(JSON.parse(localStorage.getItem("vpnPassword") || "{}"));
      };
    };
  }, []);

  useEffect(() => {
    if (
      formState.isDelete === true ||
      formState.isFailed === true ||
      formState.isSuccess === true ||
      formState.isUpdate === true
    ) {
      setTimeout(function() {
        handleAlertClose();
      }, ALERT_MESSAGE_TIMER);
    }
  }, [formState]);

  let clientID = props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo.clientId : undefined;
  let host = props.location.state && props.location.state.targetInfo ? props.location.state.targetInfo.host : undefined;

  const checkValidation = () => {
    if (
      isError.name !== "" ||
      isError.ipAddress !== "" ||
      isError.userName !== "" ||
      isError.password !== "" ||
      isError.vpnUserName !== "" ||
      isError.vpnPassword !== "" ||
      !ipAddress ||
      !userName ||
      !password ||
      !connectionSuccess
    ) {
      return true;
    }
    return false;
  };

  if (backdrop) return <SimpleBackdrop />;

  const handleClose = () => {
    setShowDialogBox(false);
    setTimeout(() => {
      if(connectionSuccess){
      data = {
        LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : true,
        windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : false,
        editData: props.location.state && props.location.state.editData ? props.location.state.editData : false,
        clientInfo: props.location.state.clientInfo, targetInfo: props.location.state.targetInfo,
        editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : true,
        editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
      }
    }else {
      data = {
        LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : true,
        windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : false,
        editData: props.location.state && props.location.state.editData ? props.location.state.editData : false,
        clientInfo: props.location.state.clientInfo, targetInfo: props.location.state.targetInfo,
        editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
        editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
      }
    }
      history.push(routeConstant.TASK_DETAILS, data);
    }, 500);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleIpRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIpAddress(event.target.value);
    let value = event.target.value;
    let isErrIpRange = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      ipAddress: isErrIpRange,
    }));
    setSubmitDisabled(checkValidation);
  };

  const handleUserNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserName(event.target.value);
    let value = event.target.value;
    let isErrVpnUserName = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      vpnUserName: isErrVpnUserName,
    }));
    // setSubmitDisabled(checkValidation);
  };
 
  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
    let value = event.target.value;
    let isErrVpnPassword = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      vpnPassword: isErrVpnPassword,
    }));
    // setSubmitDisabled(checkValidation);
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

  const handleClickShowVpnPassword = () => {
    setShowPassword(!showPassword);
  };

  let data = {};
  const handleOkay = () => {
    setTimeout(() => {
      if(connectionSuccess) {
        data = {
          LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : true,
          windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : false,
          editData: props.location.state.editData ? props.location.state.editData : false,
          editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : true,
          editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
          clientInfo: props.location.state.clientInfo,
          targetInfo: props.location.state.targetInfo
        };
      } else {
      data = {
        LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : true,
        windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : false,
        editData: props.location.state.editData ? props.location.state.editData : false,
        editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
        editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
        clientInfo: props.location.state.clientInfo,
        targetInfo: props.location.state.targetInfo
      };
    }
      history.push(routeConstant.WINDOWS_NETWORK, data);
    }, 1000);
  };


  const handleSubmitDialogBox = () => {
    if (editDataId) {
      // setSubmitDisabled(true)
      let input = {
        partner: partnerId,
        client: clientId,
        targetName: targetName,
        host: ipRange,
        linuxUsername: userName,
        linuxPassword: password,
        vpnUsername: vpnUserName,
        vpnPassword: vpnPassword,
        startDate: startDate,
        linuxIpAddress: ipAddress
      };
      let id = editDataId;
      updateTarget({
        variables: {
          input,
          id,
        },
      })
        .then((userRes) => {
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: true,
            isDelete: false,
            isFailed: false,
            errMessage: "Linux Credentials Updated Successfully !.",
          }));
          setSubmitDisabled(false)
          setEditDataId(null);
          localStorage.setItem("ipAddress", JSON.stringify(ipAddress));
          localStorage.setItem("userName", JSON.stringify(userName));
          localStorage.setItem("password", JSON.stringify(password));
          if(userRes.data.updateTarget != undefined) {
		      // localStorage.setItem("name", JSON.stringify(userRes.data.updateTarget.targetField.targetName));
          localStorage.setItem("LinuxTargetName", JSON.stringify(userRes.data.updateTarget.targetField.targetName));
          }
          // setRaStepper(client, stepper.Task.name, stepper.Task.value, props.location.state);
          setShowDialogBox(false)
          let data = {};
          setTimeout(() => {
            setLinuxDomain(true);
            setShowDialogBox(true)
            setDialogBoxMsg(msgConstant.WINDOWS_NETWORK_CREDENTIALS);
          }, 1000);
        })
        .catch((err) => {
          setShowDialogBox(false)
          setSubmitDisabled(true)
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
  };

  const onClickTestConnection = () => {
      if(localStorage.getItem("runTargetName") != null && targetData && targetData != null || targetData != undefined && targetData.getCredentialsDetails && targetData.getCredentialsDetails.edges &&  targetData.getCredentialsDetails.edges.length > 0) {        console.log("targetData.getCredentialsDetails",targetData);
        setBackdrop(true)
    testVpnConnection({
      variables: {
        input: {
          client: clientID,
          targetName: targetName,
          vpnUsername: VPNUsername,
          vpnPassword: VPNPassword,
          host: ipRange,
          username: userName,
          password: password,
          ipAddress: ipAddress, 
          targetId :targetData.getCredentialsDetails.edges ? targetData.getCredentialsDetails.edges[0].node.vatTarget.id : null
        }
      }
    }).then((response: any) => {
      setBackdrop(false)
      if (response.data.domainConnection.success == "Authentication succeeded, connection successful") {
        SetConnectionSuccess(true)
        setSubmitDisabled(false)
        setFormState((formState) => ({
          ...formState,
          isSuccess: true,
          isUpdate: false,
          isDelete: false,
          isFailed: false,
          errMessage: "Test Connection Successful",
        }));
      }
      else if(response.data.vpnConnection.success == "VPN is Connected,Please Disconnect") {
        SetConnectionSuccess(false)
        setSubmitDisabled(true)
        setFormState((formState) => ({
          ...formState,
          isSuccess: false,
          isUpdate: false,
          isDelete: false,
          isFailed: true,
          errMessage: "You are already connected with another VPN. Please disconnect then try again",
        }));
      }
       else {
        SetConnectionSuccess(false)
        setSubmitDisabled(true)
        setFormState((formState) => ({
          ...formState,
          isSuccess: false,
          isUpdate: false,
          isDelete: false,
          isFailed: true,
          errMessage: "Test Connection Failed ",
        }));

      }
    }).catch(() => {
      setSubmitDisabled(true)
      setBackdrop(false)
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: "",
      }));
    })
      }
      else {
    setBackdrop(true)
    testVpnConnection({
      variables: {
        input: {
          client: clientID,
          targetName: targetName,
          vpnUsername: VPNUsername,
          vpnPassword: VPNPassword,
          host: ipRange,
          username: userName,
          password: password,
          ipAddress: ipAddress
        }
      }
    }).then((response: any) => {
      setBackdrop(false)
      if (response.data.domainConnection.success == "Authentication succeeded, connection successful") {
        SetConnectionSuccess(true)
        setSubmitDisabled(false)
        setFormState((formState) => ({
          ...formState,
          isSuccess: true,
          isUpdate: false,
          isDelete: false,
          isFailed: false,
          errMessage: "Test Connection Successful",
        }));
      }
      else if(response.data.vpnConnection.success == "VPN is Connected,Please Disconnect") {
        SetConnectionSuccess(false)
        setSubmitDisabled(true)
        setFormState((formState) => ({
          ...formState,
          isSuccess: false,
          isUpdate: false,
          isDelete: false,
          isFailed: true,
          errMessage: "You are already connected with another VPN. Please disconnect then try again",
        }));
      }
       else {
        SetConnectionSuccess(false)
        setSubmitDisabled(true)
        setFormState((formState) => ({
          ...formState,
          isSuccess: false,
          isUpdate: false,
          isDelete: false,
          isFailed: true,
          errMessage: "Test Connection Failed ",
        }));

      }
    }).catch(() => {
      setSubmitDisabled(true)
      setBackdrop(false)
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: "Test Connection Failed ",
      }));
    })
    }
  };

  const handleBack = () => {
    let data = {  editData: true,
      editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
      LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
      windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : true,
      clientInfo: clientInfo, targetInfo: targetInfo,
      editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false, 
    };
      history.push(routeConstant.TARGET,data);  
    // history.push(routeConstant.TARGET,data);
  };
  return (
    <React.Fragment>
      <CssBaseLine />
      <Typography component="h5" variant="h1">
        Linux Network :
      </Typography>
      <RaStepper />
      <Grid container spacing={3}>
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
            label=" User Name"
            value={userName}
            onChange={handleUserNameChange}
            required
            error={isError.vpnUserName}
            helperText={isError.userName}
          >
            User Name
          </Input>
        </Grid>
        <Grid item xs={12} md={6} className={styles.PasswordField}>
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
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={handlePasswordChange}
              required
              error={isError.vpnPassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowVpnPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {isError.vpnPassword ? (
              <FormHelperText
                error={isError.vpnPassword}
                classes={{ root: styles.FormHelperText }}
              >
                Please enter a password.
              </FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="IP List"
            value={ipAddress}
            onChange={handleIpRangeChange}
            required
            error={isError.ipAddress}
            helperText={isError.ipAddress}
          >
            IP List
          </Input>
        </Grid>
        <Grid item xs={12} className={styles.ActionButtons}>
          <Button
            variant={"contained"}
            onClick={handleBack}
            color="secondary"
            data-testid="cancel-button"
          >
            back
          </Button>
          <AlertBox
            DialogTitle={""}
            open={showDialogBox}
            dialogBoxMsg={dialogBoxMsg}
            pathName={""}
            handleOkay={handleOkay}
            cancelButtonPath={""}
            closeButtonPath={handleClose}
            buttonName={"Yes"}
            CloseButtonName={"No"}
            handleCancel={handleClose}
            handleClose={handleClose}
          ></AlertBox>

          <Button
            type="button"
            color="primary"
            variant={"contained"}
            onClick={onClickTestConnection}
          >
            {props.location.state != undefined && props.location.state.editLinuxData ?  "Retry" : "Test Connection"}
        </Button>
        <Button
            onClick={handleSubmitDialogBox}
            color="primary"
            variant={"contained"}
            data-testid="ok-button"
            disabled={submitDisabled}
          >
            next
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Linux_Network;