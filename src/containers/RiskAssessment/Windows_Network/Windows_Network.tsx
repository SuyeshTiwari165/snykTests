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
import Tooltip from '@material-ui/core/Tooltip';
import Cookies from 'js-cookie';
import logout from "../../Auth/Logout/Logout";
import {
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles";
import {
  DOMAIN_VERIFY,
  IP_VERIFY
} from "../../../graphql/mutations/DomainVerify";
import { OB_URI } from "../../../config";

export const Windows_Network: React.FC = (props: any) => {
  const history = useHistory();
  const client = useApolloClient();
  const [ipRange, setIpRange] = useState<any>("");
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
  const [ipAddress, setIpAddress] = useState<any>("");
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
  const [open, setOpen] = React.useState(false);
  const session = Cookies.getJSON('ob_session');

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
  const [deleteTarget] = useMutation(DELETE_TARGET);
  const [domainVerify] = useMutation(DOMAIN_VERIFY);
  const [IPVerify] = useMutation(IP_VERIFY);

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
      let data = {
        LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
        windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : true,
        editData: true,
        clientInfo: props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo : null,
        targetInfo: props.location.state && props.location.state.targetInfo ? props.location.state.targetInfo : null,
        editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
        editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
        targetName : ReRunTargetName ? ReRunTargetName : targetName
      }
    setRaStepper(client, stepper.WindowsNetwork.name, stepper.WindowsNetwork.value, data);
    setActiveFormStep(2);
    }
  }catch {
    let data = {
      LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
      windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : true,
      editData: true,
      clientInfo: props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo : null,
      targetInfo: props.location.state && props.location.state.targetInfo ? props.location.state.targetInfo : null,
      editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
      editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
      targetName : ReRunTargetName ? ReRunTargetName : targetName
    }
    setRaStepper(client, stepper.WindowsNetwork.name, stepper.WindowsNetwork.value, data);
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
        errMessage: "Connection has been validated"
      }));
    }
  }, []);

  useEffect(() => {
    if (targetId && editDataId !== undefined) {
      setTargetName(WinTargetName ? WinTargetName : name)
      setIpRange(JSON.parse(localStorage.getItem("ipRange") || ""));
    };
  }, []);

  // useEffect(() => {
  //   if (
  //     formState.isDelete === true ||
  //     formState.isFailed === true ||
  //     formState.isSuccess === true ||
  //     formState.isUpdate === true
  //   ) {
  //     setTimeout(function() {
  //       handleAlertClose();
  //     }, ALERT_MESSAGE_TIMER);
  //   }
  // }, [formState]);

  // if (backdrop || targetLoading) return <SimpleBackdrop />;

  const handleOkay = () => {
    setWindowsDomain(true);
    setShowDialogBox(true)
    setDialogBoxMsg(msgConstant.WINDOWS_NETWORK_CREDENTIALS);
  };

  const handleSubmitDialogBox = () => {
    setBackdrop(true);
    handleAlertClose();
    if(Cookies.getJSON('ob_session'))  {
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
          setBackdrop(false);
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: true,
            isDelete: false,
            isFailed: false,
            errMessage: "Windows Credentials Updated Successfully .",
          }));
          setSubmitDisabled(false)
          setEditDataId(null);
          localStorage.setItem("winUsername", JSON.stringify(userName));
          localStorage.setItem("winPassword", JSON.stringify(password));
          localStorage.setItem("WinTargetName", JSON.stringify(userRes.data.updateTarget.targetField.targetName));
          setShowDialogBox(false)
          let data = {};
          // setTimeout(() => {
            if(connectionSuccess) {
            data = {
              LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
              windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : true,
              editData: props.location.state && props.location.state.editData ? props.location.state.editData : true,
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
          setRaStepper(client,stepper.ScanConfiguration.name,stepper.ScanConfiguration.value, data);
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
          setBackdrop(false);
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
  }
    else {
      logout();
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
    // let data = { windowsNetwork: true, editData: true, clientInfo: props.location.state.clientInfo, targetInfo: props.location.state.targetInfo }
    let data = {
    LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
    windowsNetwork: true, 
    editData: true,
    clientInfo: props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo : null,
    targetInfo: props.location.state && props.location.state.targetInfo ? props.location.state.targetInfo : null,
    editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
    editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
    targetName : ReRunTargetName ? ReRunTargetName : targetName
    }

    setRaStepper(client,stepper.ScanConfiguration.name,stepper.ScanConfiguration.value, data);
    history.push(routeConstant.TASK_DETAILS, data);
    }
  }catch {
    // let data = { windowsNetwork: true, editData: true, clientInfo: props.location.state.clientInfo, targetInfo: props.location.state.targetInfo }
    let data = {
      LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
      windowsNetwork: true, 
      editData: true,
      clientInfo: props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo : null,
      targetInfo: props.location.state && props.location.state.targetInfo ? props.location.state.targetInfo : null,
      editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
      editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
      targetName : ReRunTargetName ? ReRunTargetName : targetName
      }
  
    setRaStepper(client,stepper.ScanConfiguration.name,stepper.ScanConfiguration.value, data);
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

  const submitAction = async () => {
    if (
      (localStorage.getItem("runTargetName") != null &&
        targetData &&
        targetData != null) ||
      (targetData != undefined &&
        targetData.getCredentialsDetails &&
        targetData.getCredentialsDetails.edges &&
        targetData.getCredentialsDetails.edges.length > 0)
    ) {
      setBackdrop(true);
      // testWindowsConnection({
      //   variables: {
      //     input: {
      //       client: clientId,
      //       targetName: targetName,
      //       vpnUsername: VPNUsername,
      //       vpnPassword: VPNPassword,
      //       host: ipRange,
      //       winUsername: userName,
      //       winPassword: password,
      //       winIpAddress: ipAddress,
      //       winName: domainName,
      //       targetId:
      //         targetData.getCredentialsDetails.edges[0].node.vatTarget.id,
      //     },
      //   },
      // })
      //   .then((response: any) => {
        const headerObj = {
          "Content-Type": "application/json",
          "Authorization": "jwt" + " " + session,
        };
        let url;
          url = OB_URI + "target/testwincredentails/?cid=" + clientId +  "&tname= " + targetName  + "&vusername=" + VPNUsername + "&vpasswords=" + VPNPassword + "&whost=" + ipAddress + "&wusername=" +  userName + "&wpassword=" + password + "&wname=" +  domainName + "&tid=" + targetData.getCredentialsDetails.edges[0].node.vatTarget.id
        await fetch(url, {
          method: "GET",
          headers: headerObj,
          // body: JSON.stringify({ UserId: 0, Assessment_ID: id }),
        })
        .then((data) => data.json())
          .then((response) => {
          setBackdrop(false);
          if (
            response ==
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
              errMessage: "Test connection successful",
            }));
          } else if (
            response ==
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
          }       
          else if(response == "Authentication failed, please verify your credentials") {
            SetConnectionSuccess(false)
            setSubmitDisabled(true)
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: " Authentication Failed",
            }));
          }
          else {
            SetConnectionSuccess(false);
            setSubmitDisabled(true);
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: "Test connection failed ",
            }));
          }
        })
        .catch(() => {
          setSubmitDisabled(true);
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
    } else {
      setBackdrop(true);
      // testWindowsConnection({
      //   variables: {
      //     input: {
      //       client: clientId,
      //       targetName: targetName,
      //       vpnUsername: VPNUsername,
      //       vpnPassword: VPNPassword,
      //       host: ipRange,
      //       winUsername: userName,
      //       winPassword: password,
      //       winIpAddress: ipAddress,
      //       winName: domainName,
      //     },
      //   },
      // })
        // .then((response: any) => {
          const headerObj = {
            "Content-Type": "application/json",
            "Authorization": "jwt" + " " + session,
          };
          let url;
            url = OB_URI + "target/testwincredentails/?cid=" + clientId +  "&tname= " + targetName  + "&vusername=" + VPNUsername + "&vpasswords=" + VPNPassword + "&whost=" + ipAddress + "&wusername=" +  userName + "&wpassword=" + password + "&wname=" +  domainName
          await fetch(url, {
            method: "GET",
            headers: headerObj,
            // body: JSON.stringify({ UserId: 0, Assessment_ID: id }),
          })
          .then((data) => data.json())
            .then((response) => {
          setBackdrop(false);
          if (
            response ==
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
              errMessage: "Test connection successful",
            }));
          } else if (
            response ==
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
          }
          else if(response == "Authentication failed, please verify your credentials") {
            SetConnectionSuccess(false)
            setSubmitDisabled(true)
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: " Authentication Failed",
            }));
          }
          else if(response == "Openvpn File is invalid") {
            SetConnectionSuccess(false)
            setSubmitDisabled(true)
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: " Invalid File",
            }));
          }              
          else {
            SetConnectionSuccess(false);
            setSubmitDisabled(true);
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: "Test connection failed ",
            }));
          }
        })
        .catch(() => {
          setSubmitDisabled(true);
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
  }

  const onClickTestConnection = () => {
    if (Cookies.getJSON("ob_session")) {
      if (handleInputErrors()) {
        handleAlertClose();
        let input = {
          "host": ipAddress
        };
        if(parseInt(ipAddress)){
          IPVerify({
          variables: {
            input
          },
        })
        .then((userRes) => {
          if(userRes.data.IPVerify.status === 'Valid IP address') {
            submitAction()
          } else {
            setBackdrop(false)
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: " Please Enter Valid IP Address",
            }));
          }
        })
        .catch((err) => {
          setBackdrop(false);
          let error = err.message;
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: false,
            isFailed: true,
            errMessage: error,
          }));
        });
      }else {
        domainVerify({
          variables: {
            input
          },
        })
          .then((userRes : any) => {
            if (userRes.data.domainVerify.status === 'Domain name is registered') {
              submitAction();
            } else {
              setBackdrop(false)
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage: " Please Enter Valid Domain Name",
              }));
            }
          })
          .catch((err : any) => {
            console.log("doMAIN api FAILED");
            setBackdrop(false);
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: " ",
            }));
          });
        }
      } else {
        setFormState((formState) => ({
          ...formState,
          isSuccess: false,
          isUpdate: false,
          isDelete: false,
          isFailed: true,
          errMessage: " Please fill in all the required fields",
        }));
      }
    } else {
      logout();
    }
  };


  const handleClose = () => {
    setShowDialogBox(false);
  };

  const handleBack = () => {
    if (Cookies.getJSON("ob_session")) {
      try {
        if (ReRunTargetName != {} && ReRunTargetName.includes("_windows")) {
          let data = {
            LinuxNetwork:
              props.location.state && props.location.state.LinuxNetwork
                ? props.location.state.LinuxNetwork
                : false,
            windowsNetwork:
              props.location.state && props.location.state.windowsNetwork
                ? props.location.state.windowsNetwork
                : true,
            editData: true,
            clientInfo:
              props.location.state && props.location.state.clientInfo
                ? props.location.state.clientInfo
                : null,
            targetInfo:
              props.location.state && props.location.state.targetInfo
                ? props.location.state.targetInfo
                : null,
            editLinuxData: props.location.state.editLinuxData
              ? props.location.state.editLinuxData
              : false,
            editWindowsData: props.location.state.editWindowsData
              ? props.location.state.editWindowsData
              : false,
            targetName: ReRunTargetName ? ReRunTargetName : targetName,
          };
          setRaStepper(
            client,
            rerunstepper.Target.name,
            rerunstepper.Target.value,
            data
          );
          history.push(routeConstant.TARGET, data);
        } else {
          let data = {
            editData: true,
            LinuxNetwork:
              props.location.state && props.location.state.LinuxNetwork
                ? props.location.state.LinuxNetwork
                : true,
            windowsNetwork:
              props.location.state && props.location.state.windowsNetwork
                ? props.location.state.windowsNetwork
                : false,
            clientInfo: props.location.state.clientInfo,
            targetInfo: props.location.state.targetInfo,
            editLinuxData: props.location.state.editLinuxData
              ? props.location.state.editLinuxData
              : false,
            editWindowsData: props.location.state.editWindowsData
              ? props.location.state.editWindowsData
              : false,
          };
          if (LinuxTargetName) {
            history.push(routeConstant.LINUX_NETWORK, data);
          } else {
            history.push(routeConstant.TARGET, data);
          }
        }
      } catch {
        let data = {
          editData: true,
          LinuxNetwork:
            props.location.state && props.location.state.LinuxNetwork
              ? props.location.state.LinuxNetwork
              : true,
          windowsNetwork:
            props.location.state && props.location.state.windowsNetwork
              ? props.location.state.windowsNetwork
              : false,
          clientInfo: props.location.state.clientInfo,
          targetInfo: props.location.state.targetInfo,
          editLinuxData: props.location.state.editLinuxData
            ? props.location.state.editLinuxData
            : false,
          editWindowsData: props.location.state.editWindowsData
            ? props.location.state.editWindowsData
            : false,
        };
        if (LinuxTargetName) {
          history.push(routeConstant.LINUX_NETWORK, data);
        } else {
          history.push(routeConstant.TARGET, data);
        }
      }
    } else {
      logout();
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
  const handleInputErrors = () => {
    let error = true;
    if (userName === "" || userName === null) {
      error = false;
      // let isErrVpnUserName = userName.length <= 0 ? "Required" : "";
      setIsError((isError: any) => ({
        ...isError,
        userName:  "Required",
      }));
    }
    if (ipAddress === "" || ipAddress  === null) {
      error = false;
      // let isErrName = ipAddress.length <= 0 ? "Required" : "";
      setIsError((error: any) => ({
        ...error,
        ipRange:  "Required",
      }));
    }
    if (domainName === "" || domainName === null) {
      error = false;
      // let isErrName = domainName.length <= 0 ? "Required" : "";
      setIsError((error: any) => ({
        ...error,
        domainName: "Required",
      }));
    }
    if (password === "" ||password === null) {
      error = false;
      // let isErrName = ipAddress.length <= 0 ? "Required" : "";
      setIsError((isError: any) => ({
        ...isError,
        password: "Required",
      }));
    }
    
    return error;
  };
  const handleToolTipClose = () => {
    setOpen(false);
  };
  
  const handleToolTipOpen = () => {
    setOpen(true);
  };

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

  const handleCancel = () => {
    if(Cookies.getJSON('ob_session'))  {
      deleteTarget({
        variables: {
          id: Number(targetId)
        },
      }).then((res: any) => { 
      let data = {};
      data = { refetchData: true, clientInfo: clientInfo };
      history.push(routeConstant.RA_REPORT_LISTING, data);
      localStorage.removeItem("name");
      localStorage.removeItem("targetId");
      localStorage.removeItem("ipRange");
      localStorage.removeItem("ipAddress");
      localStorage.removeItem('re-runTargetName');
      localStorage.removeItem("userName");
      localStorage.removeItem("password");
      localStorage.removeItem("vpnUserName");
      localStorage.removeItem("vpnPassword");
      localStorage.removeItem("vpnFilePath");
      localStorage.removeItem("WinTargetName");
      localStorage.removeItem("LinuxTargetName");
    })
    .catch((err) => {
      let data = {};
      data = { refetchData: true, clientInfo: clientInfo };
      history.push(routeConstant.RA_REPORT_LISTING, data);
      localStorage.removeItem("name");
      localStorage.removeItem("targetId");
      localStorage.removeItem("ipRange");
      localStorage.removeItem("ipAddress");
      localStorage.removeItem('re-runTargetName');
      localStorage.removeItem("userName");
      localStorage.removeItem("password");
      localStorage.removeItem("vpnUserName");
      localStorage.removeItem("vpnPassword");
      localStorage.removeItem("vpnFilePath");
      localStorage.removeItem("WinTargetName");
      localStorage.removeItem("LinuxTargetName");
    });
    }
    else {
      logout();
    }
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
              Password *
            </InputLabel>
            <OutlinedInput
              classes={{
                root: styles.InputField,
                notchedOutline: styles.InputField,
                focused: styles.InputField,
              }}
              type={showPassword ? "text" : "password"}
              label="Password *"
              value={password}
              onChange={handlePasswordChange}
              required
              error={isError.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    className={styles.PassField}
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
                Required
              </FormHelperText>
            ) : null}
          </FormControl>

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
    
        <Grid item xs={12} md={6}>
        <span className={styles.IPTooltip}>
        {/* <MuiThemeProvider theme={theme}> */}
        <Tooltip open={open} onClose={handleToolTipClose} onOpen={handleToolTipOpen} placement="bottom-end" title= { <React.Fragment>
            <p><b>Please enter data in the below formats</b> </p>
            <b>{'Single IP Address'}</b><em>{"(e.g. 192.168.x.xx)"}</em> <p><b>{' Multiple IP Address'}</b> {'(e.g. 192.168.x.x,192.168.x.x)'}</p>{' '}
          </React.Fragment>}>
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
          </Tooltip>
          {/* </MuiThemeProvider> */}
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
          {props.location.state != undefined && !props.location.state.editWindowsData ?
          <Button
            className={styles.borderLess}
            variant={"contained"}
            onClick={handleSkip}
            color="primary"
            data-testid="cancel-button"
          >
            skip
          </Button>
          :null }
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
          <Button
            className={styles.borderLess}
            variant={"contained"}
            onClick={handleCancel}
            color="primary"
            data-testid="cancel-button"
          >
            cancel
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
export default Windows_Network;
