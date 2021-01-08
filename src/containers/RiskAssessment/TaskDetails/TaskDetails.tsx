import React, { useState, useEffect } from "react";
import styles from "./TaskDetails.module.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Button } from "../../../components/UI/Form/Button/Button";
import { AddEditForm } from "../../../components/UI/AddEditForm/AddEditForm";
import Input from "../../../components/UI/Form/Input/Input";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { GET_SCAN_CONFIG } from "../../../graphql/queries/ScanConfig";
import { GET_SCANDATA } from "../../../graphql/queries/ScanData";
import { GET_TARGET } from "../../../graphql/queries/Target";
import {
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
} from "../../../graphql/mutations/Task";
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
import TextField from "@material-ui/core/TextField";
import { Checkbox } from "../../../components/UI/Form/Checkbox/Checkbox";
import RaStepper from "../component/RaStepper/RaStepper";
import { useHistory } from "react-router-dom";
import * as routeConstant from "../../../common/RouteConstants";
import { setRaStepper } from "../common/SetRaStepper";
import { useApolloClient } from "@apollo/client";
import stepper from "../common/raStepperList.json";

export const TaskDetails: React.FC = (props: any) => {
  let scanArr: any = [];
  const history = useHistory();
  const client = useApolloClient();
  // const classes = useStyles(theme);
  const clientInfo = props.location.state.clientInfo;
  const targetName = JSON.parse(localStorage.getItem("name") || "{}");
  let scanConfigListItems = props.location.state
    ? props.location.state.scanConfigList
    : null;
  const scanListCheckBox: any = props.location.state
    ? props.location.state.scanConfigList
    : null;

  //Autocomplete list
  const [getScanDataList, setScanDataList] = useState([]);
  const [getTargetList, setTargetList] = useState([]);
  const [getScanConfigList, setScanConfigList] = useState([]);

  // Show form
  const [showForm, setShowForm] = useState<boolean>(false);

  //add/edit data

  const [name, setName] = useState<String>("");
  const [target, setTarget] = useState<String>("");
  const [scanConfig, setScanConfig] = useState<any>([]);

  //static values for partner and client are given.
  const tempScheduleDate = new Date().toISOString();
  const partnerId = parseInt(clientInfo.partnerId);
  const clientId = parseInt(clientInfo.clientId);

  //table
  const columns = [
    { title: "Task Name", field: "taskName" },
    { title: "Target", field: "target" },
    { title: "Scan Configuration", field: "scanConfig" },
  ];
  //show password
  const title = "Listing of Task";

  //validation and error handelling
  const [isError, setIsError] = useState<any>({
    name: "",
    scanConfig: "",
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
  const [createTask] = useMutation(CREATE_TASK);

  if (
    scanListCheckBox !== undefined &&
    scanListCheckBox !== null &&
    scanListCheckBox.length !== 0 &&
    scanConfig.length === 0
  ) {
    setScanConfig(scanListCheckBox);
  }

  const {
    data: dataScanConfig,
    error: errorScanConfig,
    loading: loadingScanConfig,
    refetch: refetchScanConfig,
  } = useQuery(GET_SCAN_CONFIG, {
    variables: {
      clientId: clientId,
    },

    fetchPolicy: "cache-and-network",
  });

  const checkValidation = () => {
    if (
      isError.name !== "" ||
      isError.scanConfig !== "" ||
      !name ||
      scanConfig.length === 0
    ) {
      return true;
    }
    return false;
  };

  if (targetName !== {} && target === "") {
    setTarget(JSON.parse(localStorage.getItem("name") || "{}"));
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
  }, [name, scanConfig, submitDisabled]);

  useEffect(() => {
    setRaStepper(client, stepper.Task.name, stepper.Task.value);
  }, []);

  if (loadingScanConfig) return <Loading />;
  if (getScanConfigList.length === 0 && dataScanConfig) {
    setScanConfigList(dataScanConfig.getScanConfigurationdata.edges);
  }

  const handleSubmitDialogBox = () => {
    setSubmitDisabled(true)
    let input = {
      partner: partnerId,
      client: clientId,
      taskName: name,
      vatTarget: target,
      vatScanConfig: scanConfig,
      scheduleDate: tempScheduleDate,
    };
    createTask({
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
          errMessage: "",
        }));
        setShowForm(false);
        let data = {};
        data = { refetchData: true, clientInfo: clientInfo };
        history.push(routeConstant.RA_REPORT_LISTING, data);
        localStorage.removeItem("name");
        localStorage.removeItem("targetId");
        localStorage.removeItem("ipRange");
        localStorage.removeItem("userName");
        localStorage.removeItem("password");
      })
      .catch((err) => {
        setSubmitDisabled(true)
        console.log("error", err);
        let error = err.message;
        if (error.includes("duplicate key value violates unique constraint")) {
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
  };

  const handleBack = () => {
    // if (scanListCheckBox.length > 0) {
    //   let data = { editData: true, scanListShow: true, clientInfo: clientInfo };
    //   history.push(routeConstant.TARGET, data);
    // }
    let data = { editData: true, clientInfo: clientInfo };
    history.push(routeConstant.TARGET, data);
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

  const handleCheckElement = (event: any) => {
    let val = event.target.value;
    scanArr = [...scanConfig];
    if (scanArr.includes(val)) {
      let position = scanArr.indexOf(val);
      if (position >= 0) {
        scanArr.splice(position, 1);
      }
    } else {
      scanArr.push(val);
    }
    setScanConfig(scanArr);
    let isErrScanArr = scanArr.length === 0 ? "Required" : "";
    setIsError((isError: any) => ({
      ...isError,
      scanConfig: isErrScanArr,
    }));
    setSubmitDisabled(checkValidation);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <RaStepper />
      <Typography component="h5" variant="h1">
        Task
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
            label="Task Name"
            value={name}
            onChange={handleNameChange}
            required
            error={isError.name}
            helperText={isError.name}
          >
            Task Name
          </Input>
        </Grid>
        <Grid item xs={6}>
          <Input
            type="text"
            label="Target"
            value={target}
            // onChange={handleNameChange}
            required
            disabled
          >
            Target
          </Input>
        </Grid>
        <Grid item xs={12}>
          Select Scan Configuration
        </Grid>
        {getScanConfigList.map((obj: any, i: any) => {
          return (
            <Grid item xs={3}>
              <FormControlLabel
                className={styles.CheckboxLabel}
                key={obj.node.vatScanConfigId}
                control={
                  <Checkbox
                    checked={scanConfig.includes(obj.node.vatScanConfigId)}
                    onChange={handleCheckElement}
                    name={obj.node.scanConfigName}
                    value={obj.node.vatScanConfigId}
                  />
                }
                label={obj.node.scanConfigName}
              />
            </Grid>
          );
        })}

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
            save
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default TaskDetails;
