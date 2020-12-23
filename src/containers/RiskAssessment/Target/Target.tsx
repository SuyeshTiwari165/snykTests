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
import Loading from "../../../components/UI/Layout/Loading/Loading";
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
import { useApolloClient } from "@apollo/client";
import stepper from "../common/raStepperList.json";

export const Target: React.FC = (props: any) => {
  const history = useHistory();
  const client = useApolloClient();

  // const sessionData = useQuery(RA_TARGET_SESSION);
  const targetId = JSON.parse(localStorage.getItem("targetId") || "{}");

  //add/edit data
  const [name, setName] = useState<String>("");
  const [ipRange, setIpRange] = useState<String>("");
  const [userName, setUserName] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [vpnUserName, setVpnUserName] = useState<String>("");
  const [vpnPassword, setVpnPassword] = useState<String>("");
  const [scanConfigList, setScanConfigList] = useState<any>([]);

  //static values for partner and client are given.
  const partnerId = 1;
  const clientId = 2;
  const targetName = props["location"].state
    ? props["location"].state.targetName
    : null;

  // const [newData, setNewData] = useState();
  const [editDataId, setEditDataId] = useState<Number | null>();

  //show password
  const [showPassword, setShowPassword] = useState(false);

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
  const [updateTarget] = useMutation(UPDATE_TARGET);
  const [
    getTargetData,
    { data: targetData, loading: targetLoading, error: targetError },
  ] = useLazyQuery(GET_TARGET, {
    onCompleted: (data: any) => {
      if (targetData) {
        setIpRange(data.getTarget.edges[0].node.host);
        setUserName(
          data.getTarget.edges[0].node.vatCredentials
            ? data.getTarget.edges[0].node.vatCredentials.username
            : null
        );
        setPassword(
          data.getTarget.edges[0].node.vatCredentials
            ? data.getTarget.edges[0].node.vatCredentials.password
            : null
        );
      }
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
        },
      });
    }
  }, [targetName]);

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
  }

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
  if (targetLoading) return <Loading />;
  if (taskLoading) return <Loading />;
  if (targetError) {
    return <div className="error">Error!</div>;
  }

  const handleSubmitDialogBox = () => {
    if (editDataId) {
      let input = {
        targetName: name,
        host: ipRange,
        winUsername: userName,
        winPassword: password,
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
            errMessage: "",
          }));
          setEditDataId(null);
          setRaStepper(client, stepper.Task.name, stepper.Task.value);
          if (targetName !== null) {
            history.push({
              pathname: routeConstant.TASK_DETAILS,
              state: { targetName: targetName },
            });
          } else {
            history.push(routeConstant.TASK_DETAILS);
          }
        })
        .catch((err) => {
          console.log("error", err.message);
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
        targetName: name,
        host: ipRange,
        winUsername: userName,
        winPassword: password,
        vpnUsername: vpnUserName,
        vpnPassword: vpnPassword,
      };
      createTarget({
        variables: {
          input,
        },
      })
        .then((userRes) => {
          setFormState((formState) => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: "",
          }));
          setRaStepper(client, stepper.Task.name, stepper.Task.value);
          localStorage.setItem("name", JSON.stringify(name));
          localStorage.setItem(
            "targetId",
            JSON.stringify(userRes.data.createTarget.targetField.id)
          );
          localStorage.setItem("ipRange", JSON.stringify(ipRange));
          localStorage.setItem("userName", JSON.stringify(userName));
          localStorage.setItem("password", JSON.stringify(password));
          localStorage.setItem("vpnUserName", JSON.stringify(vpnUserName));
          localStorage.setItem("vpnPassword", JSON.stringify(vpnPassword));
          let data = {};
          if (scanConfigList) {
            data = { scanConfigList: scanConfigList };
          }
          history.push(routeConstant.TASK_DETAILS, data);
        })
        .catch((err) => {
          console.log("error", err);
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

  const handleBack = () => {
    let data = {};
    data = { refetchData: true };
    history.push(routeConstant.RA_REPORT_LISTING, data);
    localStorage.removeItem("name");
    localStorage.removeItem("targetId");
    localStorage.removeItem("ipRange");
    localStorage.removeItem("userName");
    localStorage.removeItem("password");
    localStorage.removeItem("vpnUserName");
    localStorage.removeItem("vpnPassword");
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

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <RaStepper />
      <Typography component="h5" variant="h1">
        Target
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <Input
            type="text"
            label="VPN Password"
            value={vpnPassword}
            onChange={handleVpnPasswordChange}
            required
            error={isError.vpnPassword}
            helperText={isError.vpnPassword}
          >
            VPN Password
          </Input>
        </Grid>
        <Grid item xs={1} className={styles.backToListButton}>
          <Button
            variant={"contained"}
            onClick={handleBack}
            color="secondary"
            data-testid="cancel-button"
          >
            back
          </Button>
        </Grid>
        <Grid item xs={1} className={styles.saveButton}>
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
  );
};

export default Target;
