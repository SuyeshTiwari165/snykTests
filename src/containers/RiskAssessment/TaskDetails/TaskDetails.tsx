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
import { GET_TASK_DETAILS } from "../../../graphql/queries/TaskDetails";
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
  const ReRunTargetName = JSON.parse(localStorage.getItem("re-runTargetName") || "{}");
  // const localName = JSON.stringify(localStorage.getItem("name")) || "{}";
  const localName = localStorage.getItem("name") ? JSON.parse(localStorage.getItem("name") || '') :  null;

  // const classes = useStyles(theme);
  const clientInfo = props.location.state ? props.location.state.clientInfo : undefined;
  const targetInfo = props.location.state ? props.location.state.targetInfo : undefined;
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
  console.log("prioror", props.location.state)
  //add/edit data

  const [name, setName] = useState<String>("");
  const [target, setTarget] = useState<String>("");
  const [scanConfig, setScanConfig] = useState<any>([]);

  //static values for partner and client are given.
  const tempScheduleDate = new Date().toISOString();
  const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");
  const partnerId = partner.partnerId;
  const clientId = clientInfo ? parseInt(clientInfo.clientId) : undefined;

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

  const { data: taskData, loading: taskLoading } = useQuery(
    GET_TASK_DETAILS, {
    variables: {
      targetName: ReRunTargetName ? ReRunTargetName : targetName,
      client_ClientName: clientInfo.name,
    },
    onCompleted: (data: any) => {
      if (data.getTask.edges[0]) {
        console.log("data.getTask.edges[0]", data.getTask.edges[0].node.vatScanConfigList)
        setScanConfig(data.getTask.edges[0].node.vatScanConfigList);
      }
    },
    fetchPolicy: "cache-and-network",
  }
  );

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
    let substring = "_linux";
    let substring2 = "_windows";
    if (localName.includes(substring) || localName.includes(substring2)) {
      setTarget(localName.split("_")[0]);
    } else {
      setTarget(localName);
    }
  }

  // useEffect(() => {
  //   if (targetName !== null) {
  //     getTaskData({
  //       variables: {
  //         targetName: targetName,
  //         client_ClientName: clientInfo.name,
  //       },
  //     });
  //   }
  // }, [targetName]);

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
    setRaStepper(client, stepper.Task.name, stepper.Task.value, props.location.state);
  }, []);

  useEffect(() => {
    if (getScanConfigList.length === 0 && dataScanConfig) {
      setScanConfigList(dataScanConfig.getScanConfigurationdata.edges);
    }
  }, [dataScanConfig]);

  if (loadingScanConfig) return <Loading />;
  console.log("getScanConfigList.length", dataScanConfig)


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
        localStorage.removeItem("ipAddress");
        localStorage.removeItem('re-runTargetName');
        localStorage.removeItem("userName");
        localStorage.removeItem("password");
        localStorage.removeItem("vpnUserName");
        localStorage.removeItem("vpnPassword");
        localStorage.removeItem("WinTargetName");
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
    // let data = {
    //   editData: true,
    //   LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
    //   windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : true,
    //   clientInfo: clientInfo, targetInfo: targetInfo
    // };
    let data = {
      LinuxNetwork: props.location.state && props.location.state.LinuxNetwork ? props.location.state.LinuxNetwork : false,
      windowsNetwork: props.location.state && props.location.state.windowsNetwork ? props.location.state.windowsNetwork : true,
      editData: true,
      clientInfo: props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo : null,
      targetInfo: props.location.state && props.location.state.targetInfo ? props.location.state.targetInfo : null,
      editLinuxData: props.location.state.editLinuxData ? props.location.state.editLinuxData : false,
      editWindowsData: props.location.state.editWindowsData ? props.location.state.editWindowsData : false,
    }
    if (props.location.state && props.location.state.windowsNetwork) {
      history.push(routeConstant.WINDOWS_NETWORK, data);
    } else if (props.location.state && props.location.state.LinuxNetwork) {
      history.push(routeConstant.LINUX_NETWORK, data);
    } else {
      history.push(routeConstant.TARGET, data);
    }
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
      <Typography component="h5" variant="h1">
        Task
      </Typography>
      <RaStepper />
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
        <Grid item md={6} xs={12}>
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
        <Grid item md={6} xs={12} className={styles.disfield}>
          <Input
            type="text"
            label="Target"
            value={target}
            // onChange={handleNameChange}
            required
            disabled = {true}
        
          >
            Target
          </Input>
        </Grid>
        <Grid item xs={12}>
          <label className={styles.HeaderLabel}>Select Scan Configuration</label>
          <Grid container spacing={3}>
            <Grid item xs={12} className={styles.ConfigItem}>
              {getScanConfigList.map((obj: any, i: any) => {
                // console.log("obj.node",getScanConfigList)
                return (
                  <FormControlLabel
                    className={styles.CheckboxLabel}
                    key={obj.node ? obj.node.vatScanConfigId : null}
                    control={
                      <Checkbox
                        checked={scanConfig.includes(obj.node ? obj.node.vatScanConfigId : null)}
                        onChange={handleCheckElement}
                        name={obj.node ? obj.node.scanConfigName : null}
                        value={obj.node ? obj.node.vatScanConfigId : null}
                      />
                    }
                    label={obj.node ? obj.node.scanConfigName : null}
                  />
                );
              })}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={styles.backToListButton}>
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
            save
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default TaskDetails;
