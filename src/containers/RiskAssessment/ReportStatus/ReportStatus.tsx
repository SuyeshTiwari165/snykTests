import React, { useState, useEffect } from "react";
import styles from "./ReportStatus.module.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Button } from "../../../components/UI/Form/Button/Button";
// import Input from "../../../components/UI/Form/Input/Input";
import { GET_REPORT_LISTING } from "../../../graphql/queries/ReportListing";
// import { GET_TASK_DETAILS } from "../../../graphql/queries/TaskDetails";
// import { GET_SCAN_CONFIG } from "../../../graphql/queries/ScanConfig";
// import { GET_SCANDATA } from "../../../graphql/queries/ScanData";
// import { GET_TARGET } from "../../../graphql/queries/Target";
import Loading from "../../../components/UI/Layout/Loading/Loading";
import MaterialTable from "../../../components/UI/Table/MaterialTable";
import { useQuery, useMutation } from "@apollo/client";
import { Grid } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
// import AutoCompleteDropDown from "../../../components/UI/Form/Autocomplete/Autocomplete";
// import TextField from "@material-ui/core/TextField";
// import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import * as routeConstant from "../../../common/RouteConstants";
import { useHistory } from "react-router-dom";

export const ReportStatus: React.FC = (props: any) => {
  const history = useHistory();
  const [newData, setNewData] = useState();

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

  const staticClientId = 2;
  const targetName = props["location"].state.targetName;
  console.log("var var", targetName, staticClientId);
  const {
    data: dataReportListing,
    error: errorReportListing,
    loading: loadingReportListing,
    // refetch: refetchReportListing,
  } = useQuery(GET_REPORT_LISTING, {
    variables: {
      clientid: staticClientId,
      targetid: targetName,
    },
  });
  const getDateAndTime = (utcDate: any) => {
    if (utcDate === "" || utcDate === null) {
      return null;
    } else {
      var date: any = new Date(utcDate);
      var dd = date.getDate();
      var mm = date.getMonth();
      var yy = date.getFullYear();
      var hh = date.getHours();
      var min = date.getMinutes();
      var dateAndTime = dd + "/" + mm + "/" + yy + " " + hh + ":" + min;
      return dateAndTime;
    }
  };

  useEffect(() => {
    if (dataReportListing) {
      let temp: any = {};
      temp = convertTableData(dataReportListing.getReportStatus.edges);
      console.log("data status", dataReportListing.getReportStatus.edges);
      setNewData(temp);
    }
  }, [dataReportListing]);

  //for task data
  if (loadingReportListing) return <Loading />;
  if (errorReportListing) {
    return <div className="error">Error!</div>;
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
    history.push(routeConstant.RA_REPORT_LISTING);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        Report Status
      </Typography>
      <Grid>
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
          <MaterialTable
            title={title}
            columns={columns}
            data={newData}
            options={{
              actionsColumnIndex: -1,
              paging: true,
              sorting: true,
              search: false,
              filter: true,
            }}
            onOrderChange={(orderedColumnId: any, orderDirection: any) => {
              orderFunc(orderedColumnId, orderDirection);
            }}
          />
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default ReportStatus;
