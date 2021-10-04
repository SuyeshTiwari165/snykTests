import React, { useState, useEffect } from "react";
import styles from "./ProfileSettings.module.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import { Button } from "../../components/UI/Form/Button/Button";
import AutoCompleteDropDown from "../../components/UI/Form/Autocomplete/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useMutation, useLazyQuery } from "@apollo/client";
import { PARTNER_SCHEDULE } from "../../graphql/mutations/PartnerSchedule";
import Cookies from "js-cookie";
import logout from "../Auth/Logout/Logout";
import {
  SUCCESS,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../common/MessageConstants";
import Alert from "../../components/UI/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import SimpleBackdrop from "../../components/UI/Layout/Backdrop/Backdrop";
import { GET_PARTNER_SCHEDULE } from "../../graphql/queries/PartnerSchedule";
import MaterialTable from "../../components/UI/Table/MaterialTable";
import Input from "../../components/UI/Form/Input/Input";
import AlertBox from "../../components/UI/AlertBox/AlertBox";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";

export const ProfileSettings: React.FC = (props: any) => {
  // const [days, setDays] = useState([]);
  const partner = Cookies.get("ob_partnerData") || logout();

  const days = [
    { title: "Monday", value: "Monday" },
    { title: "Tuesday", value: "Tuesday" },
    { title: "Wednesday", value: "Wednesday" },
    { title: "Thursday", value: "Thursday" },
    { title: "Friday", value: "Friday" },
    { title: "Saturday", value: "Saturday" },
    { title: "Sunday", value: "Sunday" },
  ];
  const column = [
    { title: "Partner Name", field: "partnerName" },
    { title: "Time Zone", field: "tZone" },
    { title: "Start Day", field: "StartDay" },
    { title: "End Day", field: "endDay" },
    { title: "Start Time", field: "startTime" },
    { title: "End Time", field: "endTime" },
  ];
  const [startDay, setStartDay] = useState<any>([
    {
      Name: "",
      value: "",
    },
  ]);
  const [endDay, setEndDay] = useState<any>([
    {
      Name: "",
      value: "",
    },
  ]);
  const [startTime, setStartTime] = React.useState<Date | null>(null);
  const [startTimeValue, setStartTimeValue] = React.useState<any>();
  const [timezone, setTimezone] = React.useState<any>();
  const [endTime, setEndTime] = React.useState<Date | null>(null);
  const [endTimeValue, setEndTimeValue] = React.useState<any>();
  const [isError, setIsError] = useState<any>({
    startTimeValue: "",
    endTimeValue: "",
    startDay: "",
    endDay: "",
  });
  const [backdrop, setBackdrop] = useState(false);
  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });
  const [newData, setNewData] = useState([]);
  const [showDialogBox, setShowDialogBox] = useState<boolean>(false);
  const [dialogBoxMsg, setDialogBoxMsg] = useState("");

  const [createPartnerSchedule] = useMutation(PARTNER_SCHEDULE);

  const [getPartnerSchedule, { data: ipData, loading: ipLoading }] =
    useLazyQuery(GET_PARTNER_SCHEDULE, {
      fetchPolicy: "cache-and-network",
      onCompleted: (data: any) => {
        createTableDataObject(data.getPartnerSchedule.edges);
      },
      onError: (error) => {
        logout();
      },
    });
  useEffect(() => {
    let partnerData = JSON.parse(partner);
    getPartnerSchedule({
      variables: {
        // orderBy: "client_name",
        partnerId_PartnerName:
          partnerData.data.getPartnerUserDetails.edges[0].node.partnerId
            .partnerName,
        // client_type: "Prospect",
      },
    });
    setTimezone(
      partnerData.data.getPartnerUserDetails.edges[0].node.partnerId.tZone
    );
  }, []);

  const startDayChange = (event: any, newValue: any) => {
    setStartDay(newValue);
  };

  const endDayChange = (event: any, newValue: any) => {
    setEndDay(newValue);
  };

  const handleStartTimeChange = (date: Date | null | any, value: any) => {
    setStartTimeValue(convertTime12to24(value));
    setStartTime(date);
  };
  const handleEndTimeChange = (date: Date | null | any, value: any) => {
    setEndTimeValue(convertTime12to24(value));
    setEndTime(date);
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

  const handleInputErrors = () => {
    let error = true;
    if (startTimeValue === "") {
      error = false;
      let isErrName = startTimeValue.length <= 0 ? "Required" : "";
      setIsError((error: any) => ({
        ...error,
        startTimeValue: isErrName,
      }));
    }
    if (endTimeValue === "") {
      error = false;
      let isErrIpRange = endTimeValue.length <= 0 ? "Required" : "";
      setIsError((error: any) => ({
        ...error,
        endTimeValue: isErrIpRange,
      }));
    }
    if (endTimeValue === "") {
      error = false;
      let isErrIpRange = endTimeValue.length <= 0 ? "Required" : "";
      setIsError((error: any) => ({
        ...error,
        ipRange: isErrIpRange,
      }));
    }
    return error;
  };

  const handleSubmitDialogBox = () => {
    setBackdrop(true);
    if (Cookies.getJSON("ob_session")) {
      let partnerData = JSON.parse(partner);
      let input = {
        partnerid:
          partnerData.data.getPartnerUserDetails.edges[0].node.partnerId.id,
        startDay: startDay.value,
        endDay: endDay.value,
        startTime: startTimeValue + ":00",
        endTime: endTimeValue + ":00",
        tZone:
          partnerData.data.getPartnerUserDetails.edges[0].node.partnerId.tZone,
      };
      console.log("input", input);
      createPartnerSchedule({
        variables: {
          input,
        },
      })
        .then((userRes) => {
          setShowDialogBox(false);
          setBackdrop(false);
          setFormState((formState) => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: " Scheduled Successfully",
          }));
          let partnerData = JSON.parse(partner);
          getPartnerSchedule({
            variables: {
              // orderBy: "client_name",
              partnerId_PartnerName:
                partnerData.data.getPartnerUserDetails.edges[0].node.partnerId
                  .partnerName,
              // client_type: "Prospect",
            },
          });
        })
        .catch((err) => {
          setBackdrop(false);
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: false,
            isFailed: true,
            errMessage: "Scheduling Failed",
          }));
        });
    } else {
      logout();
    }
  };

  const convertTime12to24 = (time12h: any) => {
    const [time, modifier] = time12h.split(" ");

    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  };

  function tConvert(time: any) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }

  const createTableDataObject = (data: any) => {
    let arr: any = [];

    data.map((element: any) => {
      let obj: any = {};

      obj["partnerName"] = element.node.partner.partnerName;
      obj["endDay"] = element.node.endDay;
      obj["StartDay"] = element.node.startDay;
      obj["startTime"] = tConvert(element.node.startTime);
      obj["endTime"] = tConvert(element.node.endTime);
      obj["tZone"] = element.node.tZone;
      arr.push(obj);
    });

    setNewData(arr);
  };

  const handleOkay = () => {
    setShowDialogBox(false);
  };

  const handleAddNewSchedule = () => {
    handleAlertClose();
    setShowDialogBox(true);
    setDialogBoxMsg("");
  };

  const handleCancel = () => {
    setShowDialogBox(false);
  };

  const handleClose = () => {
    setShowDialogBox(false);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        Scheduling Configuration
      </Typography>
      {!showDialogBox ? (
        <Grid container className={styles.backToListButtonPanel}>
          <Grid item xs={12} md={12} className={styles.backToListButton}>
            <Button
              className={styles.BackToButton}
              variant={"contained"}
              onClick={() => {
                window.history.back();
              }}
              color="secondary"
              data-testid="cancel-button"
            >
              <img
                src={process.env.PUBLIC_URL + "/icons/svg-icon/back-list.svg"}
                alt="user icon"
              />
              &nbsp; Back
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={handleAddNewSchedule}
              className={styles.ActionButton}
            >
              {/* <AddCircleIcon className={styles.EditIcon} /> */}
              <AddToPhotosIcon className={styles.EditIcon} />
              &nbsp; Schedule
            </Button>
          </Grid>
        </Grid>
      ) : null}
      {backdrop ? <SimpleBackdrop /> : null}
      {showDialogBox ? (
        <>
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
            <Paper className={styles.paper}>
              <Grid item xs={12} md={6} className={styles.disfield}>
                <Input
                  type="text"
                  label="Time Zone"
                  value={timezone}
                  required
                  disabled={true}
                >
                  Time Zone
                </Input>
              </Grid>

              <Grid item xs={12} md={6}>
                <div className={styles.FilterInput}>
                  <AutoCompleteDropDown
                    id="combo-box-demo"
                    options={days}
                    getOptionLabel={(option: any) => option.title}
                    style={{ width: 300 }}
                    onChange={startDayChange}
                    value={startDay}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        label="Start Day"
                        variant="outlined"
                        fullWidth
                        className={styles.ReactInput}
                      />
                    )}
                  />
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <div className={styles.FilterInput}>
                  <AutoCompleteDropDown
                    id="combo-box-demo"
                    options={days}
                    getOptionLabel={(option: any) => option.title}
                    style={{ width: 300 }}
                    onChange={endDayChange}
                    value={endDay}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        label="End Day"
                        variant="outlined"
                        fullWidth
                        className={styles.ReactInput}
                      />
                    )}
                  />
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="Start Time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="End Time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} className={styles.ActionButtons}>
            <Button
              onClick={handleSubmitDialogBox}
              color="primary"
              variant={"contained"}
              data-testid="ok-button"
            >
              Save
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
        </>
      ) : null}
      {!showDialogBox ? (
        <Grid item xs={12}>
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
          <Paper className={styles.paper}>
            {ipLoading ? <SimpleBackdrop /> : null}
            <div className={styles.ScrollTable}>
              {newData.length !== 0 ? (
                <MaterialTable
                  columns={column}
                  data={newData}
                  actions={[]}
                  options={{
                    headerStyle: {
                      background: "linear-gradient(#fef9f5,#fef9f5)",
                      whiteSpace: "nowrap",
                    },

                    thirdSortClick: false,
                    actionsColumnIndex: -1,
                    paging: true,
                    sorting: true,
                    search: false,
                    filter: true,
                    draggable: false,
                    pageSize: 25,
                    pageSizeOptions: [25, 50, 75, 100], // rows selection options
                  }}
                />
              ) : !ipLoading ? (
                <Typography component="h5" variant="h3">
                  You don't have any Schedular
                </Typography>
              ) : null}
            </div>
          </Paper>
        </Grid>
      ) : null}
    </React.Fragment>
  );
};

export default ProfileSettings;
