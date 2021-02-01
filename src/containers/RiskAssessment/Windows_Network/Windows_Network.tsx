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

export const Windows_Network: React.FC = (props: any) => {
  const history = useHistory();
  const client = useApolloClient();
  const [ipRange, setIpRange] = useState<String>("");
  const [userName, setUserName] = useState<String>("");
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
  const targetInfo = props.location.state ? props.location.state.targetInfo : undefined;
  const partnerId = partner.partnerId;
  const [targetName, setTargetName] = useState<String>("");
  const clientId = clientInfo ? parseInt(clientInfo.clientId) : undefined;
  if (props.location.state) {
    console.log("editDataId", editDataId)
    if (editDataId === null || editDataId === undefined && localStorage.getItem("targetId") !== "{") {
      setEditDataId(JSON.parse(localStorage.getItem("targetId") || "{}"));
    }
  };
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

  const
    { data: targetData, loading: targetLoading, error: targetError }
      = useQuery(GET_TARGET, {
        variables: {
          targetName: props.location.state && props.location.state.editData ? (targetName ? targetName : ReRunTargetName) : (ReRunTargetName ? ReRunTargetName : targetName),
        },
        onCompleted: (data: any) => {
          if (targetData && data.getCredentialsDetails.edges[0]) {
            setIpAddress(data.getCredentialsDetails.edges[0].node.winIpAddress);
            setUserName(
              data.getCredentialsDetails.edges[0].node
                ? data.getCredentialsDetails.edges[0].node.winUsername
                : null
            );
            setPassword(
              data.getCredentialsDetails.edges[0].node
                ? data.getCredentialsDetails.edges[0].node.winPassword
                : null
            );
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
  console.log("props", props.location.state.LinuxNetwork)
  useEffect(() => {
    setRaStepper(client, stepper.WindowsNetwork.name, stepper.WindowsNetwork.value);
  }, []);

  useEffect(() => {
    if (targetId && editDataId !== undefined) {
      setTargetName(JSON.parse(localStorage.getItem("name") || "{}"));
      setIpRange(JSON.parse(localStorage.getItem("ipRange") || ""));
    };
  }, []);


  const handleOkay = () => {
    setWindowsDomain(true);
    setShowDialogBox(true)
    setDialogBoxMsg(msgConstant.WINDOWS_NETWORK_CREDENTIALS);
  };

  const handleSubmitDialogBox = () => {
    if (editDataId) {
      setSubmitDisabled(true)
      let input = {
        partner: partnerId,
        client: clientId,
        targetName: targetName,
        host: ipRange,
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
          console.log("dsdsdsfdsdf", userRes)
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: true,
            isDelete: false,
            isFailed: false,
            errMessage: "",
          }));
          setSubmitDisabled(false)
          setEditDataId(null);
          localStorage.setItem("winUsername", JSON.stringify(userName));
          localStorage.setItem("winPassword", JSON.stringify(password));
          setRaStepper(client, stepper.Task.name, stepper.Task.value);
          setShowDialogBox(false)
          let data = {};
          setTimeout(() => {
            data = {
              LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
              windowsNetwork:  props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : true,
              editData: props.location.state && props.location.state.editData ? props.location.state.editData : false,
              clientInfo: props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo : null,
              targetInfo: props.location.state && props.location.state.targetInfo ? props.location.state.targetInfo: null
            }
            history.push(routeConstant.TASK_DETAILS, data);
          }, 1000);
          // setTimeout(() => {
          //   setLinuxDomain(true);
          //   setShowDialogBox(true)
          //   // setDialogBoxMsg(msgConstant.WINDOWS_NETWORK_CREDENTIALS);
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
  console.log("prorps-----------", props.location)
  const handleSkip = () => {
    let data = {};
    data = { windowsNetwork: true, editData: true, clientInfo: props.location.state.clientInfo, targetInfo: props.location.state.targetInfo }
    history.push(routeConstant.TASK_DETAILS, data);
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
    setSubmitDisabled(checkValidation);
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
    let value = event.target.value;
    let isErrUserName = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      userName: isErrUserName,
    }));
    setSubmitDisabled(checkValidation);
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
    setSubmitDisabled(checkValidation);
  };


  const onClickTestConnection = () => {
    // if (targetName && clientID && host && vpnUserName && ipAddress && userName && password) {
    // setBackdrop(true)
    // testVpnConnection({
    //   variables: {
    //     input: {
    //       client: clientID,
    //       targetName: targetName,
    //       vpnUsername: VPNUsername,
    //       vpnPassword: VPNPassword,
    //       host: ipRange,
    //       username: userName,
    //       password: password,
    //       ipAddress: ipAddress
    //     }
    //   }
    // }).then((response: any) => {
    //   setBackdrop(false)
    //   if (response.data.domainConnection.success == "VPN connected Successfully") {
    SetConnectionSuccess(false)
    //     setSubmitDisabled(false)
    //     setFormState((formState) => ({
    //       ...formState,
    //       isSuccess: true,
    //       isUpdate: false,
    //       isDelete: false,
    //       isFailed: false,
    //       errMessage: " Test Connection Successful",
    //     }));
    //   } 
    //   if(response.data.domainConnection.success == "VPN connection Failed") {
    //     SetConnectionSuccess(false)
    setSubmitDisabled(true)
    setFormState((formState) => ({
      ...formState,
      isSuccess: false,
      isUpdate: false,
      isDelete: false,
      isFailed: true,
      errMessage: "Test Connection Failed ",
    }));

    //   }
    // }).catch(() => {
    //   setBackdrop(false)
    //   console.log("Test Connection Failed !!!!")
    //   setFormState((formState) => ({
    //     ...formState,
    //     isSuccess: false,
    //     isUpdate: false,
    //     isDelete: false,
    //     isFailed: true,
    //     errMessage: "",
    //   }));
    // })
    // }
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

  const handleClose = () => {
    setShowDialogBox(false);
  };

  const handleBack = () => {
    let data = {};
    // data = { refetchData: true, clientInfo: clientInfo };
    if (props.location.state && props.location.state.LinuxNetwork) {
      history.push(routeConstant.LINUX_NETWORK, props.location.state);
    } else {
      history.push(routeConstant.TARGET, props.location.state);
    }
    // localStorage.removeItem("name");
    // localStorage.removeItem("targetId");
    // localStorage.removeItem("ipRange");
    // localStorage.removeItem("userName");
    // localStorage.removeItem("password");
    // localStorage.removeItem("vpnUserName");
    // localStorage.removeItem("vpnPassword");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    let value = event.target.value;
    let isErrPassword = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      password: isErrPassword,
    }));
    setSubmitDisabled(checkValidation);
  };
  return (
    <React.Fragment>
      <CssBaseLine />
      <Typography component="h5" variant="h1">
        Windows Network :
      </Typography>
      <RaStepper />
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
          onClick={handleSubmitDialogBox}
          color="primary"
          variant={"contained"}
          data-testid="ok-button"
        // disabled={submitDisabled}
        >
          next
          </Button>
        <Button
          variant={"contained"}
          onClick={handleSkip}
          color="secondary"
          data-testid="cancel-button"
        >
          skip
          </Button>
        {/* <AlertBox
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
          ></AlertBox> */}
        <Button
          type="button"
          color="primary"
          variant={"contained"}
          onClick={onClickTestConnection}
        >
          Test Connection
        </Button>
      </Grid>
    </React.Fragment>
  )
}
export default Windows_Network;
