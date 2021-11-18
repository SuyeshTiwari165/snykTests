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
import { PARTNER_SCHEDULE ,PARTNER_SCHEDULE_DELETE,PARTNER_SCHEDULE_EDIT} from "../../graphql/mutations/PartnerSchedule";
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
import AlarmIcon from "@material-ui/icons/AddAlarm";
import { DialogBox } from "../../components/UI/DialogBox/DialogBox";
import moment from "moment";
import { Info } from "@material-ui/icons";
// import { Tooltip } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';

export const ProfileSettings: React.FC = (props: any) => {
  // const [days, setDays] = useState([]);
  const partner = Cookies.get("ob_partnerData") || logout();

  const days = [
   
    { id: 1,title: "Monday", value: "Monday" },
    { id: 2,title: "Tuesday", value: "Tuesday" },
    { id: 3,title: "Wednesday", value: "Wednesday" },
    { id: 4,title: "Thursday", value: "Thursday" },
    { id: 5,title: "Friday", value: "Friday" },
    { id: 6,title: "Saturday", value: "Saturday" },
    { id: 7,title: "Sunday", value: "Sunday" },
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
      id:null,
      Name: "",
      value: "",
    },
  ]);
  const [endDay, setEndDay] = useState<any>([
    {
      id:null,
      Name: "",
      value: "",
    },
  ]);

  const [startTime, setStartTime] = React.useState<Date | null>(null);
  const [startTimeValue, setStartTimeValue] = React.useState<any>("");
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
  const [rowData2, setRowData] = useState<any>({});
  const [openDialogBox, setOpenDialogBox] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<any>("");
  const [endTimeChanged, setEndTimeChanged] = useState<boolean>(false);
  const [startTimeChanged, setStartTimeChanged] = useState<boolean>(false);
  const [errorEndDate, setErrorEndDate] = useState<any>("");
  const [createPartnerSchedule] = useMutation(PARTNER_SCHEDULE);
  const [deletePartnerSchedule] = useMutation(PARTNER_SCHEDULE_DELETE);
  const [editPartnerSchedule] = useMutation(PARTNER_SCHEDULE_EDIT);


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
    handleDayValidation()
  };

  const endDayChange = (event: any, newValue: any) => {    
    if(startDay &&  newValue && startDay.id  > newValue.id) {
      setIsError((error: any) => ({
        ...error,
        endDay: "End day should be of same week",
      }));
    } else {
      setIsError((error: any) => ({
        ...error,
        endDay: "",
      }));
    }
    setEndDay(newValue);
  };

  const handleStartTimeChange = (date: Date | null | any, value: any) => {
    setStartTimeChanged(true);
    setStartTimeValue(convertTime12to24(value));
    setStartTime(date);
    handleTimeValidation();

  };
  const handleEndTimeChange = (date: Date | null | any, value: any) => {
    console.log("value",value)
    let endTimesValues  = convertTime12to24(value)
    var ms = moment(startTime,"DD/MM/YYYY HH:mm:ss").diff(moment(date,"DD/MM/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var st = !edit ?  startTimeValue.split(":") : moment(startTimeValue).format('HH:mm').split(":") ;
    var et = !edit ? endTimesValues.split(":"): moment(endTimesValues).format('HH:mm').split(":");
    console.log("st[0]",st[0])
    console.log("et[0]",et[0])
    if (st[0] > et[0]) {
      setIsError((error: any) => ({
            ...error,
            endTimeValue: "End time should not be less than start time",
          }));
    }
    else if (startTimeValue == convertTime12to24(value)) {
      setIsError((error: any) => ({
        ...error,
        endTimeValue: "Start time and End time should not be the same",
      }));
    }
    else if(!(Math.floor(d.asHours()) < -4 ) ) {
      setIsError((error: any) => ({
        ...error,
        endTimeValue: "The time difference between start and end time should be at least 4 hours.",
      }));
    }
    else {
      setIsError((error: any) => ({
        ...error,
        endTimeValue: "",
      }));
    }

    setEndTimeChanged(true);
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

  const handleDayValidation = () => {
    let rflag = true
    //  if(startDay.id  > endDay.id) {
      if(startDay &&  endDay && startDay.id  > endDay.id) {

      setIsError((error: any) => ({
        ...error,
        endDay: "End day should be of same week",
      }));
      rflag= false
    }
    return rflag
  }
  const handleTimeValidation = () => {
    let rflag =  true
    var st = !edit ?  startTimeValue.split(":") : moment(startTimeValue).format('HH:mm').split(":") ;
    var et = !edit ? endTimeValue.split(":"): moment(endTimeValue).format('HH:mm').split(":");
    var ms = moment(startTime,"DD/MM/YYYY HH:mm:ss").diff(moment(endTime,"DD/MM/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
 
    if (st[0] > et[0]) {
      rflag= false
      setIsError((error: any) => ({
            ...error,
            endTimeValue: "End time should not be less than start time",
          }));
    }
    else if(!(Math.floor(d.asHours()) < -4 ) ) {
      rflag= false
      setIsError((error: any) => ({
        ...error,
        endTimeValue: "The time difference between start and end time should be at least 4 hours",
      }));
    }
    // var s = d.format("hh:mm:ss");
    else if (startTimeValue == endTimeValue) {
      rflag= false
      // console.log("ERROR")
      setIsError((error: any) => ({
        ...error,
        endTimeValue: "Start time and End time should not be the same",
      }));
    }
  
    return rflag
  }

  const handleSubmitDialogBox = () => {
    setBackdrop(true);
    if (Cookies.getJSON("ob_session")) {
      if(startDay && endDay && startTime && endTimeValue) {
       if(handleTimeValidation() &&  handleDayValidation() ) {
        
      if(!edit) {
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
      createPartnerSchedule({
        variables: {
          input,
        },
      })
        .then((userRes) => {
          setIsError((error: any) => ({
            ...error,
            endTimeValue: "",
          }));
          setShowDialogBox(false);
          setEndTimeChanged(false)
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
          setIsError((error: any) => ({
            ...error,
            endTimeValue: "",
          }));
          setIsError((error: any) => ({
            ...error,
            endDay: "",
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
      }
      if(edit) {
        let input = {
          partnerScheduleId: parseInt(editValue.id),
          startDay: startDay.value,
          endDay: endDay.value,
          // startTime:  !startTimeChanged || endTimeChanged || startTimeValue?.includes("+") || startTimeValue?.includes("-") ? moment(startTimeValue).format('HH:mm:ss') : startTimeValue + ":00",
          endTime: !endTimeChanged ? moment(endTimeValue).format('HH:mm:ss') : endTimeValue + ":00",
          startTime: !startTimeChanged ? moment(startTimeValue).format('HH:mm:ss') : startTimeValue + ":00",
        };
        editPartnerSchedule({
          variables: {
            input,
          },
        })
        .then((userRes) => {
        setShowDialogBox(false);
        setEndTimeChanged(false)
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
            errMessage: "Edit Failed",
          }));
        });

      }
    } else {
      setBackdrop(false)
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: " Validation Error",
      }));
    }
    }else { 
      setBackdrop(false)
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: " Please fill in the required fields",
      }));
    }
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
      obj["id"] = element.node.id
      obj["partnerName"] = element.node.partner.partnerName;
      obj["endDay"] = element.node.endDay;
      obj["StartDay"] = element.node.startDay;
      obj["startTime"] = tConvert(element.node.startTime);
      obj["rawStartTime"] = element.node.startTime;
      obj["endTime"] = tConvert(element.node.endTime);
      obj["rawEndTime"] = element.node.endTime;
      obj["tZone"] = element.node.tZone;
      arr.push(obj);
    });

    setNewData(arr);
  };

  const handleOkay = () => {
    setShowDialogBox(false);
  };

  const handleAddNewSchedule = () => {
    setEdit(false);
    setStartTime(null)
    setStartTimeValue("")
    setEndTime(null)
    setEndTimeValue("")
    setStartDay(null)
    setEndDay(null)
    handleAlertClose();
    setShowDialogBox(true);
    setDialogBoxMsg("");
  };
  const handleEditNewSchedule = (rowData : any) => {
    setStartTimeChanged(false)
    setEndTimeChanged(false)
    setEditValue(rowData)
    let splitPartsrawStartTime = rowData.rawStartTime.split(':');
    let splitPartsrawEndTime = rowData.rawEndTime.split(':');
    setEdit(true);
    // new Date(1970, 1, 1, splitParts[0], splitParts[1]);
    setStartTime(new Date(1970, 1, 1,splitPartsrawStartTime[0], splitPartsrawStartTime[1]))
    setStartTimeValue(new Date(1970, 1, 1,splitPartsrawStartTime[0], splitPartsrawStartTime[1]))
    setEndTime(new Date(1970, 1, 1,splitPartsrawEndTime[0], splitPartsrawEndTime[1]))
    setEndTimeValue(new Date(1970, 1, 1,splitPartsrawEndTime[0], splitPartsrawEndTime[1]))
    let startDayId = 1
    let endDayId = 1
    if(rowData.StartDay === 'Sunday') {
      startDayId = 7
    }
    if(rowData.StartDay === 'Monday') {
      startDayId = 1
    }
    if(rowData.StartDay === 'Tuesday') {
      startDayId = 2
    }
    if(rowData.StartDay === 'Wednesday') {
      startDayId = 3
    }
    if(rowData.StartDay === 'Thursday') {
      startDayId = 4
    }
    if(rowData.StartDay === 'Friday') {
      startDayId = 5
    }
    if(rowData.StartDay === 'Satuday') {
      startDayId = 6
    }
    if(rowData.endDay === 'Sunday') {
      endDayId = 7
    }if(rowData.endDay === 'Monday') {
      endDayId = 1
    }if(rowData.endDay === 'Tuesday') {
      endDayId = 2
    }if(rowData.endDay === 'Wednesday') {
      endDayId = 3
    }if(rowData.endDay === 'Thursday') {
      endDayId = 4
    }if(rowData.endDay === 'Friday') {
      endDayId = 5
    }if(rowData.endDay === 'Satuday') {
      endDayId = 6
    }
    setStartDay({"id":startDayId ,"title": rowData.StartDay ,"value" : rowData.StartDay})
    setEndDay({"id":endDayId,"title": rowData.endDay ,"value" : rowData.endDay})
    setTimezone(rowData.tZone)
    handleAlertClose();
    setShowDialogBox(true);
    setDialogBoxMsg("");
  };

  const handleCancel = () => {
    setStartTimeChanged(false)
    setEndTimeChanged(false)
    setShowDialogBox(false);
    setIsError((error: any) => ({
      ...error,
      endTimeValue: "",
    }));
    setIsError((error: any) => ({
      ...error,
      endDay: "",
    }));
  };

  const handleClose = () => {
    setShowDialogBox(false);
  };

  const onRowClick = (event: any, rowData: any, oldData: any, param: any) => {
    if (param === "Delete") {
      // deletePartnerSchedule{
        handleAlertClose();
        // setShowBackdrop(true);
        setOpenDialogBox(true);
        // setDialogBoxMsg(msgConstant.LINUX_NETWORK_CREDENTIALS);
        setDialogBoxMsg("Are you sure you want to remove ?");
        setRowData(rowData);
      }
      if (param === "Edit") {
        handleEditNewSchedule(rowData)
      }
  }
  const closeDialogBox = () => {
    // setShowBackdrop(false);
    setOpenDialogBox(false);
  };

  const confirmDelete = async () => {
    closeDialogBox();
      // SetTargetDeleted(false);
      deletePartnerSchedule({
      variables: {
        id: rowData2.id
      },
    }).then((res: any) => {
      // setShowBackdrop(false);
      if(res.data.deletePartnerShedule.status == "Partner Schedule Deleted Successfully") {
        // if(propsClientName != undefined) {
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
          // setTimezone(
          //   partnerData.data.getPartnerUserDetails.edges[0].node.partnerId.tZone
          // );
      // }
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: true,
        isFailed: false,
        errMessage: "    " ,
      }));
    }
    // if(res.data.deleteTarget.status === "Target Not Deleted") {
    //   setShowBackdrop(false);
    //   setFormState((formState) => ({
    //     ...formState,
    //     isSuccess: false,
    //     isUpdate: false,
    //     isDelete: false,
    //     isFailed: true,
    //     errMessage: " Unable to delete  " + rowData2.target + " " ,
    //   }));
    // }
    })
    .catch((err) => {
      // setShowBackdrop(false);
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

  }
  return (
    <React.Fragment>
      <CssBaseline />
      {/* <Grid container justifyContent="center"> */}
      <Grid item xs={6}>
      <Typography component="h5" variant="h1">
          Scheduling Configuration 
        </Typography>
        {/* {showDialogBox ?  */}

      <Tooltip
        placement="right"
        title={
          <React.Fragment>
            
            <b> A week is defined as Monday to Sunday. </b>
            <b> <p>You can add two or more schedules.</p> </b> e.g: (If you want to schedule the task from Monday to
              Friday at 10:00 to 19:00, you can use start day as Monday and end
              day as Friday with start time 10:00 to end time 19:00).
            
          </React.Fragment>
        }
      >
        <Info className={styles.CircleIcon2} />
      </Tooltip>
      {/* :null } */}
      </Grid>
      {/* </Grid> */}

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
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} className={styles.disfield}>
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

                <Grid item xs={12} md={4}>
                  <div className={styles.FilterInput}>
                    <AutoCompleteDropDown
                      id="combo-box-demo"
                      options={days}
                      getOptionLabel={(option: any) => option.title}
                      // style={{ width: 300 }}
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

                <Grid item xs={12} md={4}>
                  <div className={styles.FilterInput}>
                    <AutoCompleteDropDown
                      id="combo-box-demo"
                      options={days}
                      getOptionLabel={(option: any) => option.title}
                      // style={{ width: 300 }}
                      onChange={endDayChange}
                      value={endDay}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          label="End Day"
                          variant="outlined"
                          fullWidth
                          className={styles.ReactInput}
                          error={isError.endDay}
                          helperText={isError.endDay}
                        />
                      )}
                    />
                  </div>
                </Grid>

                <Grid item xs={12} md={4}>
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
                      keyboardIcon={<AlarmIcon />}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                      invalidDateMessage={errorEndDate}
                      margin="normal"
                      id="time-picker"
                      label="End Time"
                      value={endTime}
                      onChange={handleEndTimeChange}
                      autoOk={true}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                      error={isError.endTimeValue}
                      helperText={isError.endTimeValue}
                      keyboardIcon={<AlarmIcon />}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
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
          <DialogBox
            open={openDialogBox}
            handleOk={confirmDelete}
            handleCancel={closeDialogBox}
            buttonOk={"Yes"}
            buttonCancel={"No"}
            classes={{
              root: styles.MainOfficeDialogRoot,
              container: styles.MainOfficeDialogboxContainer,
              paper: styles.MainOfficeDialogboxPaper,
              scrollPaper: styles.MainOfficeScrollPaper,
            }}
          >
            <div className={styles.DialogBoxTitle}>
              <Typography component="h1" variant="h1">
                Please Confirm
              </Typography>
            </div>
            <div className={styles.DialogBoxContext}>
              <p>{dialogBoxMsg}</p>
            </div>
          </DialogBox>
          <Paper className={styles.paper}>
            {ipLoading ? <SimpleBackdrop /> : null}
            <div className={styles.ScrollTable}>
              {newData.length !== 0 ? (
                <MaterialTable
                  columns={column}
                  data={newData}
                  actions={[
                    {
                      icon: () => (
                        <img
                          className={styles.EditIcon}
                          src={
                            process.env.PUBLIC_URL + "/icons/svg-icon/edit.svg"
                          }
                          alt="edit icon"
                        />
                      ),
                      tooltip: "Edit",
                      onClick: (event: any, rowData: any, oldData: any) => {
                        onRowClick(event, rowData, oldData, "Edit");
                      },
                    },
                    {
                      icon: () => (
                        <img
                          className={styles.EditIcon}
                          src={
                            process.env.PUBLIC_URL +
                            "/icons/svg-icon/delete.svg"
                          }
                          alt="delete icon"
                        />
                      ),
                      tooltip: "Delete",
                      onClick: (event: any, rowData: any, oldData: any) => {
                        onRowClick(event, rowData, oldData, "Delete");
                      },
                    },
                  ]}
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
                  There are no schedules defined.
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
