import React, { useState, useEffect } from "react";
import styles from "./Windows_Network.module.css";
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
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { GET_TARGET } from "../../../graphql/queries/Target";
import { setRaStepper } from "../common/SetRaStepper";
import { useHistory } from "react-router-dom";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Button } from "../../../components/UI/Form/Button/Button";
import * as routeConstant from "../../../common/RouteConstants";
import * as msgConstant from "../../../common/MessageConstants";
import AlertBox from "../../../components/UI/AlertBox/AlertBox";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "../../../components/UI/Alert/Alert";
import stepper from "../common/raStepperList.json";
import {
  CREATE_TARGET,
  UPDATE_TARGET,
  DELETE_TARGET,
} from "../../../graphql/mutations/Target";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../common/MessageConstants";
import { TEST_WINDOWS_CONNECTION } from "../../../graphql/mutations/VPNConnection";
import rerunstepper from "../common/raRerunStepperList.json";
import {
  setActiveFormStep,
} from "../../../services/Data";


export const Windows_Network: React.FC = (props: any) => {
  const history = useHistory();
  const client = useApolloClient();
  const [ipRange, setIpRange] = useState<String>("");
  const [userName, setUserName] = useState<String>("");
  const [domainName, setDomainName] = useState<String>("");
  const [vpnUserName, setVpnUserName] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [showPassword, setShowPassword] = useState(false);
  const [dialogBoxMsg, setDialogBoxMsg] = useState("");
  const [linuxDomain, setWindowsDomain] = useState(false);
  const [showDialogBox, setShowDialogBox] = useState<boolean>(false);
  const clientInfo = props.location.state ? props.location.state.clientInfo : undefined;
  const [editDataId, setEditDataId] = useState<Number | null>();
  const [ipAddress, setIpAddress] = useState<String>("");
  const [connectionSuccess, SetConnectionSuccess] = useState(false);
  const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");
  const ReRunTargetName = JSON.parse(localStorage.getItem("re-runTargetName") || "{}");
  const targetId = JSON.parse(localStorage.getItem("targetId") || "{}");
  const VPNUsername = JSON.parse(localStorage.getItem("vpnUserName") || "{}");
  const VPNPassword = JSON.parse(localStorage.getItem("vpnPassword") || "{}");
  // const WinTargetName = JSON.parse(localStorage.getItem("WinTargetName") || "{}");
  const WinTargetName = localStorage.getItem("WinTargetName") ? JSON.parse(localStorage.getItem("WinTargetName") || '') :  null;
  const LinuxTargetName = localStorage.getItem("LinuxTargetName") ? JSON.parse(localStorage.getItem("LinuxTargetName") || '') :  null;
  const name = localStorage.getItem("name") ? JSON.parse(localStorage.getItem("name") || '') :  null;
  const[showBackdrop, setShowbackdrop]= useState(true);
  // const name = JSON.parse(localStorage.getItem("name")|| "{}")
  const targetInfo = props.location.state ? props.location.state.targetInfo : undefined;
  const partnerId = partner.partnerId.id;
  const [targetName, setTargetName] = useState<String>("");
  const clientId = clientInfo ? parseInt(clientInfo.clientId) : undefined;
  const [backdrop, setBackdrop] = useState(false);
  if (props.location.state) {
    if (editDataId === null || editDataId === undefined && localStorage.getItem("targetId") !== "{") {
      setEditDataId(JSON.parse(localStorage.getItem("targetId") || "{}"));
    }
  };
  const [testWindowsConnection] = useMutation(TEST_WINDOWS_CONNECTION);
  const [isError, setIsError] = useState<any>({
    name: "",
    ipRange: "",
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

  const startDate = new Date();
  const [updateTarget] = useMutation(UPDATE_TARGET);
  const checkValidation = () => {
    if (
      isError.name !== "" ||
      isError.ipRange !== "" ||
      isError.userName !== "" ||
      isError.password !== "" ||
      isError.vpnUserName !== "" ||
      isError.vpnPassword !== "" ||
      !ipRange ||
      !userName ||
      !password ||
      !connectionSuccess
    ) {
      return true;
    }
    return false;
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

  const
    { data: targetData, loading: targetLoading, error: targetError }
      = useQuery(GET_TARGET, {
        variables: {
          targetName: props.location.state && props.location.state.editData ? (targetName ? targetName : ReRunTargetName) : (ReRunTargetName ? ReRunTargetName : targetName),
        },
        onCompleted: (data: any) => {
          setShowbackdrop(false)
          if (targetData && data.getCredentialsDetails.edges[0]) {
            setIpAddress(data.getCredentialsDetails.edges[0].node.winIpAddress);
            setUserName(
              data.getCredentialsDetails.edges[0].node
                ? data.getCredentialsDetails.edges[0].node.winUsername
                : null
            );
            setDomainName(data.getCredentialsDetails.edges[0].node
              ? data.getCredentialsDetails.edges[0].node.winName
              : null);
          }
        },
        onError: (err) => {
          setShowbackdrop(false)
          let error = err.message;
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: false,
            isFailed: true,
            errMessage: error,
          }));
          history.push(routeConstant.RA_REPORT_LISTING);
        },
        fetchPolicy: "cache-and-network",
      });

  useEffect(() => {
    console.log("ReRunTargetName",ReRunTargetName)
    // setRaStepper(client, stepper.WindowsNetwork.name, stepper.WindowsNetwork.value, props.location.state);
    try {
    if(ReRunTargetName.includes("_windows")) {
      setActiveFormStep(1);
      let data = {
        LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
        windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : true,
        editData: props.location.state && props.location.state.editData ? props.location.state.editData : false,
        clientInfo: props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo : null,
        targetInfo: props.location.state && props.location.state.targetInfo ? props.location.state.targetInfo : null,
        editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
        editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
        targetName : ReRunTargetName ? ReRunTargetName : targetName
      }
      setRaStepper(client, rerunstepper.WindowsNetwork.name, rerunstepper.WindowsNetwork.value, data);
      console.log("WINDOWS RERUN ")
    } else {
    setRaStepper(client, stepper.WindowsNetwork.name, stepper.WindowsNetwork.value, props.location.state);
    setActiveFormStep(2);
    }
  }catch {
    setRaStepper(client, stepper.WindowsNetwork.name, stepper.WindowsNetwork.value, props.location.state);
    setActiveFormStep(2);
    }
    if(props.location.state != undefined && props.location.state.editWindowsData && props.location.state.editWindowsData === true) {
      SetConnectionSuccess(true);
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
      setTargetName(WinTargetName ? WinTargetName : name)
      setIpRange(JSON.parse(localStorage.getItem("ipRange") || ""));
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

  // if (backdrop || targetLoading) return <SimpleBackdrop />;

  const handleOkay = () => {
    setWindowsDomain(true);
    setShowDialogBox(true)
    setDialogBoxMsg(msgConstant.WINDOWS_NETWORK_CREDENTIALS);
  };

  const handleSubmitDialogBox = () => {
    if (editDataId) {
      // setSubmitDisabled(true)
      let input = {
        partner: partnerId,
        client: clientId,
        targetName: targetName,
        host: ipRange,
        winName: domainName,
        winIpAddress: ipAddress,
        winUsername: userName,
        winPassword: password,
        startDate: startDate,
        vpnUsername: VPNUsername,
        vpnPassword: VPNPassword,
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
            errMessage: "Windows Credentials Updated Successfully !.",
          }));
          setSubmitDisabled(false)
          setEditDataId(null);
          localStorage.setItem("winUsername", JSON.stringify(userName));
          localStorage.setItem("winPassword", JSON.stringify(password));
          localStorage.setItem("WinTargetName", JSON.stringify(userRes.data.updateTarget.targetField.targetName));
          setRaStepper(client, stepper.Task.name, stepper.Task.value, props.location.state);
          setShowDialogBox(false)
          let data = {};
          // setTimeout(() => {
            if(connectionSuccess) {
            data = {
              LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
              windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : true,
              editData: props.location.state && props.location.state.editData ? props.location.state.editData : false,
              clientInfo: props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo : null,
              targetInfo: props.location.state && props.location.state.targetInfo ? props.location.state.targetInfo : null,
              editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
              editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : true,
            }
          }else {
            data = {
              LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
              windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : true,
              editData: props.location.state && props.location.state.editData ? props.location.state.editData : false,
              clientInfo: props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo : null,
              targetInfo: props.location.state && props.location.state.targetInfo ? props.location.state.targetInfo : null,
              editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
              editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
            }
          }
          try {
            if (ReRunTargetName != {} && ReRunTargetName.includes("_windows") ) {
            history.push(routeConstant.LINUX_NETWORK, data);
            } else {
              history.push(routeConstant.TASK_DETAILS, data);
            }
          }
          catch {
            history.push(routeConstant.TASK_DETAILS, data);
          }
          // }, 1000);
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

  const handleSkip = () => {
    try {
    if (ReRunTargetName != {} && ReRunTargetName.includes("_windows") ) {
      console.log("ReRunTargetName if ",ReRunTargetName)
    let  data = {
        LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
        windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : true,
        editData: props.location.state && props.location.state.editData ? props.location.state.editData : false,
        clientInfo: props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo : null,
        targetInfo: props.location.state && props.location.state.targetInfo ? props.location.state.targetInfo : null,
        editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
        editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
        targetName : ReRunTargetName ? ReRunTargetName : targetName
      }
      setRaStepper(client, rerunstepper.LinuxNetwork.name, rerunstepper.LinuxNetwork.value, data);
      history.push(routeConstant.LINUX_NETWORK, data);
    }
    else {
    let data = { windowsNetwork: true, editData: true, clientInfo: props.location.state.clientInfo, targetInfo: props.location.state.targetInfo }
    setRaStepper(client, stepper.Task.name, stepper.Task.value, data);
    history.push(routeConstant.TASK_DETAILS, data);
    }
  }catch {
    let data = { windowsNetwork: true, editData: true, clientInfo: props.location.state.clientInfo, targetInfo: props.location.state.targetInfo }
    setRaStepper(client, stepper.Task.name, stepper.Task.value, data);
    history.push(routeConstant.TASK_DETAILS, data);
  }
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
      ipRange: isErrIpRange,
    }));
    // setSubmitDisabled(checkValidation);
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
    let value = event.target.value;
    let isErrUserName = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      userName: isErrUserName,
    }));
    // setSubmitDisabled(checkValidation);
  };
  const handleDomainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDomainName(event.target.value);
    let value = event.target.value;
    let isErrUserName = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      domainName: isErrUserName,
    }));
    // setSubmitDisabled(checkValidation);
  };

  const handleVpnUserNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVpnUserName(event.target.value);
    let value = event.target.value;
    let isErrVpnUserName = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      vpnUserName: isErrVpnUserName,
    }));
    // setSubmitDisabled(checkValidation);
  };

  const onClickTestConnection = () => {
    if(localStorage.getItem("runTargetName") != null && targetData && targetData != null || targetData != undefined && targetData.getCredentialsDetails && targetData.getCredentialsDetails.edges &&  targetData.getCredentialsDetails.edges.length > 0) {        console.log("targetData.getCredentialsDetails",targetData);
        setBackdrop(true);
        testWindowsConnection({
          variables: {
            input: {
              client: clientId,
              targetName: targetName,
              vpnUsername: VPNUsername,
              vpnPassword: VPNPassword,
              host: ipRange,
              winUsername: userName,
              winPassword: password,
              winIpAddress: ipAddress,
              winName: domainName,
              targetId : targetData.getCredentialsDetails.edges[0].node.vatTarget.id
            },
          },
        })
          .then((response: any) => {
            setBackdrop(false);
            if (
              response.data.windowsVpnTest.success ==
              "Authentication succeeded, connection successful"
            ) {
              SetConnectionSuccess(true);
              setSubmitDisabled(false);
              setFormState((formState) => ({
                ...formState,
                isSuccess: true,
                isUpdate: false,
                isDelete: false,
                isFailed: false,
                errMessage: "Test Connection Successful",
              }));
            } else if (
              response.data.windowsVpnTest.success ==
              "VPN is Connected,Please Disconnect"
            ) {
              SetConnectionSuccess(false);
              setSubmitDisabled(true);
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage:
                  "You are already connected with another VPN. Please disconnect then try again",
              }));
            } else {
              SetConnectionSuccess(false);
              setSubmitDisabled(true);
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage: "Test Connection Failed ",
              }));
            }
          })
          .catch(() => {
            setSubmitDisabled(true)
            setBackdrop(false);
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: "",
            }));
          });
      }else {
    setBackdrop(true);
    testWindowsConnection({
      variables: {
        input: {
          client: clientId,
          targetName: targetName,
          vpnUsername: VPNUsername,
          vpnPassword: VPNPassword,
          host: ipRange,
          winUsername: userName,
          winPassword: password,
          winIpAddress: ipAddress,
          winName: domainName,
        },
      },
    })
      .then((response: any) => {
        setBackdrop(false);
        if (
          response.data.windowsVpnTest.success ==
          "Authentication succeeded, connection successful"
        ) {
          SetConnectionSuccess(true);
          setSubmitDisabled(false);
          setFormState((formState) => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: "Test Connection Successful",
          }));
        } else if (
          response.data.windowsVpnTest.success ==
          "VPN is Connected,Please Disconnect"
        ) {
          SetConnectionSuccess(false);
          setSubmitDisabled(true);
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: false,
            isFailed: true,
            errMessage:
              "You are already connected with another VPN. Please disconnect then try again",
          }));
        } else {
          SetConnectionSuccess(false);
          setSubmitDisabled(true);
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: false,
            isFailed: true,
            errMessage: "Test Connection Failed ",
          }));
        }
      })
      .catch(() => {
        setSubmitDisabled(true)
        setBackdrop(false);
        setFormState((formState) => ({
          ...formState,
          isSuccess: false,
          isUpdate: false,
          isDelete: false,
          isFailed: true,
          errMessage: "",
        }));
      });
    }    
  };


  const handleClose = () => {
    setShowDialogBox(false);
  };

  const handleBack = () => {
try {
    if (ReRunTargetName != {} &&  ReRunTargetName.includes("_windows") ) {
      let data = {
       LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
       windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : true,
       editData: props.location.state && props.location.state.editData ? props.location.state.editData : false,
       clientInfo: props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo : null,
       targetInfo: props.location.state && props.location.state.targetInfo ? props.location.state.targetInfo : null,
       editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
       editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
       targetName : ReRunTargetName ? ReRunTargetName : targetName
     }
     setRaStepper(client, rerunstepper.Target.name, rerunstepper.Target.value, data);
     history.push(routeConstant.TARGET, data);
   }
   else {
    let data = {
      editData: true,
      LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : true,
      windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : false,
      clientInfo: props.location.state.clientInfo, targetInfo: props.location.state.targetInfo,
      editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
      editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
    }
    if (LinuxTargetName) {
      history.push(routeConstant.LINUX_NETWORK, data);
    } else {
      history.push(routeConstant.TARGET, data);
    }
   }
  }catch {
    let data = {
      editData: true,
      LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : true,
      windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : false,
      clientInfo: props.location.state.clientInfo, targetInfo: props.location.state.targetInfo,
      editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
      editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
    }
    if (LinuxTargetName) {
      history.push(routeConstant.LINUX_NETWORK, data);
    } else {
      history.push(routeConstant.TARGET, data);
    }
  }


   
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    let value = event.target.value;
    let isErrPassword = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      password: isErrPassword,
    }));
    // setSubmitDisabled(checkValidation);
  };
  return (
    <React.Fragment>
      <CssBaseLine />
      <Typography component="h5" variant="h1">
      Vulnerability Test for {" "}
        {props.location.state !== undefined &&
        props.location.state.clientInfo !== undefined
          ? props.location.state.clientInfo.name
          : null}
      </Typography>
      <RaStepper />
      {backdrop || targetLoading  ? <SimpleBackdrop/>: null}
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
            label="User Name"
            value={userName}
            onChange={handleUserNameChange}
            required
            error={isError.userName}
            helperText={isError.userName}
          >
            User Name
          </Input>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="Domain Name"
            value={domainName}
            onChange={handleDomainChange}
            required
            error={isError.domainName}
            helperText={isError.domainName}
          >
            Domain Name
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
              error={isError.password}
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
            {isError.password ? (
              <FormHelperText
                error={isError.password}
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
            error={isError.ipRange}
            helperText={isError.ipRange}
          >
            IP Range
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
          <Button
            variant={"contained"}
            onClick={handleSkip}
            color="secondary"
            data-testid="cancel-button"
          >
            skip
          </Button>
          <Button
            type="button"
            color="primary"
            variant={"contained"}
            onClick={onClickTestConnection}
          >
            {props.location.state != undefined && props.location.state.editWindowsData ?  "Retry" : "Test Connection"}
        </Button>
        <Button
            onClick={handleSubmitDialogBox}
            color="primary"
            variant={"contained"}
            data-testid="ok-button"
            disabled={!connectionSuccess}
          >
            next
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
export default Windows_Network;
