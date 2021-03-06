import React, { useState, useEffect } from "react";
import styles from "./Target.module.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Button } from "../../../components/UI/Form/Button/Button";
import { AddEditForm } from "../../../components/UI/AddEditForm/AddEditForm";
import Input from "../../../components/UI/Form/Input/Input";
import {
  GET_TARGET,
  GET_AVAILABLE_SERVER,
} from "../../../graphql/queries/Target";
import { GET_TASK_DETAILS } from "../../../graphql/queries/TaskDetails";
import {
  CREATE_TARGET,
  UPDATE_TARGET,
  CREATE_TARGET_RERUN,
  DELETE_TARGET,
} from "../../../graphql/mutations/Target";
import AlertBox from "../../../components/UI/AlertBox/AlertBox";
import Loading from "../../../components/UI/Layout/Loading/Loading";
import SimpleBackdrop from "../../../components/UI/Layout/Backdrop/Backdrop";
import MaterialTable from "../../../components/UI/Table/MaterialTable";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import Alert from "../../../components/UI/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../common/MessageConstants";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Grid } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import AutoCompleteDropDown from "../../../components/UI/Form/Autocomplete/Autocomplete";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { FormHelperText, makeStyles, createStyles } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import RaStepper from "../component/RaStepper/RaStepper";
import { useHistory } from "react-router-dom";
import { setRaStepper } from "../common/SetRaStepper";
import * as routeConstant from "../../../common/RouteConstants";
import * as msgConstant from "../../../common/MessageConstants";
import { useApolloClient } from "@apollo/client";
import stepper from "../common/raStepperList.json";
import { UPLOAD_VPN_FILE } from "../../../graphql/mutations/Upload";
import { RA_TARGET_VPNTEST } from "../../../config/index";
import { TEST_CONNECTION } from "../../../graphql/mutations/VPNConnection";
import { TEST_LINUX_CONNECTION } from "../../../graphql/mutations/VPNConnection";
import CancelIcon from "@material-ui/icons/Cancel";
import rerunstepper from "../common/raRerunStepperList.json";
import Tooltip from "@material-ui/core/Tooltip";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import { setActiveFormStep } from "../../../services/Data";
import Cookies from "js-cookie";
import logout from "../../Auth/Logout/Logout";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import {
  DOMAIN_VERIFY,
  IP_VERIFY,
} from "../../../graphql/mutations/DomainVerify";
import { OB_URI } from "../../../config/index";

// import { customClient } from "../../../../config/customClient";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/link-context";

