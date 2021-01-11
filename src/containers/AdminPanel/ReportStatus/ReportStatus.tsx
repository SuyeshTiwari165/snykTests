import React, { useState, useEffect } from "react";
import styles from "./ReportStatus.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography, FormHelperText } from "@material-ui/core";
import { Button } from "../../../components/UI/Form/Button/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AddEditForm } from "../../../components/UI/AddEditForm/AddEditForm";
import Input from "../../../components/UI/Form/Input/Input";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Alert from "../../../components/UI/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "../../../components/UI/Table/MaterialTable";
import Loading from "../../../components/UI/Layout/Loading/Loading";
import {
  useQuery,
  useMutation,
  FetchResult,
  useLazyQuery,
} from "@apollo/client";
import AutoCompleteDropDown from "../../../components/UI/Form/Autocomplete/Autocomplete";
import * as validations from "../../../common/validateRegex";
import logout from "../../Auth/Logout/Logout";
import { useHistory } from "react-router-dom";
import * as routeConstant from "../../../common/RouteConstants";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../common/MessageConstants";
import TextField from "@material-ui/core/TextField";
import { GET_ADMIN_REPORT_LISTING } from "../../../graphql/queries/ReportListing";


export const ReportStatus: React.FC = (props: any) => {
  const [filterTarget, setFilterTarget] = useState("");
  const [filterPartner, setFilterPartner] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [filterStatus, setFilterStatus] = useState<any | null>();
  const [reset, setReset] = useState<boolean>(false);
  const title = "Listing of Reports ";
  const [newData, setNewData] = useState();

  const columns = [
    {
      title: "Partner Name",
      field: "partnername",
    },
    {
      title: "Client Name",
      field: "clientmame",
    },
    {
      title: "Target",
      field: "target",
    },
    {
      title: "Status",
      field: "status",
    },
    {
      title: "Scan Start Date ",
      field: "scan_start_date ",
      //   sorting: false
    },
    { title: "Scan End Date", field: "scan_end_date" },
    // { title: "Workplan Description", field: "workplan_content" },
  ];
  const {
    data: dataReportListing,
    error: errorReportListing,
    loading: loadingReportListing,
    refetch: refetchReportListing,
  } = useQuery(GET_ADMIN_REPORT_LISTING, {
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
      console.log("DATA",data);
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
      tempArr["scan_start_date"] = "";
      tempArr["end_scan_date"] = "10";
      arr.push(tempArr);
      console.log("ARRRAY",arr);
    }
    return arr;
  }


  const targetFilter = (event: any) => {
    setFilterTarget(event.target.value);
  };
  const clientFilter = (event: any) => {
    setFilterClient(event.target.value);
  };
  const partnerFilter = (event: any) => {
    setFilterPartner(event.target.value);
  };

  const getStatusList = [{ name: "Done" }, { name: "In-Progress" }];
  const getStatus = {
    options: getStatusList,
    getOptionLabel: (option: { name: String }) => option.name,
  };

  const statusFilter = (event: any, newValue: any) => {
    setReset(false);
    setFilterStatus(newValue);
  };

  function handleKeyDown(event: any) {
    if (event.key === "Enter") {
      //   handleSearch();
    }
  }
  const resetForm = () => {
    setReset(true);
    setFilterStatus("");
    setFilterTarget("");
    setFilterClient("");
    setFilterPartner("");
  };
  return (
    <React.Fragment>
      <CssBaseline />
      {/* <main className={styles.layout}> */}
      <Typography component="h5" variant="h1">
        Report Status
      </Typography>
      <Grid className={styles.FilterWrap}>
        <div className={styles.FilterInput}>
          <Input
            label="Partner Name"
            name="partnerName"
            id="partnerName"
            value={filterPartner}
            onChange={partnerFilter}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.FilterInput}>
          <Input
            label="Client Name"
            name="clientName"
            id="clientName"
            value={filterClient}
            onChange={clientFilter}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.FilterInput}>
          <Input
            label="Target"
            name="filterName"
            id="combo-box-demo"
            value={filterTarget}
            onChange={targetFilter}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.FilterInput}>
          <AutoCompleteDropDown
            {...getStatus}
            id="StatusFilter"
            value={reset ? null : filterStatus ? filterStatus : null}
            onChange={statusFilter}
            renderInput={(params: any) => (
              <Input
                {...params}
                id="filterStatus"
                label="Status"
                onKeyDown={handleKeyDown}
              />
            )}
          />
        </div>
        <div>
          <TextField
            id="startDate"
            label="Scan Start Date"
            type="date"
            defaultValue="2021-01-08"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div>
          <TextField
            id="endDate"
            label="Scan End Date"
            type="date"
            defaultValue="2021-01-09"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className={styles.FilterSearchButton}>
          <Button
            color="primary"
            variant="contained"
            // onClick={handleSearch}
          >
            Search
          </Button>
        </div>
        <div className={styles.FilterResetButton}>
          <Button
            color="secondary"
            variant="contained"
            onClick={resetForm}
          >
            reset
          </Button>
        </div>
      </Grid>
      <Paper className={styles.paper}>
        <MaterialTable
          title={title}
          columns={columns}
          data={newData}
          // actions={[
          //   // {
          //   //   icon: () => (
          //   //     <img
          //   //       className={styles.EditIcon}
          //   //       src={process.env.PUBLIC_URL + "/icons/svg-icon/edit.svg"}
          //   //       alt="edit icon"
          //   //     />
          //   //   ),
          //   //   tooltip: "Edit",
          //   //   onClick: (event: any, rowData: any) => {
          //   //     // handleClickOpen(rowData);
          //   //   },
          //   // },
          // ]}
          // editable={{
          //   onRowDelete: (oldData: any) =>
          //     new Promise((resolve: any) => {
          //       resolve();
          //       // deleteTableRow(oldData);
          //     }),
          // }}
          options={{
            thirdSortClick: false,
            actionsColumnIndex: -1,
            paging: true,
            sorting: true,
            search: false,
            filter: true,
            pageSize: 25,
            draggable: false,
            pageSizeOptions: [25, 50, 75, 100],
          }}
        />
      </Paper>
    </React.Fragment>
  );
};

export default ReportStatus;
