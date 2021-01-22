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
import { setRaStepper } from "../common/SetRaStepper";
import { useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Button } from "../../../components/UI/Form/Button/Button";
import * as routeConstant from "../../../common/RouteConstants";
import * as msgConstant from "../../../common/MessageConstants";
import AlertBox from "../../../components/UI/AlertBox/AlertBox";
import stepper from "../common/raStepperList.json";

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
      !password
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    setRaStepper(client, stepper.WindowsNetwork.name, stepper.WindowsNetwork.value);
  }, []);


  const handleOkay = () => {
    setWindowsDomain(true);
    setShowDialogBox(true)
    setDialogBoxMsg(msgConstant.WINDOWS_NETWORK_CREDENTIALS);
  };

  const handleSubmitDialogBox = () => {
    let data = props.location.state
    history.push(routeConstant.TASK_DETAILS,data)
    // setShowDialogBox(true)
    // setDialogBoxMsg(msgConstant.WINDOWS_NETWORK_CREDENTIALS);
   
  };
  console.log("prorps-----------",props.location)
  const handleSkip = () =>{
    history.push(routeConstant.TASK_DETAILS);
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

  const handleClose = () => {
    setShowDialogBox(false);
  };

  const handleBack = () => {
    let data = {};
    // data = { refetchData: true, clientInfo: clientInfo };
    history.push(routeConstant.TARGET, props.location.state);
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
          value={ipRange}
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
          onClick={handleOkay}
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
          <AlertBox
            DialogTitle={""}
            open={showDialogBox}
            dialogBoxMsg={dialogBoxMsg}
            pathName={""}
            handleOkay={handleSubmitDialogBox}
            cancelButtonPath={""}
            closeButtonPath={routeConstant.TASK_DETAILS}
            buttonName={"Yes"}
            CloseButtonName={"No"}
            handleCancel={handleClose}
            handleClose={handleClose}
          ></AlertBox>
        <Button
          type="button"
          color="primary"
          variant={"contained"}
        // onClick={onClickTestConnection}
        >
          Test Connection
        </Button>
      </Grid>
    </React.Fragment>
  )
}
export default Windows_Network;
