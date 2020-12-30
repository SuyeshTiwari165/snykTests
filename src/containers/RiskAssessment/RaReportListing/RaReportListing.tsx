import React, { useState, useEffect } from "react";
import styles from "./RaReportListing.module.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Button } from "../../../components/UI/Form/Button/Button";
import Loading from "../../../components/UI/Layout/Loading/Loading";
import MaterialTable from "../../../components/UI/Table/MaterialTable";
import { useQuery, useMutation } from "@apollo/client";
import { Grid } from "@material-ui/core";
import AutoCompleteDropDown from "../../../components/UI/Form/Autocomplete/Autocomplete";
import SyncIcon from "@material-ui/icons/Sync";
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { GET_REPORT_LISTING } from "../../../graphql/queries/ReportListing";
import * as routeConstant from "../../../common/RouteConstants";
import { useHistory } from "react-router-dom";
import { RA_REPORT_DOWNLOAD } from "../../../config/index";

export const RaReportListing: React.FC = (props: any) => {
  // console.log(
  //   "------Row data in props RAReportListing",
  //   props.location.state.clientInfo.clientId
  // );
  const history = useHistory();
  const [newData, setNewData] = useState();

  //table
  const columns = [
    { title: "Target", field: "target" },
    { title: "Status", field: "status" },
  ];

  const title = "Listing of Reports";
  const [filters, setFilters] = useState<any>({});
  const [orderBy, setOrderBy] = useState<String>();
  //static values
  const propsClientId = parseInt(props.location.state.clientInfo.clientId);
  const clientInfo = props.location.state.clientInfo;

  //filter query condition declaration
  const {
    data: dataReportListing,
    error: errorReportListing,
    loading: loadingReportListing,
    refetch: refetchReportListing,
  } = useQuery(GET_REPORT_LISTING, {
    variables: {
      clientid: propsClientId,
    },
  });

  useEffect(() => {
    if (dataReportListing) {
      let distinctTargetArray: any = [];
      distinctTargetArray = convertTargetArray(
        dataReportListing.getReportStatus.edges
      );
      let temp: any = {};
      temp = convertTableData(
        dataReportListing.getReportStatus.edges,
        distinctTargetArray
      );
      setNewData(temp);
    }
    if (props.location.state) {
      if (props.location.state.refetchData) {
        refetchReportListing();
      }
    }
  }, [dataReportListing]);

  //for task data
  if (loadingReportListing) return <Loading />;
  if (errorReportListing) {
    return <div className="error">Error!</div>;
  }
  function convertTargetArray(data: any) {
    const targetObj = new Set(
      data.map((x: any) => x.node.vatTargetId.targetName)
    );
    // let array = [...targetObj];
    let array: any = [];
    targetObj.forEach((v) => array.push(v));
    return array;
  }

  function convertTableData(data: any, targetArr: any) {
    let arr: any = [];
    for (let i in targetArr) {
      let tempArr: any = {};
      tempArr["target"] = targetArr[i];
      let statusVar = false;
      let targetId = 0;
      for (let j in data) {
        if (targetArr[i] === data[j].node.vatTargetId.targetName) {
          if (
            data[j].node.scanRunStatus !== "Done" ||
            data[j].node.scanRunStatus === "In Progress"
          ) {
            statusVar = true;
          }
          targetId = data[j].node.vatTargetId.id;
        }
      }
      tempArr["targetId"] = targetId !== 0 ? targetId : null;
      tempArr["status"] = statusVar ? "In Progress" : "Done";
      arr.push(tempArr);
    }
    return arr;
  }
  const handleClickView = (rowData: any) => {
    history.push({
      pathname: routeConstant.REPORT_STATUS,
      state: { targetName: rowData.target, clientInfo: clientInfo },
    });
  };

  const handleClickOpen = (rowData: any) => {
    history.push({
      pathname: routeConstant.TARGET,
      state: { targetName: rowData.target, clientInfo: clientInfo },
    });
  };
  const handleDownload = (rowData: any) => {
    let intTargetId = parseInt(rowData.targetId);
    const DocUrl =
      RA_REPORT_DOWNLOAD + "?cid=" + propsClientId + "&tid=" + intTargetId;
    window.open(DocUrl);
    // window.open(
    //   "https://ra-in-a-box.wastaging.com/reports/download_report/?cid=2&tid=24"
    // );
  };

  const handleAddNewReport = () => {
    let data = {};
    data = { clientInfo: clientInfo };
    history.push(routeConstant.TARGET, data);
  };

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

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        Report List
      </Typography>
      <Grid>
        <Grid className={styles.FilterWrap}>
          <div className={styles.FilterAddButton}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleAddNewReport}
            >
              <AddCircleIcon />
              &nbsp; New Risk Assessment
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
            actions={[
              {
                icon: () => <VisibilityIcon />,
                tooltip: "View Data",
                onClick: (event: any, rowData: any) => {
                  handleClickView(rowData);
                },
              },
              (rowData: any) => ({
                disabled: rowData.status !== "Done",
                icon: () => <SyncIcon />,
                tooltip: "Re-run",
                onClick: (event: any, rowData: any) => {
                  handleClickOpen(rowData);
                },
              }),
              (rowData: any) => ({
                disabled: rowData.status !== "Done",
                icon: () => <GetAppIcon />,
                tooltip: "Download",
                onClick: (event: any, rowData: any) => {
                  handleDownload(rowData);
                },
              }),
            ]}
          />
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default RaReportListing;
