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
    console.log("editDataId",editDataId)
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
  const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");
  const partnerId = partner.partnerId;
  const clientId = clientInfo ? parseInt(clientInfo.clientId) : undefined;
  const [testVpnConnection] = useMutation(TEST_LINUX_CONNECTION);

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

  const [
    getTargetData,
    { data: targetData, loading: targetLoading, error: targetError },
  ] = useLazyQuery(GET_TARGET, {
    onCompleted: (data: any) => {
      if (targetData && data.getTarget.edges[0]) {
        setIpRange(data.getTarget.edges[0].node.host);
        setUserName(
          data.getTarget.edges[0].node.vatCredentials
            ? data.getTarget.edges[0].node.vatCredentials.domainUsername
            : null
        );
        setPassword(
          data.getTarget.edges[0].node.vatCredentials
            ? data.getTarget.edges[0].node.vatCredentials.domainPassword
            : null
        );
        setVpnUserName(
          data.getTarget.edges[0].node.vatCredentials
            ? data.getTarget.edges[0].node.vatCredentials.vpnUsername
            : null
        );
        setVpnPassword(
          data.getTarget.edges[0].node.vatCredentials
            ? data.getTarget.edges[0].node.vatCredentials.vpnPassword
            : null
        );
      }
    },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    setRaStepper(client, stepper.LinuxNetwork.name, stepper.LinuxNetwork.value);
  }, []);

  useEffect(() => {
    if (targetId && editDataId !== undefined) {
      setIpRange(JSON.parse(localStorage.getItem("ipRange") || ""));
      setTargetName(JSON.parse(localStorage.getItem("name") || "{}"));
      if (localStorage.getItem("userName") !== null) {
        setUserName(JSON.parse(localStorage.getItem("userName") || "{}"));
      };
      if (localStorage.getItem("password") !== null) {
        setPassword(JSON.parse(localStorage.getItem("password") || "{}"));
      };
      if (localStorage.getItem("ipAddress") !== null) {
        setIpAddress(JSON.parse(localStorage.getItem("ipAddress") || "{}"));
      };
      if (localStorage.getItem("vpnUserName") !== null) {
        setVpnUserName(JSON.parse(localStorage.getItem("vpnUserName") || "{}"));
      };
      if (localStorage.getItem("vpnPassword") !== null) {
        setVpnPassword(JSON.parse(localStorage.getItem("vpnPassword") || "{}"));
      };
    };
  }, []);


  const [createTarget] = useMutation(CREATE_TARGET);

  useEffect(() => {
    if (targetName !== null && clientInfo) {
      getTargetData({
        variables: {
          targetName: targetName,
        },
      });

      getTaskData({
        variables: {
          targetName: targetName,
          client_ClientName: clientInfo.name,
        },
      });
    }
  }, [targetName]);

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
      !password
    ) {
      return true;
    }
    return false;
  };

  if (backdrop) return <SimpleBackdrop />;

  console.log("props", props.location)
  const handleClose = () => {
    setShowDialogBox(false);
    setTimeout(() => {
      data = { clientInfo: props.location.state.clientInfo, targetInfo: props.location.state.targetInfo }
      history.push(routeConstant.TASK_DETAILS);
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
    setSubmitDisabled(checkValidation);
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
    setSubmitDisabled(checkValidation);
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
      data = {editData: true, clientInfo: props.location.state.clientInfo, targetInfo: props.location.state.targetInfo }
      history.push(routeConstant.WINDOWS_NETWORK, data);
    }, 1000);
  };


  const handleSubmitDialogBox = () => {
    if (editDataId) {
      setSubmitDisabled(true)
      let input = {
        partner: partnerId,
        client: clientId,
        targetName: targetName,
        host: ipRange,
        winUsername: userName,
        winPassword: password,
        vpnUsername: vpnUserName,
        vpnPassword: vpnPassword,
        startDate: startDate,
        ipAddress: ipAddress,
        networkType: networkType
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
          localStorage.setItem("ipAddress", JSON.stringify(ipAddress));
          localStorage.setItem("userName", JSON.stringify(userName));
          localStorage.setItem("password", JSON.stringify(password));
          setRaStepper(client, stepper.Task.name, stepper.Task.value);
          setShowDialogBox(false)
          let data = {};
          setTimeout(() => {
            setLinuxDomain(true);
            setShowDialogBox(true)
            setDialogBoxMsg(msgConstant.LINUX_NETWORK_CREDENTIALS);
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
    } else {
      let input = {
        partner: partnerId,
        client: clientId,
        targetName: targetName,
        host: ipRange,
        winUsername: userName,
        winPassword: password,
        vpnUsername: VPNUsername,
        vpnPassword: VPNPassword,
        startDate: startDate,
        ipAddress: ipAddress,
        networkType: networkType
      };
      createTarget({
        variables: {
          input,
        },
      })
        .then((userRes) => {
          setSubmitDisabled(false)
          setFormState((formState) => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: "Target Created Successfully !!",
          }));
          setRaStepper(client, stepper.Task.name, stepper.Task.value);
          // localStorage.setItem("name", JSON.stringify(name));
          localStorage.setItem(
            "targetId",
            JSON.stringify(userRes.data.createTarget.targetField.id)
          );
          localStorage.setItem("ipAddress", JSON.stringify(ipAddress));
          localStorage.setItem("userName", JSON.stringify(userName));
          localStorage.setItem("password", JSON.stringify(password));
          setShowDialogBox(false)
          let data = {};
          let targetInfo = {
            targetName: targetName,
            host: ipAddress,
            userName: userName,
            password: password,
          };
          setTimeout(() => {
            setLinuxDomain(true);
            setShowDialogBox(true)
            setDialogBoxMsg(msgConstant.WINDOWS_NETWORK_CREDENTIALS);
          }, 1000);
        })
        .catch((err) => {
          setSubmitDisabled(false)
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
    console.log(password)
    // if (targetName && clientID && host && vpnUserName && ipAddress && userName && password) {
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
      if (response.data.vpnConnection.success == "VPN connected Successfully") {
        SetConnectionSuccess(true)
        setFormState((formState) => ({
          ...formState,
          isSuccess: true,
          isUpdate: false,
          isDelete: false,
          isFailed: false,
          errMessage: " Test Connection Successful",
        }));
      } else {
        SetConnectionSuccess(false)
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
      setBackdrop(false)
      console.log("Test Connection Failed !!!!")
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: "",
      }));
    })
    // }
  };


  const handleBack = () => {
    let data = {};
    // data = { refetchData: true, clientInfo: clientInfo };
    history.push(routeConstant.TARGET, props.location.state);
    // localStorage.removeItem("name");
    // localStorage.removeItem("targetId");
    // localStorage.removeItem("ipAddress");
    // localStorage.removeItem("userName");
    // localStorage.removeItem("password");
    // localStorage.removeItem("vpnUserName");
    // localStorage.removeItem("vpnPassword");
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
          <Button
            onClick={handleSubmitDialogBox}
            color="primary"
            variant={"contained"}
            data-testid="ok-button"
          // disabled={submitDisabled}
          >
            next
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
            Test Connection
        </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Linux_Network;