export const Target: React.FC = (props: any) => {
  const history = useHistory();
  const client = useApolloClient();
  const [dialogBoxMsg, setDialogBoxMsg] = useState("");
  const [showbackdrop, setShowbackdrop] = useState(true);
  // const sessionData = useQuery(RA_TARGET_SESSION);
  const targetId = localStorage.getItem("targetId")
    ? JSON.parse(localStorage.getItem("targetId") || "")
    : null;
  const [showDialogBox, setShowDialogBox] = useState<boolean>(false);
  //add/edit data
  const [name, setName] = useState<String>("");
  const [ipRange, setIpRange] = useState<any>("");
  const [userName, setUserName] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [linuxDomain, setLinuxDomain] = useState(false);
  const [vpnUserName, setVpnUserName] = useState<String>("");
  const [vpnPassword, setVpnPassword] = useState<String>("");
  const [linuxUsername, setLinuxUsername] = useState<String>("");
  const [linuxIpAddress, setLinuxIpAddress] = useState<String>("");
  const [clientID, setClientID] = useState<String>("");
  const [winName, SetWinName] = useState<String>("");
  const [winUsername, setWinUsername] = useState<String>("");
  const [targetOldId, setTargetOldId] = useState<String>("");
  const [vpnFilePath, setVpnFilePath] = useState<any>("");
  const [displayVpnFilePath, setDisplayVpnFilePath] = useState<any>("");
  const [winIpAddress, setWinIpAddress] = useState<String>("");
  const [scanConfigList, setScanConfigList] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const localVpnFilePath = JSON.parse(
    localStorage.getItem("vpnFilePath") || "{}"
  );
  const ReRunTargetName = JSON.parse(
    localStorage.getItem("re-runTargetName") || "{}"
  );
  const [fileEvent, setFileEvent] = useState<any>();
  const [open, setOpen] = React.useState(false);
  const [uploadToolOpen, setUploadToolOpen] = React.useState(false);
  const session = Cookies.getJSON("ob_session");
  const obUser = Cookies.getJSON("ob_user");
  const [param, setParam] = useState<any>({});
  const [connectionSuccess, SetConnectionSuccess] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  //static values for partner and client are given.
  const clientInfo = props.location.state
    ? props.location.state.clientInfo
    : undefined;
  const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");
  const partnerId = partner.partnerId;
  const clientId = clientInfo ? parseInt(clientInfo.clientId) : undefined;
  const targetName = props["location"].state
    ? props["location"].state.targetName
      ? props["location"].state.targetName
      : null
    : null;
  const [editDataId, setEditDataId] = useState<Number | null>();
  if (props.location.state) {
    if (editDataId === null && props.location.state.editData === true) {
      setEditDataId(JSON.parse(localStorage.getItem("targetId") || "{}"));
    }
  }
  //show password
  const [showPassword, setShowPassword] = useState(false);
  const [showVpnPassword, setShowVpnPassword] = useState(false);
  const startDate = new Date();
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [targetOpen, setTargetOpen] = React.useState(false);
  const customClientUrl = localStorage.getItem("customClientUrl") || "";
  //validation and error handelling
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

  //queries

  const [testVpnConnection] = useMutation(TEST_CONNECTION);
  const [testLinuxConnection] = useMutation(TEST_LINUX_CONNECTION);

  const [domainVerify] = useMutation(DOMAIN_VERIFY);
  const [IPVerify] = useMutation(IP_VERIFY);

  // Set props data as Param
  useEffect(() => {
    if (props?.location.state) {
      setParam(props.location.state);
    }
  }, []);

  // const accessToken = session ? session : null;
  // const authLink = setContext((_, { headers }) => {
  //   return {
  //     headers: {
  //       ...headers,
  //       Authorization: accessToken ? "jwt" + " " + accessToken : null,
  //     },
  //   };
  // });
  // let link: any;
  // let httpLink: any;
  // httpLink = createHttpLink({
  //   uri: OB_URI ? OB_URI + "/graphql/" : customClientUrl + "/graphql/",
  // });
  // const [
  //   getAvailableServer,
  //   {
  //     data: availableServer,
  //     loading: availableServerLoading,
  //     error: availableServerError,
  //     // refetch: refetchDataAvailableServer,
  //   },
  // ] = useLazyQuery(GET_AVAILABLE_SERVER, {
  //   onCompleted: (data: any) => {
  //     console.log("data", data.getAvailableServer[0].url);
  //     if (availableServer) {
  //       setOB_URI(data?.getAvailableServer[0].url);
  //       localStorage.setItem("customClientUrl", data.getAvailableServer[0].url);
  //     }
  //     // if (data?.getAvailableServer[0].url) {
  //     //   localStorage.setItem("customClientUrl", data.getAvailableServer[0].url);
  //     // }
  //     // if (availableServer) {
  //     //   setTimeout(() => {
  //     //     handleSubmitDialogBox();
  //     //   }, 1000);
  //     // }
  //   },
  //   fetchPolicy: "network-only",
  // });
  // link = accessToken ? authLink.concat(httpLink) : httpLink;

  // const customClient: any = new ApolloClient({
  //   link: link,
  //   cache: new InMemoryCache(),
  // });
  // useEffect(() => {
  //   if (availableServer && OB_URI !== "") {
  //     submitAction();
  //   }
  // }, [OB_URI]);

  const [updateTarget] = useMutation(UPDATE_TARGET);
  const [deleteTarget] = useMutation(DELETE_TARGET);

  const [uploadFile] = useMutation(UPLOAD_VPN_FILE);

  const [createTarget] = useMutation(CREATE_TARGET);
  const [createReRunTarget] = useMutation(CREATE_TARGET_RERUN);
  const [
    getTargetData,
    { data: targetData, loading: targetLoading, error: targetError },
  ] = useLazyQuery(GET_TARGET, {
    onCompleted: (data: any) => {
      setActiveFormStep(0);
      if (targetData && data.getCredentialsDetails.edges[0]) {
        setIpRange(data.getCredentialsDetails.edges[0].node.vatTarget.host);
        //   setUserName(
        //     data.getTarget.edges[0].node.vatCredentials
        //       ? data.getTarget.edges[0].node.vatCredentials.domainUsername
        //       : null
        //   );
        // setPassword(
        //   data.getCredentialsDetails.edges[0].node
        //     ? data.getCredentialsDetails.edges[0].node.domainPassword
        //     : null
        // );

        setVpnUserName(
          data.getCredentialsDetails.edges[0].node
            ? data.getCredentialsDetails.edges[0].node.vpnUsername
            : null
        );
        setLinuxUsername(
          data.getCredentialsDetails.edges[0].node &&
            data.getCredentialsDetails.edges[0].node.domainUsername
            ? data.getCredentialsDetails.edges[0].node.domainUsername
            : null
        );
        setLinuxIpAddress(
          data.getCredentialsDetails.edges[0].node &&
            data.getCredentialsDetails.edges[0].node.linuxIpAddress
            ? data.getCredentialsDetails.edges[0].node.linuxIpAddress
            : null
        );
        SetWinName(
          data.getCredentialsDetails.edges[0].node &&
            data.getCredentialsDetails.edges[0].node.winName
            ? data.getCredentialsDetails.edges[0].node.winName
            : null
        );
        setWinUsername(
          data.getCredentialsDetails.edges[0].node &&
            data.getCredentialsDetails.edges[0].node.winUsername
            ? data.getCredentialsDetails.edges[0].node.winUsername
            : null
        );
        setWinIpAddress(
          data.getCredentialsDetails.edges[0].node
            ? data.getCredentialsDetails.edges[0].node.winIpAddress
            : null
        );
        setClientID(
          data.getCredentialsDetails.edges[0].node
            ? data.getCredentialsDetails.edges[0].node.client.id
            : null
        );
        setTargetOldId(
          data.getCredentialsDetails.edges[0].node
            ? data.getCredentialsDetails.edges[0].node.vatTarget.id
            : null
        );
        if (
          data.getCredentialsDetails.edges[0].node &&
          data.getCredentialsDetails.edges[0].node.vatTarget.vpnFilePath
        )
          console.log(
            "data.getCredentialsDetails.edges[0].node.vatTarget.vpnFilePath",
            data.getCredentialsDetails.edges[0].node.vatTarget.vpnFilePath
          );
        setVpnFilePath(
          data.getCredentialsDetails.edges[0].node
            ? data.getCredentialsDetails.edges[0].node.vatTarget.vpnFilePath
            : null
        );
        setDisplayVpnFilePath(
          data.getCredentialsDetails.edges[0].node
            ? data.getCredentialsDetails.edges[0].node.vatTarget.vpnFilePath.split(
                "/"
              )[9]
            : null
        );
      }
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
  const [getTaskData, { data: taskData, loading: taskLoading }] = useLazyQuery(
    GET_TASK_DETAILS,
    {
      onCompleted: (data: any) => {
        if (data.getTask.edges) {
          setScanConfigList(data.getTask.edges[0].node.vatScanConfigList);
        }
      },
      fetchPolicy: "cache-and-network",
    }
  );
  const handleToolTipClose = () => {
    setOpen(false);
  };

  const handleToolTipOpen = () => {
    setOpen(true);
  };
  const handleUploadToolTipClose = () => {
    setUploadToolOpen(false);
  };

  const handleUploadToolTipOpen = () => {
    setUploadToolOpen(true);
  };

  const checkValidation = () => {
    if (
      isError.name !== "" ||
      isError.ipRange !== "" ||
      isError.userName !== "" ||
      isError.password !== "" ||
      isError.vpnUserName !== "" ||
      isError.vpnPassword !== "" ||
      !name ||
      !ipRange ||
      !userName ||
      !password ||
      !vpnUserName ||
      !vpnPassword
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

  useEffect(() => {
    console.log("Target props", props);
    if (Cookies.getJSON("ob_session")) {
      if (targetName !== null) {
        getTargetData({
          variables: {
            targetName: targetName,
          },
        });
      }
      if (
        props.location.state != undefined &&
        props.location.state.editData &&
        props.location.state.editData === true
      ) {
        console.log("props.location.state", props.location.state);
        setSubmitDisabled(false);
        setFileUploaded(true);
        setFormState((formState) => ({
          ...formState,
          isSuccess: true,
          isUpdate: false,
          isDelete: false,
          isFailed: false,
          errMessage: "Connection has been validated",
        }));

        setVpnFilePath(
          localVpnFilePath || vpnFilePath
            ? localVpnFilePath.replace(/\"/g, "")
            : null
        );
        setDisplayVpnFilePath(
          localVpnFilePath || vpnFilePath
            ? localVpnFilePath.split("/")[9].replace(/\"/g, "")
            : null
        );
      }
    } else {
      logout();
    }
  }, []);

  if (targetId && editDataId === undefined) {
    if (targetId.length > 0) {
      setEditDataId(JSON.parse(localStorage.getItem("targetId") || "{}"));
      setName(JSON.parse(localStorage.getItem("name") || "{}"));
      setIpRange(JSON.parse(localStorage.getItem("ipRange") || "{}"));
      setUserName(JSON.parse(localStorage.getItem("userName") || "{}"));
      setVpnUserName(JSON.parse(localStorage.getItem("vpnUserName") || "{}"));
      setVpnPassword(JSON.parse(localStorage.getItem("vpnPassword") || "{}"));
    }
  }

  useEffect(() => {
    try {
      if (
        props.location.state.reRun &&
        props.location.state.targetName.includes("_windows")
      ) {
        setRaStepper(
          client,
          rerunstepper.Target.name,
          rerunstepper.Target.value,
          props.location.state
        );
      } else if (
        ReRunTargetName != {} &&
        ReRunTargetName.includes("_windows")
      ) {
        let data = {
          LinuxNetwork:
            props.location.state && props.location.state.LinuxNetwork
              ? props.location.state.LinuxNetwork
              : false,
          windowsNetwork:
            props.location.state && props.location.state.windowsNetwork
              ? props.location.state.windowsNetwork
              : true,
          editData:
            props.location.state && props.location.state.editData
              ? props.location.state.editData
              : false,
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
      } else {
        setActiveFormStep(0);
        setRaStepper(
          client,
          stepper.Target.name,
          stepper.Target.value,
          props.location.state
        );
      }
    } catch {
      if (
        props.location.state.reRun &&
        props.location.state.targetName.includes("_windows")
      ) {
        setRaStepper(
          client,
          rerunstepper.Target.name,
          rerunstepper.Target.value,
          props.location.state
        );
      } else {
        setActiveFormStep(0);
        setRaStepper(
          client,
          stepper.Target.name,
          stepper.Target.value,
          props.location.state
        );
      }
    }
  }, []);
  console.log("props.location.state", props.location.state);
  if (targetError) {
    return <div className="error">Error!</div>;
  }

  const handleSubmitDialogBox = () => {
    handleAlertClose();
    if (!Cookies.getJSON("ob_session")) {
      logout();
    }
    if (editDataId) {
      setSubmitDisabled(true);
      setBackdrop(true);
      let input = {
        partner: partnerId.id,
        client: clientId,
        targetName: name,
        host: ipRange,
        vpnUsername: vpnUserName,
        vpnPassword: vpnPassword,
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
            errMessage: "Target Updated Successfully !",
          }));
          setBackdrop(false);
          setSubmitDisabled(false);
          setUploadDisabled(true);
          setFileUploaded(false);
          setEditDataId(null);
          let substring = "_linux";
          let substring2 = "_windows";
          let NormalTargetName =
            userRes.data.updateTarget.targetField.targetName;
          let TargetNames = "";
          if (NormalTargetName.includes(substring)) {
            TargetNames = NormalTargetName.replace(substring, "");
          } else if (NormalTargetName.includes(substring2)) {
            TargetNames = NormalTargetName.replace(substring2, "");
          } else {
            TargetNames = userRes.data.updateTarget.targetField.targetName;
          }
          localStorage.setItem("name", JSON.stringify(TargetNames));
          localStorage.setItem(
            "targetId",
            JSON.stringify(userRes.data.updateTarget.targetField.id)
          );
          localStorage.setItem("ipRange", JSON.stringify(ipRange));
          localStorage.setItem("vpnUserName", JSON.stringify(vpnUserName));
          localStorage.setItem("vpnPassword", JSON.stringify(vpnPassword));
          localStorage.setItem("vpnPassword", JSON.stringify(vpnPassword));
          localStorage.setItem("vpnPassword", JSON.stringify(vpnPassword));
          localStorage.setItem("vpnPassword", JSON.stringify(vpnPassword));
          localStorage.setItem("vpnPassword", JSON.stringify(vpnPassword));
          localStorage.setItem("vpnPassword", JSON.stringify(vpnPassword));
          try {
            // Rerun Of Windows Navigate
            if (ReRunTargetName != {} && ReRunTargetName.includes("_windows")) {
              console.log("RErun of Windows");
              data = {
                LinuxNetwork:
                  props.location.state && props.location.state.LinuxNetwork
                    ? props.location.state.LinuxNetwork
                    : true,
                windowsNetwork:
                  props.location.state && props.location.state.windowsNetwork
                    ? props.location.state.windowsNetwork
                    : false,
                editData:
                  props.location.state && props.location.state.editData
                    ? props.location.state.editData
                    : false,
                clientInfo:
                  props.location.state && props.location.state.clientInfo,
                targetInfo: targetInfo,
                editLinuxData: props.location.state.editLinuxData
                  ? props.location.state.editLinuxData
                  : false,
                editWindowsData: props.location.state.editWindowsData
                  ? props.location.state.editWindowsData
                  : false,
              };
              history.push(routeConstant.WINDOWS_NETWORK, data);
            }
            // Rerun Of Linux Navigate
            // if (ReRunTargetName != {} ||  ReRunTargetName.includes("_linux") ) {
            else {
              console.log("Rerun of Linux");
              data = {
                LinuxNetwork:
                  props.location.state && props.location.state.LinuxNetwork
                    ? props.location.state.LinuxNetwork
                    : true,
                windowsNetwork:
                  props.location.state && props.location.state.windowsNetwork
                    ? props.location.state.windowsNetwork
                    : false,
                editData:
                  props.location.state && props.location.state.editData
                    ? props.location.state.editData
                    : false,
                clientInfo:
                  props.location.state && props.location.state.clientInfo,
                targetInfo: targetInfo,
                editLinuxData: props.location.state.editLinuxData
                  ? props.location.state.editLinuxData
                  : false,
                editWindowsData: props.location.state.editWindowsData
                  ? props.location.state.editWindowsData
                  : false,
              };
              history.push(routeConstant.LINUX_NETWORK, data);
            }
          } catch {
            setShowDialogBox(false);
            setLinuxDomain(true);
            setShowDialogBox(true);
            setBackdrop(false);
            setDialogBoxMsg(msgConstant.LINUX_NETWORK_CREDENTIALS);
          }
        })
        .catch((err) => {
          setShowDialogBox(false);
          setSubmitDisabled(true);
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
      setSubmitDisabled(true);
      setBackdrop(true);
      if (
        partnerId &&
        clientId &&
        name &&
        ipRange &&
        vpnUserName &&
        props.location.state &&
        props.location.state.reRun == true
      ) {
        if (linuxUsername != null || winIpAddress != null) {
          let input = {
            partner: partnerId.id,
            client: clientId,
            targetName: name,
            host:
              ipRange != null
                ? ipRange
                : JSON.parse(localStorage.getItem("ipRange") || "{}"),
            vpnUsername:
              vpnUserName != null
                ? vpnUserName
                : JSON.parse(localStorage.getItem("vpnUserName") || "{}"),
            vpnPassword: vpnPassword ? vpnPassword : null,
            linuxUsername: linuxUsername ? linuxUsername : null,
            linuxIpAddress: linuxIpAddress ? linuxIpAddress : null,
            startDate: startDate,
            targetOldId: targetOldId,
            winName: winName ? winName : null,
            winIpAddress: winIpAddress ? winIpAddress : null,
            winUsername: winUsername ? winUsername : null,
          };

          createReRunTarget({
            variables: {
              input,
            },
          })
            .then((userRes) => {
              setSubmitDisabled(false);
              setBackdrop(false);
              setFormState((formState) => ({
                ...formState,
                isSuccess: true,
                isUpdate: false,
                isDelete: false,
                isFailed: false,
                errMessage: "Scan Created Successfully ",
              }));
              localStorage.setItem("name", JSON.stringify(name));
              localStorage.setItem(
                "targetId",
                JSON.stringify(userRes.data.createTargetRerun.targetField.id)
              );
              localStorage.setItem(
                "vpnFilePath",
                JSON.stringify(
                  userRes.data.createTargetRerun.targetField.vpnFilePath
                )
              );
              if (props.location.state && props.location.state.reRun == true) {
                localStorage.setItem(
                  "re-runTargetName",
                  JSON.stringify(props.location.state.targetName)
                );
              }
              localStorage.setItem("ipRange", JSON.stringify(ipRange));
              localStorage.setItem("vpnUserName", JSON.stringify(vpnUserName));
              localStorage.setItem("vpnPassword", JSON.stringify(vpnPassword));
              setShowDialogBox(false);
              setBackdrop(false);
              let data = {};
              let targetInfo = {
                targetName: name,
                host: ipRange,
                userName: userName,
                password: password,
              };
              // Rerun Of Windows Navigate
              if (winIpAddress != null) {
                console.log("RErun of Windows");
                data = {
                  LinuxNetwork:
                    props.location.state && props.location.state.LinuxNetwork
                      ? props.location.state.LinuxNetwork
                      : true,
                  windowsNetwork:
                    props.location.state && props.location.state.windowsNetwork
                      ? props.location.state.windowsNetwork
                      : false,
                  editData:
                    props.location.state && props.location.state.editData
                      ? props.location.state.editData
                      : false,
                  clientInfo:
                    props.location.state && props.location.state.clientInfo,
                  targetInfo: targetInfo,
                  editLinuxData: props.location.state.editLinuxData
                    ? props.location.state.editLinuxData
                    : false,
                  editWindowsData: props.location.state.editWindowsData
                    ? props.location.state.editWindowsData
                    : false,
                };
                history.push(routeConstant.WINDOWS_NETWORK, data);
              }
              // Rerun Of Linux Navigate
              if (linuxUsername != null) {
                console.log("Rerun of Linux");
                data = {
                  LinuxNetwork:
                    props.location.state && props.location.state.LinuxNetwork
                      ? props.location.state.LinuxNetwork
                      : true,
                  windowsNetwork:
                    props.location.state && props.location.state.windowsNetwork
                      ? props.location.state.windowsNetwork
                      : false,
                  editData:
                    props.location.state && props.location.state.editData
                      ? props.location.state.editData
                      : false,
                  clientInfo:
                    props.location.state && props.location.state.clientInfo,
                  targetInfo: targetInfo,
                  editLinuxData: props.location.state.editLinuxData
                    ? props.location.state.editLinuxData
                    : false,
                  editWindowsData: props.location.state.editWindowsData
                    ? props.location.state.editWindowsData
                    : false,
                };
                history.push(routeConstant.LINUX_NETWORK, data);
              }
              // setTimeout(() => {
              //   setLinuxDomain(true);
              //   setShowDialogBox(true);
              //   setDialogBoxMsg(msgConstant.LINUX_NETWORK_CREDENTIALS);
              // }, 1000);
            })
            .catch((err) => {
              setShowDialogBox(false);
              setSubmitDisabled(true);
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
        }
      } else {
        if (partnerId && clientId && name && ipRange && vpnUserName) {
          setBackdrop(true);
          let input = {
            partner: partnerId.id,
            client: clientId,
            targetName: name,
            host: ipRange,
            vpnUsername: vpnUserName,
            vpnPassword: vpnPassword,
            startDate: startDate,
            scanType: "Advanced",
          };
          createTarget({
            variables: {
              input,
            },
          })
            .then((userRes) => {
              setBackdrop(false);
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
                setSubmitDisabled(false);
                setFormState((formState) => ({
                  ...formState,
                  isSuccess: true,
                  isUpdate: false,
                  isDelete: false,
                  isFailed: false,
                  errMessage: "Scan Created Successfully ",
                }));
                // setRaStepper(client,stepper.ScanConfiguration.name,stepper.ScanConfiguration.value, props.location.state);
                localStorage.setItem("name", JSON.stringify(name));
                localStorage.setItem(
                  "targetId",
                  JSON.stringify(userRes.data.createTarget.targetField.id)
                );
                localStorage.setItem(
                  "vpnFilePath",
                  JSON.stringify(
                    userRes.data.createTarget.targetField.vpnFilePath
                  )
                );
                if (
                  props.location.state &&
                  props.location.state.reRun == true
                ) {
                  localStorage.setItem(
                    "re-runTargetName",
                    JSON.stringify(props.location.state.targetName)
                  );
                }
                localStorage.setItem("ipRange", JSON.stringify(ipRange));
                localStorage.setItem(
                  "vpnUserName",
                  JSON.stringify(vpnUserName)
                );
                localStorage.setItem(
                  "vpnPassword",
                  JSON.stringify(vpnPassword)
                );
                setShowDialogBox(false);
                let data = {};
                let targetInfo = {
                  targetName: name,
                  host: ipRange,
                  userName: userName,
                  password: password,
                };
                setTimeout(() => {
                  setLinuxDomain(true);
                  setShowDialogBox(true);
                  setDialogBoxMsg(msgConstant.LINUX_NETWORK_CREDENTIALS);
                }, 1000);
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
              setSubmitDisabled(false);
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
        }
      }
    }
  };

  const onChangeHandler = (event: any, removeCase: any) => {
    if (event && event.target !== undefined) {
      setSelectedFile(event.target.files[0]);
      setFileEvent(event);
      if (event.target.files[0]) {
        setUploadDisabled(false);
      } else {
        setUploadDisabled(true);
      }
    }
    if (event && removeCase === "remove") {
      event.target.value = null;
      setSelectedFile(null);
    }
  };

  const getBase64 = (file: any, cb: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const onClickHandler2 = () => {
    if (Cookies.getJSON("ob_session")) {
      // if (name && vpnUserName && ipRange) {
      if (handleInputErrors()) {
        if (/[^a-zA-Z0-9\- \/]/.test(name.toString())) {
          setBackdrop(false);
        } else {
          // Check Domain Connectipn
          let input = {
            host: ipRange,
            scanType: "Advanced",
          };
          if (parseInt(ipRange)) {
            IPVerify({
              variables: {
                input,
              },
            })
              .then((userRes) => {
                if (userRes.data.IPVerify.status === "Valid IP address") {
                  submitAction();
                } else {
                  setBackdrop(false);
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
          } else {
            domainVerify({
              variables: {
                input,
              },
            })
              .then((userRes) => {
                if (
                  userRes.data.domainVerify.status ===
                  "Domain name is registered"
                ) {
                  // getAvailableServer();
                  submitAction();
                } else {
                  setBackdrop(false);
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
              .catch((err) => {
                console.log("doMAIN api FAILED");
                setUploadDisabled(true);
                setFileUploaded(false);
                setBackdrop(false);
                setSelectedFile(null);
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
        }
      } else {
        if (!handleInputErrors()) {
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: false,
            isFailed: true,
            errMessage: " Please fill in the required fields",
          }));
        }
      }
    } else {
      logout();
    }
  };
  const submitAction = () => {
    handleAlertClose();
    setBackdrop(true);
    if (selectedFile && selectedFile.name != null) {
      let idCardBase64 = "";
      getBase64(selectedFile, (result: any) => {
        idCardBase64 = result;
        var res = result.slice(result.indexOf(",") + 1);
        if (targetData !== undefined) {
          if (props.location.state && props.location.state.reRun === true) {
            if (
              selectedFile.name.substring(
                selectedFile.name.lastIndexOf(".") + 1,
                selectedFile.name.length
              ) === "ovpn" ||
              selectedFile.name.substring(
                selectedFile.name.lastIndexOf(".") + 1,
                selectedFile.name.length
              ) === "tgz"
            ) {
              uploadFile({
                variables: {
                  input: {
                    client: props.location.state.clientInfo.clientId,
                    targetName: name,
                    file: res,
                    vpnUsername: vpnUserName,
                    vpnPassword: vpnPassword,
                    type: selectedFile.name.substring(
                      selectedFile.name.lastIndexOf(".") + 1,
                      selectedFile.name.length
                    ),
                    targetId:
                      targetData.getCredentialsDetails.edges[0].node.vatTarget
                        .id,
                  },
                },
              })
                .then((response: any) => {
                  setBackdrop(false);
                  // setSelectedFile(null);
                  if (
                    response.data.uploadFile.success == "File Uploaded Failed"
                  ) {
                    setFileUploaded(false);
                    // setSubmitDisabled(true)
                    setFormState((formState) => ({
                      ...formState,
                      isSuccess: false,
                      isUpdate: false,
                      isDelete: false,
                      isFailed: true,
                      errMessage: " File Upload Failed.",
                    }));
                  } else {
                    setFileUploaded(true);
                    // setSubmitDisabled(false)
                    // setFormState((formState) => ({
                    //   ...formState,
                    //   isSuccess: true,
                    //   isUpdate: false,
                    //   isDelete: false,
                    //   isFailed: false,
                    //   errMessage: "File Uploaded Successfully !!",
                    // }));
                    onClickTestConnection();
                  }
                })
                .catch((error: Error) => {
                  setUploadDisabled(true);
                  setFileUploaded(false);
                  setBackdrop(false);
                  setSelectedFile(null);
                  setFormState((formState) => ({
                    ...formState,
                    isSuccess: false,
                    isUpdate: false,
                    isDelete: false,
                    isFailed: true,
                    errMessage: " ",
                  }));
                });
            } else {
              setFileUploaded(false);
              setBackdrop(false);
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage: " Upload a file in the proper format.",
              }));
            }
          }
        } else {
          if (
            selectedFile.name.substring(
              selectedFile.name.lastIndexOf(".") + 1,
              selectedFile.name.length
            ) === "ovpn" ||
            selectedFile.name.substring(
              selectedFile.name.lastIndexOf(".") + 1,
              selectedFile.name.length
            ) === "tgz"
          ) {
            uploadFile({
              variables: {
                input: {
                  client: props.location.state.clientInfo.clientId,
                  targetName: name,
                  file: res,
                  vpnUsername: vpnUserName,
                  vpnPassword: vpnPassword,
                  type: selectedFile.name.substring(
                    selectedFile.name.lastIndexOf(".") + 1,
                    selectedFile.name.length
                  ),
                },
              },
            })
              .then((response: any) => {
                setBackdrop(false);
                // setSelectedFile(null);
                if (
                  response.data.uploadFile.success == "File Uploaded Failed"
                ) {
                  // setSubmitDisabled(true)
                  setFileUploaded(false);
                  setFormState((formState) => ({
                    ...formState,
                    isSuccess: false,
                    isUpdate: false,
                    isDelete: false,
                    isFailed: true,
                    errMessage: " File Upload Failed.",
                  }));
                } else {
                  setFileUploaded(true);
                  // setSubmitDisabled(false)
                  // setFormState((formState) => ({
                  //   ...formState,
                  //   isSuccess: true,
                  //   isUpdate: false,
                  //   isDelete: false,
                  //   isFailed: false,
                  //   errMessage: "File Uploaded Successfully !!",
                  // }));
                  onClickTestConnection();
                }
              })
              .catch((error: Error) => {
                setUploadDisabled(true);
                setFileUploaded(false);
                setBackdrop(false);
                setSelectedFile(null);
                setFormState((formState) => ({
                  ...formState,
                  isSuccess: false,
                  isUpdate: false,
                  isDelete: false,
                  isFailed: true,
                  errMessage: " ",
                }));
              });
          } else {
            setFileUploaded(false);
            setBackdrop(false);
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: " Upload a file in the proper format.",
            }));
          }
        }
      });
    } else {
      setBackdrop(false);
      setSelectedFile(null);
      if (vpnFilePath) {
        uploadFile({
          variables: {
            input: {
              client: props.location.state.clientInfo.clientId,
              targetName: name,
              // file: res,
              vpnUsername: vpnUserName,
              vpnPassword: vpnPassword,
              // type: selectedFile.name.split(".")[1],
              targetId:
                targetData != undefined
                  ? targetData.getCredentialsDetails.edges[0].node.vatTarget.id
                  : targetId,
              filePath: vpnFilePath,
            },
          },
        })
          .then((response: any) => {
            setBackdrop(false);
            // setSelectedFile(null);
            if (response.data.uploadFile.success == "File Uploaded Failed") {
              setFileUploaded(false);
              // setSubmitDisabled(true)
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage: " File Upload Failed.",
              }));
            } else {
              setFileUploaded(true);
              // setSubmitDisabled(false)
              // setFormState((formState) => ({
              //   ...formState,
              //   isSuccess: true,
              //   isUpdate: false,
              //   isDelete: false,
              //   isFailed: false,
              //   errMessage: "File Uploaded Successfully !!",
              // }));
              onClickTestConnection();
            }
          })
          .catch((error: Error) => {
            setUploadDisabled(true);
            setFileUploaded(false);
            setBackdrop(false);
            setSelectedFile(null);
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: " ",
            }));
          });
      } else {
        setFormState((formState) => ({
          ...formState,
          isSuccess: false,
          isUpdate: false,
          isDelete: false,
          isFailed: true,
          errMessage: " Please select the file to upload",
        }));
      }
    }
  };
  const onClickHandler = (event: any) => {
    if (name && vpnUserName && !uploadDisabled) {
      setBackdrop(true);
      if (selectedFile && selectedFile.name != null) {
        let idCardBase64 = "";
        getBase64(selectedFile, (result: any) => {
          idCardBase64 = result;
          var res = result.slice(result.indexOf(",") + 1);
          if (targetData !== undefined) {
            if (props.location.state && props.location.state.reRun === true) {
              uploadFile({
                variables: {
                  input: {
                    client: props.location.state.clientInfo.clientId,
                    targetName: name,
                    file: res,
                    vpnUsername: vpnUserName,
                    vpnPassword: vpnPassword,
                    type: selectedFile.name.substring(
                      selectedFile.name.lastIndexOf(".") + 1,
                      selectedFile.name.length
                    ),
                    targetId:
                      targetData.getCredentialsDetails.edges[0].node.vatTarget
                        .id,
                  },
                },
              })
                .then((response: any) => {
                  setBackdrop(false);
                  // setSelectedFile(null);
                  if (
                    response.data.uploadFile.success == "File Uploaded Failed"
                  ) {
                    setFileUploaded(false);
                    // setSubmitDisabled(true)
                    setFormState((formState) => ({
                      ...formState,
                      isSuccess: false,
                      isUpdate: false,
                      isDelete: false,
                      isFailed: true,
                      errMessage: " File Upload Failed.",
                    }));
                  } else {
                    setFileUploaded(true);
                    // setSubmitDisabled(false)
                    // setFormState((formState) => ({
                    //   ...formState,
                    //   isSuccess: true,
                    //   isUpdate: false,
                    //   isDelete: false,
                    //   isFailed: false,
                    //   errMessage: "File Uploaded Successfully !!",
                    // }));
                  }
                })
                .catch((error: Error) => {
                  setUploadDisabled(true);
                  setFileUploaded(false);
                  setBackdrop(false);
                  setSelectedFile(null);
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
            uploadFile({
              variables: {
                input: {
                  client: props.location.state.clientInfo.clientId,
                  targetName: name,
                  file: res,
                  vpnUsername: vpnUserName,
                  vpnPassword: vpnPassword,
                  type: selectedFile.name.substring(
                    selectedFile.name.lastIndexOf(".") + 1,
                    selectedFile.name.length
                  ),
                },
              },
            })
              .then((response: any) => {
                setBackdrop(false);
                // setSelectedFile(null);
                if (
                  response.data.uploadFile.success == "File Uploaded Failed"
                ) {
                  // setSubmitDisabled(true)
                  setFileUploaded(false);
                  setFormState((formState) => ({
                    ...formState,
                    isSuccess: false,
                    isUpdate: false,
                    isDelete: false,
                    isFailed: true,
                    errMessage: " File Upload Failed.",
                  }));
                } else {
                  setFileUploaded(true);
                  // setSubmitDisabled(false)
                  // setFormState((formState) => ({
                  //   ...formState,
                  //   isSuccess: true,
                  //   isUpdate: false,
                  //   isDelete: false,
                  //   isFailed: false,
                  //   errMessage: " File Uploaded Successfully !!",
                  // }));
                }
              })
              .catch((error: Error) => {
                setUploadDisabled(true);
                setFileUploaded(false);
                setBackdrop(false);
                setSelectedFile(null);
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
        });
      } else {
        setBackdrop(false);
        setSelectedFile(null);
        setFormState((formState) => ({
          ...formState,
          isSuccess: false,
          isUpdate: false,
          isDelete: false,
          isFailed: true,
          errMessage: "Please select the file to upload",
        }));
      }
    } else {
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: "Please fill in the required fields and upload the file ",
      }));
    }
  };
  let obuserData = JSON.parse(obUser);
  let firstName = obuserData.data.getUserDetails.edges[0].node.firstName;
  let lastName = obuserData.data.getUserDetails.edges[0].node.lastName;
  const handleBack = () => {
    if (Cookies.getJSON("ob_session")) {
      if (targetId && targetId.length > 0) {
        deleteTarget({
          variables: {
            id: Number(targetId),
            firstName: firstName,
            lastName: lastName,
          },
        })
          .then((res: any) => {
            let data = {};
            data = { refetchData: true, clientInfo: clientInfo };
            console.log("param-------------------------------", param);
            if (param?.previousPage === "client") {
              history.push(routeConstant.CLIENT, data);
              localStorage.removeItem("name");
              localStorage.removeItem("customClientUrl");
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
          })
          .catch((err) => {
            let data = {};
            data = { refetchData: true, clientInfo: clientInfo };
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
          });
      } else {
        let data = {};
        data = { refetchData: true, clientInfo: clientInfo };
        if (param?.previousPage === "client") {
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
      }
    } else {
      logout();
    }
  };

  let data = {};
  let targetInfo = {
    targetName: name,
    host: ipRange,
    vpnUserName: vpnUserName,
    vpnPassword: vpnPassword,
  };
  console.log(
    "props.location.state?.previousPage",
    props.location.state?.previousPage
  );
  const handleOkay = () => {
    setShowDialogBox(false);
    setTimeout(() => {
      data = {
        LinuxNetwork:
          props.location.state && props.location.state.LinuxNetwork
            ? props.location.state.LinuxNetwork
            : true,
        windowsNetwork:
          props.location.state && props.location.state.windowsNetwork
            ? props.location.state.windowsNetwork
            : false,
        editData:
          props.location.state && props.location.state.editData
            ? props.location.state.editData
            : false,
        clientInfo: props.location.state && props.location.state.clientInfo,
        targetInfo: targetInfo,
        editLinuxData: props.location.state.editLinuxData
          ? props.location.state.editLinuxData
          : false,
        editWindowsData: props.location.state.editWindowsData
          ? props.location.state.editWindowsData
          : false,
        previousPage: props.location.state?.previousPage,
      };
      history.push(routeConstant.LINUX_NETWORK, data);
    }, 500);
  };

  const handleCancel = () => {
    setShowDialogBox(false);
  };

  const handleClose = () => {
    setShowDialogBox(false);
    setTimeout(() => {
      if (props.location.state) {
        data = {
          LinuxNetwork:
            props.location.state && props.location.state.LinuxNetwork
              ? props.location.state.LinuxNetwork
              : true,
          windowsNetwork:
            props.location.state && props.location.state.windowsNetwork
              ? props.location.state.windowsNetwork
              : false,
          editData:
            props.location.state && props.location.state.editData
              ? props.location.state.editData
              : false,
          clientInfo: props.location.state && props.location.state.clientInfo,
          targetInfo: targetInfo,
          editLinuxData: props.location.state.editLinuxData
            ? props.location.state.editLinuxData
            : false,
          editWindowsData: props.location.state.editWindowsData
            ? props.location.state.editWindowsData
            : false,
          previousPage: props.location.state?.previousPage,
        };
      }
      history.push(routeConstant.WINDOWS_NETWORK, data);
    }, 500);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    if (!/[^a-zA-Z0-9\- \/]/.test(event.target.value)) {
      let value = event.target.value;
      let isErrName = value.length <= 0 ? "Required" : "";
      setIsError((isError: any) => ({
        ...isError,
        name: isErrName,
      }));
      setUploadDisabled(true);
      setFileUploaded(false);
      setSubmitDisabled(checkValidation);
    }
    if (/[^a-zA-Z0-9\- \/]/.test(event.target.value)) {
      setIsError((isError: any) => ({
        ...isError,
        name: "Invalid Scan Name",
      }));
    }
  };

  const handleIpRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIpRange(event.target.value);
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

  const handleVpnPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVpnPassword(event.target.value);
    let value = event.target.value;
    let isErrVpnPassword = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      vpnPassword: isErrVpnPassword,
    }));
    setSubmitDisabled(checkValidation);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const removeUploadFile = () => {
    // setFileChanged(true);
    setSelectedFile(null);
    setVpnFilePath(null);
    setDisplayVpnFilePath(null);
    setSubmitDisabled(true);
    onChangeHandler(fileEvent, "remove");
  };

  const onClickTestConnection = async () => {
    // onClickHandler2();
    if (props.location.state.clientInfo) {
      if (props.location.state && props.location.state.reRun === true) {
        setBackdrop(true);
        // testVpnConnection({
        //   variables: {
        //     "input": {
        //       "client": props.location.state.clientInfo.clientId,
        //       "targetName": name,
        //       "vpnUsername": vpnUserName,
        //       "vpnPassword": vpnPassword,
        //       "host": ipRange,
        //       "targetId":targetData.getCredentialsDetails.edges[0].node.vatTarget.id,
        //       "testConnectType":props.location.state != undefined && props.location.state.editData ?  "Retry" : "New"
        //     }
        //   }
        // })
        const headerObj = {
          "Content-Type": "application/json",
          Authorization: "jwt" + " " + session,
        };
        let url;
        if (
          props.location.state != undefined &&
          props.location.state.editData
        ) {
          url =
            OB_URI +
            "target/testcredentails/?cid=" +
            props.location.state.clientInfo.clientId +
            "&tname= " +
            name +
            "&vusername=" +
            vpnUserName +
            "&vpasswords=" +
            vpnPassword +
            "&testConnectType=" +
            "New";
        } else {
          url =
            OB_URI +
            "target/testcredentails/?cid=" +
            props.location.state.clientInfo.clientId +
            "&tname= " +
            name +
            "&vusername=" +
            vpnUserName +
            "&vpasswords=" +
            vpnPassword +
            "&testConnectType=" +
            "New";
        }
        await fetch(url, {
          method: "GET",
          headers: headerObj,
          // body: JSON.stringify({ UserId: 0, Assessment_ID: id }),
        })
          .then((data) => data.json())
          .then((response) => {
            setBackdrop(false);
            if (response == "VPN connected Successfully") {
              SetConnectionSuccess(true);
              setSubmitDisabled(false);
              setFormState((formState) => ({
                ...formState,
                isSuccess: true,
                isUpdate: false,
                isDelete: false,
                isFailed: false,
                errMessage: " Test Connection Successful ",
              }));
            } else if (response == "VPN is Connected,Please Disconnect") {
              SetConnectionSuccess(false);
              setSubmitDisabled(true);
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage:
                  " You are already connected with another VPN. Please disconnect then try again",
              }));
            } else if (response == "Authentication Failed") {
              SetConnectionSuccess(false);
              setSubmitDisabled(true);
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage: " Authentication Failed",
              }));
            } else if (response == "Openvpn File is invalid") {
              SetConnectionSuccess(false);
              setSubmitDisabled(true);
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage: " Invalid File",
              }));
            } else if (response == "Scan name is already present") {
              SetConnectionSuccess(false);
              setSubmitDisabled(true);
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage: " Scan name exists. Add another name",
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
                errMessage: " Test Connection Failed ",
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
        // testVpnConnection({
        //   variables: {
        //     "input": {
        //       "client": props.location.state.clientInfo.clientId,
        //       "targetName": name,
        //       "vpnUsername": vpnUserName,
        //       "vpnPassword": vpnPassword,
        //       "host": ipRange,
        //       "targetId":targetId ? targetId : null,
        //       "testConnectType":props.location.state != undefined && props.location.state.editData ?  "Retry" : "New"
        //     }
        //   }
        // })
        const headerObj = {
          "Content-Type": "application/json",
          Authorization: "jwt" + " " + session,
        };
        let url;
        if (
          props.location.state != undefined &&
          props.location.state.editData
        ) {
          url =
            OB_URI +
            "target/testcredentails/?cid=" +
            props.location.state.clientInfo.clientId +
            "&tname= " +
            name +
            "&vusername=" +
            vpnUserName +
            "&vpasswords=" +
            vpnPassword +
            "&testConnectType=" +
            "New";
        } else {
          url =
            OB_URI +
            "target/testcredentails/?cid=" +
            props.location.state.clientInfo.clientId +
            "&tname= " +
            name +
            "&vusername=" +
            vpnUserName +
            "&vpasswords=" +
            vpnPassword +
            "&testConnectType=" +
            "New";
        }
        await fetch(url, {
          method: "GET",
          headers: headerObj,
          // body: JSON.stringify({ UserId: 0, Assessment_ID: id }),
        })
          .then((data) => data.json())
          .then((response) => {
            setBackdrop(false);
            console.log("RESPONSE", response);
            if (response == "VPN connected Successfully") {
              SetConnectionSuccess(true);
              setSubmitDisabled(false);
              setFormState((formState) => ({
                ...formState,
                isSuccess: true,
                isUpdate: false,
                isDelete: false,
                isFailed: false,
                errMessage: " Test Connection Successful ",
              }));
            } else if (response == "Authentication Failed") {
              SetConnectionSuccess(false);
              setSubmitDisabled(true);
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage: " Authentication Failed",
              }));
            } else if (response == "Openvpn File is invalid") {
              SetConnectionSuccess(false);
              setSubmitDisabled(true);
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage: " Invalid File",
              }));
            } else if (response == "VPN is Connected,Please Disconnect") {
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
            } else if (response == "Scan name is already present") {
              SetConnectionSuccess(false);
              setSubmitDisabled(true);
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage: " Scan name exists. Add another name",
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
                errMessage: " Test Connection Failed ",
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
  };

  const handleClickShowVpnPassword = () => {
    setShowVpnPassword(!showVpnPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleInputErrors = () => {
    let error = true;
    if (vpnUserName === "") {
      error = false;
      let isErrVpnUserName = vpnUserName.length <= 0 ? "Required" : "";
      setIsError((error: any) => ({
        ...error,
        vpnUserName: isErrVpnUserName,
      }));
    }
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
    if (vpnPassword === "") {
      error = false;
      setIsError((isError: any) => ({
        ...isError,
        vpnPassword: "Required",
      }));
    }
    return error;
  };

  const theme = createMuiTheme({
    overrides: {
      // MuiTooltip: {
      //   tooltip: {
      //     backgroundColor:"rgb(240, 102, 1, 0.8)",
      //     borderRadius : "12px",
      //     position: "relative",
      //   },
      //   tooltipPlacementRight: {
      //     "&:before" : {
      //       content: "' '",
      //       width: "0px",
      //       height: "0px",
      //       borderTop: "6px solid transparent",
      //       borderBottom: "6px solid transparent",
      //       borderRight:"6px solid rgba(240, 102, 1, 0.8)",
      //       zIndex: "9999",
      //     position:"absolute",
      //     left:"-6px",
      //     top:"45%",
      //     }
      //   }
      // }
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

  const handleTargetToolTipClose = () => {
    setTargetOpen(false);
  };

  const handleTargetToolTipOpen = () => {
    setTargetOpen(true);
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        Vulnerability Test for{" "}
        {props.location.state !== undefined &&
        props.location.state.clientInfo !== undefined
          ? props.location.state.clientInfo.name
          : null}
      </Typography>
      <RaStepper />
      {taskLoading || backdrop ? <SimpleBackdrop /> : null}
      {targetLoading ? <SimpleBackdrop /> : null}
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
      {/* <Paper className={styles.paper}> */}

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
        <Grid
          item
          xs={12}
          md={6}
          className={
            props.location.state != undefined && props.location.state.editData
              ? styles.disfield
              : styles.inputs
          }
        >
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
                disabled={
                  props.location.state != undefined &&
                  props.location.state.editData
                }
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
                    <b>Please enter data in the below formats</b>{" "}
                  </p>
                  <b>{"Single IP Address"}</b>
                  <em>{"(e.g. 192.168.x.xx)"}</em>{" "}
                  <p>
                    <b>{" Multiple IP Address"}</b>{" "}
                    {
                      "(e.g. 192.168.X.1/24 | 192.168.X.1-255 | 192.168.X.1-27 | 192.168.X.1-192.168.X.3 | 192.168.X.1,192.168.X.3,192.168.X.4)"
                    }
                  </p>{" "}
                  <p>
                    <b>For Domain/URL </b> <em>{"(e.g. domainname.com)"}</em>{" "}
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
                IP Range IP Range IP Range
              </Input>

              {/* <ContactSupportIcon className={styles.CircleIcon} /> */}
            </Tooltip>
            {/* </MuiThemeProvider> */}
          </span>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="VPN Username"
            value={vpnUserName}
            onChange={handleVpnUserNameChange}
            required
            error={isError.vpnUserName}
            helperText={isError.vpnUserName}
          >
            VPN User Name
          </Input>
        </Grid>
        <Grid item xs={12} md={6} className={styles.PasswordField}>
          <FormControl className={styles.TextField} variant="outlined">
            <InputLabel classes={{ root: styles.FormLabel }}>
              VPN Password *
            </InputLabel>
            <OutlinedInput
              classes={{
                root: styles.InputField,
                notchedOutline: styles.InputField,
                focused: styles.InputField,
              }}
              type={showVpnPassword ? "text" : "password"}
              label="VPN Password *"
              value={vpnPassword}
              onChange={handleVpnPasswordChange}
              required
              // error={isError.vpnPassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowVpnPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showVpnPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {isError.vpnPassword ? (
              <FormHelperText
                error={isError.vpnPassword}
                classes={{ root: styles.FormHelperText }}
              >
                Required
              </FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        {/* <Grid item xs={12} md={6} className={styles.upBtn}> */}
        <Grid item xs={12} md={6}>
          <form>
            <label className={styles.lawDocument}>VPN Config File </label>
            <span className={styles.UploadTooltip}>
              {/* <MuiThemeProvider theme={theme}> */}

              <Tooltip
                open={uploadToolOpen}
                onClose={handleUploadToolTipClose}
                onOpen={handleUploadToolTipOpen}
                title={
                  <React.Fragment>
                    <p>
                      <b>Note:</b>
                      <b>
                        {"The system accepts only .ovpn  and .tgz file formats"}
                      </b>{" "}
                    </p>
                    {/* {"It's very engaging. Right?"} */}
                  </React.Fragment>
                }
              >
                <ContactSupportIcon className={styles.CircleIcon} />
              </Tooltip>
              {/* </MuiThemeProvider> */}
            </span>
            <input
              id="fileUpload"
              type="file"
              name="file"
              onChange={(event) => onChangeHandler(event, "")}
              className={styles.fileInput}
              accept=".ovpn,.tgz"
            />
            {selectedFile || displayVpnFilePath ? (
              <div className={styles.uploadLabelWrap}>
                <div className={styles.uploadLabelName}>Uploaded File :</div>
                <div className={styles.uploadedLabel}>
                  {selectedFile ? selectedFile.name : displayVpnFilePath}
                  &nbsp;&nbsp;
                </div>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={removeUploadFile}
                  className={styles.CloseButton}
                >
                  <CancelIcon />
                </Button>
              </div>
            ) : (
              <label htmlFor="fileUpload" className={styles.fileUploadLable}>
                Upload File
              </label>
            )}

            {/* <Button
              type="button"
              color="primary"
              variant={"contained"}
              disabled={uploadDisabled}
              onClick={onClickHandler}
            >
              Upload
            </Button> */}
          </form>
        </Grid>

        <Grid item xs={12} className={styles.ActionButtons}>
          {/* <Button
            className={styles.borderLess}
            variant={"contained"}
            onClick={handleBack}
            color="primary"
            data-testid="cancel-button"
          >
            back
          </Button> */}
          <AlertBox
            DialogTitle={""}
            open={showDialogBox}
            dialogBoxMsg={dialogBoxMsg}
            pathName={""}
            handleOkay={handleOkay}
            cancelButtonPath={""}
            closeButtonPath={""}
            buttonName={"Yes"}
            CloseButtonName={"No"}
            handleCancel={handleCancel}
            handleClose={handleClose}
          ></AlertBox>

          <Button
            type="button"
            color="primary"
            variant={"contained"}
            // disabled={!fileUploaded}
            onClick={onClickHandler2}
          >
            {props.location.state != undefined && props.location.state.editData
              ? "Retry"
              : "Test Connection"}
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
          <Button
            className={styles.borderLess}
            variant={"contained"}
            onClick={handleBack}
            color="primary"
            data-testid="cancel-button"
          >
            cancel
          </Button>
        </Grid>
      </Grid>
      {/* </Paper> */}
    </React.Fragment>
  );
};

export default Target;
