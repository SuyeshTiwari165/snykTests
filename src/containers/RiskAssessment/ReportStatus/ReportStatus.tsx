import React, { useState, useEffect } from "react";
import styles from "./ReportStatus.module.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Button } from "../../../components/UI/Form/Button/Button";
import { GET_REPORT_LISTING } from "../../../graphql/queries/ReportListing";
import SimpleBackdrop from "../../../components/UI/Layout/Backdrop/Backdrop";
import MaterialTable from "../../../components/UI/Table/MaterialTable";
import { useQuery, useMutation } from "@apollo/client";
import { Grid } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import * as routeConstant from "../../../common/RouteConstants";
import { useHistory } from "react-router-dom";
import Logout from "../../Auth/Logout/Logout";
import Cookies from 'js-cookie';

export const ReportStatus: React.FC = (props: any) => {
  const history = useHistory();
  const [newData, setNewData] = useState();
  const clientInfo = props.location.state ? props.location.state.clientInfo : null;
  // console.log("props.location.stat", props.location.state)
  //table
  const columns = [
    { title: "Target", field: "target" },
    { title: "Task", field: "task" },
    { title: "Scan start date", field: "scanStartDate" },
    { title: "Scan end date", field: "scanEndDate" },
    { title: "Status", field: "status" },
  ];
  //show password
  const title = "Listing of Report Status";
  const [orderBy, setOrderBy] = useState<String>();

  const staticClientName = clientInfo !== null ? clientInfo.name : undefined;
  const targetName = props.location.state.targetName;
  // const targetData = props["location"].state.target;
  const {
    data: dataReportListing,
    error: errorReportListing,
    loading: loadingReportListing,
    refetch: refetchReportListing,
  } = useQuery(GET_REPORT_LISTING, {
    variables: {
      clientname: staticClientName,
      targetid: targetName,
    },
  });
  const getDateAndTime = (utcDate: any) => {
    if (utcDate === "" || utcDate === null) {
      return null;
    } else {
      var dateFormat: any = new Date(utcDate);
      var hours = dateFormat.getHours();
      var minutes = dateFormat.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      var dateAndTime = convertDate(new Date(utcDate)) + " " + strTime;
      console.log(convertDate(new Date(utcDate)))
      return dateAndTime;
    }
  };

  function convertDate(inputFormat: any) {
    function pad(s: any) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  }

  useEffect(() => {
    if (Cookies.getJSON("ob_session")) { 
      refetchReportListing();
    } else{
      Logout();
    }
    
  }, []);
  
  useEffect(() => {
    if (dataReportListing) {
      let temp: any = {};
      temp = convertTableData(dataReportListing.getReportStatus.edges);
      setNewData(temp);
    }
  }, [dataReportListing]);

  //for task data
  // if (loadingReportListing) return <Loading />;
  if (errorReportListing) {
    // return <div className="error">Error!</div>;
    Logout();
  }

  function convertTableData(data: any) {
    let arr: any = [];
    for (let i in data) {
      let tempArr: any = {};
      tempArr["partner"] = data[i].node.partnerId;
      tempArr["client"] = data[i].node.clientId;
      tempArr["target"] = data[i].node.vatTargetId
        ? data[i].node.vatTargetId.targetName
        : null;
      tempArr["task"] = data[i].node.vatTaskId
        ? data[i].node.vatTaskId.taskName
        : null;
      tempArr["scanEndDate"] = getDateAndTime(data[i].node.scanEndDate);
      tempArr["scanStartDate"] = getDateAndTime(data[i].node.scanStartDate);
      tempArr["status"] = data[i].node.scanRunStatus;
      arr.push(tempArr);
    }
    return arr;
  }
  const orderFunc = (orderedColumnId: any, orderDirection: any) => {
    let orderByColumn;
    let orderBy = "";
    if (orderedColumnId >= 0) {
      if (columns[orderedColumnId]["field"] === "name") {
        orderByColumn = "name";
      }
      // if (columns[orderedColumnId]["field"] === "category") {
      //   orderByColumn = "category";
      // }
      // if (columns[orderedColumnId]["field"] === "is_active") {
      //   orderByColumn = "is_active";
      // }
    }
    orderBy = orderByColumn + ":" + orderDirection;
    setOrderBy(orderBy);
  };
  const handleBack = () => {
    let data = {};
    data = { clientInfo: clientInfo };
    history.push(routeConstant.RA_REPORT_LISTING, data);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        Task Status
      </Typography>
      {/* {!targetData.publish ?
        <Typography component="h5" variant="h3">
          Report Not Published !
      </Typography> : null} */}
      <Grid>
      {loadingReportListing ? <SimpleBackdrop/>: null}
        <Grid className={styles.FilterWrap}>
          <div className={styles.backToListButton}>
            <Button color="secondary" variant="contained" onClick={handleBack}>
              <img
                src={process.env.PUBLIC_URL + "/icons/svg-icon/back-list.svg"}
                alt="user icon"
              />
              &nbsp; Back to list
            </Button>
          </div>
        </Grid>
        <Paper className={styles.paper}>
          <div className={styles.report_table}>
          <MaterialTable
            title={title}
            columns={columns}
            data={newData}
            options={{
              headerStyle: {
                background: 'linear-gradient(#fef9f5,#fef9f5)',
              
               
              },
              actionsColumnIndex: -1,
              paging: true,
              sorting: true,
              search: false,
              filter: true,
              draggable: false,
              pageSize: 25,
              pageSizeOptions: [25, 50, 75, 100], // rows selection options     
            }}
            onOrderChange={(orderedColumnId: any, orderDirection: any) => {
              orderFunc(orderedColumnId, orderDirection);
            }}
          /></div>
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default ReportStatus;
