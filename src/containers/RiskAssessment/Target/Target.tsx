import React, { useState, useEffect } from "react";
import styles from "./Target.module.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Button } from "../../../components/UI/Form/Button/Button";
import { AddEditForm } from "../../../components/UI/AddEditForm/AddEditForm";
import Input from "../../../components/UI/Form/Input/Input";
import { GET_TARGET } from "../../../graphql/queries/Target";
import { GET_TASK_DETAILS } from "../../../graphql/queries/TaskDetails";
import {
  CREATE_TARGET,
  UPDATE_TARGET,
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
import { TEST_CONNECTION } from "../../../graphql/mutations/VPNConnection"

export const Target: React.FC = (props: any) => {
  const history = useHistory();
  const client = useApolloClient();
  const [dialogBoxMsg, setDialogBoxMsg] = useState("");
  // const sessionData = useQuery(RA_TARGET_SESSION);
  const targetId = JSON.parse(localStorage.getItem("targetId") || "{}");
  const [showDialogBox, setShowDialogBox] = useState<boolean>(false);
  //add/edit data
  const [name, setName] = useState<String>("");
  const [ipRange, setIpRange] = useState<String>("");
  const [userName, setUserName] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [linuxDomain, setLinuxDomain] = useState(false);
  const [vpnUserName, setVpnUserName] = useState<String>("");
  const [vpnPassword, setVpnPassword] = useState<String>("");
  const [scanConfigList, setScanConfigList] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState(null)
  const [connectionSuccess, SetConnectionSuccess] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  //static values for partner and client are given.
  const clientInfo = props.location.state ? props.location.state.clientInfo : undefined;
  console.log("props.location.state", props.location.state)
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
  const [createTarget] = useMutation(CREATE_TARGET);
  const [uploadFile] = useMutation(UPLOAD_VPN_FILE);
  const [testVpnConnection] = useMutation(TEST_CONNECTION);
  const [updateTarget] = useMutation(UPDATE_TARGET);
  const [
    getTargetData,
    { data: targetData, loading: targetLoading, error: targetError },
  ] = useLazyQuery(GET_TARGET, {
    onCompleted: (data: any) => {
      console.log("getCredentialsDetails", data.getCredentialsDetails)
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
        setVpnPassword(
          data.getCredentialsDetails.edges[0].node
            ? data.getCredentialsDetails.edges[0].node.vpnPassword
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
      //     history.push(routeConstant.RA_REPORT_LISTING,props.location.state)
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
    if (targetName !== null) {
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
  console.log("editDataId", editDataId)
  if (targetId && editDataId === undefined) {
    if (targetId.length > 0) {
      setEditDataId(JSON.parse(localStorage.getItem("targetId") || "{}"));
      setName(JSON.parse(localStorage.getItem("name") || "{}"));
      setIpRange(JSON.parse(localStorage.getItem("ipRange") || "{}"));
      setUserName(JSON.parse(localStorage.getItem("userName") || "{}"));
      setPassword(JSON.parse(localStorage.getItem("password") || "{}"));
      setVpnUserName(JSON.parse(localStorage.getItem("vpnUserName") || "{}"));
      setVpnPassword(JSON.parse(localStorage.getItem("vpnPassword") || "{}"));
    }
  };

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
    setSubmitDisabled(checkValidation);
  }, [name, ipRange, userName, password, vpnUserName, vpnPassword]);

  useEffect(() => {
    setRaStepper(client, stepper.Target.name, stepper.Target.value);
  }, []);

  // for target data
  if (targetLoading || taskLoading || backdrop) return <SimpleBackdrop />;
  if (targetError) {
    return <div className="error">Error!</div>;
  }

  const handleSubmitDialogBox = () => {
    if (editDataId) {
      setSubmitDisabled(true)
      let input = {
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
          localStorage.setItem("name", JSON.stringify(name));
          localStorage.setItem(
            "targetId",
            JSON.stringify(userRes.data.updateTarget.targetField.id)
          );
          localStorage.setItem("ipRange", JSON.stringify(ipRange));
          localStorage.setItem("vpnUserName", JSON.stringify(vpnUserName));
          localStorage.setItem("vpnPassword", JSON.stringify(vpnPassword));
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
      setSubmitDisabled(true)
      if (partnerId && clientId && name && ipRange && vpnUserName) {
        let input = {
          partner: partnerId,
          client: clientId,
          targetName: name,
          host: ipRange,
          vpnUsername: vpnUserName,
          vpnPassword: vpnPassword,
          startDate: startDate,
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
              errMessage: "Target Created Successfully !",
            }));
            setRaStepper(client, stepper.Task.name, stepper.Task.value);
            localStorage.setItem("name", JSON.stringify(name));
            localStorage.setItem(
              "targetId",
              JSON.stringify(userRes.data.createTarget.targetField.id)
            );
            if (props.location.state && props.location.state.reRun == true) {
              localStorage.setItem("re-runTargetName", JSON.stringify(props.location.state.targetName));
            };
            localStorage.setItem("ipRange", JSON.stringify(ipRange));
            localStorage.setItem("vpnUserName", JSON.stringify(vpnUserName));
            localStorage.setItem("vpnPassword", JSON.stringify(vpnPassword));
            setShowDialogBox(false)
            let data = {};
            let targetInfo = {
              targetName: name,
              host: ipRange,
              userName: userName,
              password: password,
            };
            setTimeout(() => {
              setLinuxDomain(true);
              setShowDialogBox(true)
              setDialogBoxMsg(msgConstant.LINUX_NETWORK_CREDENTIALS);
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
    }
  };

  const onChangeHandler = (event: any) => {
    setSelectedFile(event.target.files[0])
    if (event.target.files[0] && name && vpnUserName && vpnPassword) {
      setUploadDisabled(false)
    } else {
      setUploadDisabled(true)
    }
  };

  const getBase64 = (file: any, cb: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  };

  const onClickHandler = (event: any) => {
    setBackdrop(true)
    let idCardBase64 = '';
    getBase64(selectedFile, (result: any) => {
      idCardBase64 = result;
      var res = result.slice(result.indexOf(",") + 1);
      uploadFile({
        variables: {
          input: {
            "client": props.location.state.clientInfo.clientId,
            "targetName": name,
            file: res,
            "vpnUsername": vpnUserName,
            "vpnPassword": vpnPassword
          }
        }
      }).then((response: any) => {
        console.log("responsre", response)
        setBackdrop(false);
        setSelectedFile(null);
        if (response.data.uploadFile.success == "File Uploaded Failed") {
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
          // setSubmitDisabled(false)
          setFormState((formState) => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: "File Uploaded Successfully !!",
          }));
        }
      }).catch((error: Error) => {
        setBackdrop(false);
        setSelectedFile(null);
        setFormState((formState) => ({
          ...formState,
          isSuccess: false,
          isUpdate: false,
          isDelete: false,
          isFailed: true,
          errMessage: "",
        }));
      })
    });
  };

  const handleBack = () => {
    let data = {};
    data = { refetchData: true, clientInfo: clientInfo };
    history.push(routeConstant.RA_REPORT_LISTING, data);
    localStorage.removeItem("name");
    localStorage.removeItem("targetId");
    localStorage.removeItem("ipRange");
    localStorage.removeItem("ipAddress");
    localStorage.removeItem("userName");
    localStorage.removeItem("password");
    localStorage.removeItem("vpnUserName");
    localStorage.removeItem("vpnPassword");
  };


  let data = {};
  let targetInfo = {
    targetName: name,
    host: ipRange,
    vpnUserName: vpnUserName,
    vpnPassword: vpnPassword,
  };
  const handleOkay = () => {
    setTimeout(() => {
      data = { clientInfo: props.location.state.clientInfo, targetInfo: targetInfo }
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
        data = { clientInfo: props.location.state.clientInfo, targetInfo: targetInfo }
      }
      history.push(routeConstant.WINDOWS_NETWORK, data);
    }, 500);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    let value = event.target.value;
    let isErrName = value.length <= 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      name: isErrName,
    }));
    setSubmitDisabled(checkValidation);
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

  const onClickTestConnection = () => {
    if (props.location.state.clientInfo) {
      setBackdrop(true)
      testVpnConnection({
        variables: {
          "input": {
            "client": props.location.state.clientInfo.clientId,
            "targetName": name,
            "vpnUsername": vpnUserName,
            "vpnPassword": vpnPassword,
            "host": ipRange
          }
        }
      }).then((response: any) => {
        setBackdrop(false)
        console.log(" Test Connection Success !!!!!", response)
        if (response.data.vpnConnection.success == "VPN connected Successfully") {
          SetConnectionSuccess(true)
          setSubmitDisabled(false)
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

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        Target : {props.location.state !== undefined && props.location.state.clientInfo !== undefined ? props.location.state.clientInfo.name : null}
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
          <Input
            type="text"
            label="IP Range"
            value={ipRange}
            onChange={handleIpRangeChange}
            required
            error={isError.ipRange}
            helperText={isError.ipRange}
          >
            IP Range
          </Input>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="text"
            label="VPN User Name"
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
              VPN Password
            </InputLabel>
            <OutlinedInput
              classes={{
                root: styles.InputField,
                notchedOutline: styles.InputField,
                focused: styles.InputField,
              }}
              type={showVpnPassword ? "text" : "password"}
              label="VPN Password"
              value={vpnPassword}
              onChange={handleVpnPasswordChange}
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
                Please enter a password.
              </FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <form>
            <input type="file" name="file" onChange={onChangeHandler} />
            <Button
              type="button"
              color="primary"
              variant={"contained"}
              disabled={uploadDisabled}
              onClick={onClickHandler}
            >
              Upload
              </Button>
          </form>
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
            disabled={submitDisabled}
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
            onClick={onClickTestConnection}
          >
            Test Connection
              </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Target;
