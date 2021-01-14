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
import moment from "moment";
import { GET_PARTNER } from "../../../graphql/queries/Partners";
import { GET_CLIENTS } from "../../../graphql/queries/Client";
import { GET_TARGET_ADMIN } from "../../../graphql/queries/Target";

interface Partners {
  id: number;
  name: string;
}

export const ReportStatus: React.FC = (props: any) => {
  const [filterName, setFilterName] = useState("");
  const [filters, setFilters] = useState<object>();
  const [filterTarget, setFilterTarget] = useState<any>("");
  const [filterPartner, setFilterPartner] = useState<any>([
    {
      partner_id: "",
      name: "",
    },
  ]);
  const [filterClient, setFilterClient] = useState<any>([
    {
      clientName: "",
      clientid: null,
    },
  ]);
  const [filterStatus, setFilterStatus] = useState<any | null>();
  const [reset, setReset] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [getPartnerNameList, setPartnerNameList] = useState([]);
  const [getClientNameList, setClientNameList] = useState([]);
  const [getTargetNameList, setTargetNameList] = useState([]);

  const title = "Listing of Reports ";
  const [newData, setNewData] = useState();

  const columns = [
    {
      title: "Partner Name",
      field: "partnername",
    },
    {
      title: "Client Name",
      field: "clientname",
    },
    {
      title: "Target",
      field: "target",
    },
    { title: "Task Name", field: "taskName" },
    {
      title: "Status",
      field: "status",
    },
    {
      title: "Scan Start Date ",
      field: "scan_start_date"
    },
    { title: "Scan End Date", field: "scan_end_date" },
  ];

  const [
    getReportList,
    { data: dataReportListing, loading: loadingReportListing },
  ] = useLazyQuery(GET_ADMIN_REPORT_LISTING, {
    fetchPolicy: "cache-and-network",
    onError: () => {
      // logout();
    },
    onCompleted: () => {},
  });
  const { data: Org, loading: loadOrg, refetch: refetchOrg } = useQuery(
    GET_PARTNER,
    {
      onCompleted: (data: any) => {
        if (Org.getPartner.edges != null || Org.getPartner.edges != undefined) {
          let arr: any = [];
          Org.getPartner.edges.map((element: any, index: any) => {
            let obj: any = {};
            obj["partner_id"] = element.node.id;
            obj["name"] = element.node.partnerName;
            arr.push(obj);
          });
          setPartnerNameList(arr);
        }
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const [getClients, { data: ipData, loading: ipLoading }] = useLazyQuery(
    GET_CLIENTS,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: (data) => {
        if (
          data.getClient.edges != null ||
          ipData.getClient.edges != undefined
        ) {
          let arr: any = [];
          ipData.getClient.edges.map((element: any, index: any) => {
            let obj: any = {};
            obj["name"] = element.node.clientName;
            obj["clientid"] = element.node.id;
            arr.push(obj);
          });
          setClientNameList(arr);
        }
      },
      onError: (error) => {
        // logout()
      },
    }
  );

  const [getTargets, { data: targetData, loading: targetLoading }] = useLazyQuery(
    GET_TARGET_ADMIN,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: (data) => {
        if (data.getTarget.edges != null || data.getTarget.edges != undefined) {
          let arr: any = [];
          data.getTarget.edges.map((element: any, index: any) => {
            let obj: any = {};
            obj["name"] = element.node.targetName;
            obj["targetid"] = element.node.vatTargetId;
            arr.push(obj);
          });
          setTargetNameList(arr);
        }
      }
    });

  // const {
  //   data: targetData,
  //   error: targetError,
  //   loading: targetLoading,
  //   refetch: refetchTargetData,
  // } = useQuery(GET_TARGET_ADMIN, {
  //   onCompleted: (data) => {
  //     if (data.getTarget.edges != null || data.getTarget.edges != undefined) {
  //       let arr: any = [];
  //       data.getTarget.edges.map((element: any, index: any) => {
  //         let obj: any = {};
  //         obj["name"] = element.node.targetName;
  //         obj["targetid"] = element.node.vatTargetId;
  //         arr.push(obj);
  //       });
  //       setTargetNameList(arr);
  //     }
  //   },
  //   notifyOnNetworkStatusChange: true,
  //   fetchPolicy: "cache-and-network",
  // });

  useEffect(() => {
    getReportList();
  }, []);

  useEffect(() => {
    getReportList({
      variables: {
        targetid: filterTarget ? filterTarget.name : null,
        status: filterStatus ? filterStatus.name : null,
        partnername: filterPartner ? filterPartner.name : null,
        clientname: filterClient ? filterClient.name : null,
        scanEndDate: endDate ? moment(endDate).format("YYYY-MM-DDT23:00:00") : null,
        scanStartDate :startDate ? moment(startDate).format("YYYY-MM-DDT00:00:00") : null,
      },
    });

  }, [filters]);

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
        // refetchReportListing();
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
    let arr: any = [];
    for (let i in targetArr) {
      let tempArr: any = {};
      tempArr["target"] = targetArr[i];
      let statusVar = false;
      let targetId = 0;
      let scanEndDate = "";
      let scanStartDate = "";
      let taskName = "";
      let clientname = "";
      let partnername = "";
      for (let j in data) {
        if (targetArr[i] === data[j].node.vatTargetId.targetName) {
          if (
            data[j].node.scanRunStatus !== "Done" ||
            data[j].node.scanRunStatus === "In Progress"
          ) {
            statusVar = true;
          }
          targetId = data[j].node.vatTargetId.id;
          scanEndDate = !data[j].node.scanStartDate
            ? "-"
            : moment(data[j].node.scanEndDate).format("MM/DD/YYYY hh:mm a");
          scanStartDate = !data[j].node.scanStartDate
            ? "-"
            : moment(data[j].node.scanStartDate).format("MM/DD/YYYY hh:mm a");
          taskName = data[j].node.vatTaskId.taskName;
          clientname = data[j].node.vatTargetId.client.clientName;
          partnername = data[j].node.vatTargetId.partner.partnerName;
        }
      }
      tempArr["targetId"] = targetId !== 0 ? targetId : null;
      tempArr["status"] = statusVar ? "In Progress" : "Done";
      tempArr["scan_start_date"] = scanStartDate;
      tempArr["scan_end_date"] = scanEndDate;
      tempArr["taskName"] = taskName ? taskName : null;
      tempArr["partnername"] = partnername ? partnername : null;
      tempArr["clientname"] = clientname ? clientname : null;
      arr.push(tempArr);
    }
    return arr;
  }

  const targetFilter = (event: any, newValue: any) => {
    setFilterTarget(newValue);
  };
  const clientFilter = (event: any, newValue: any) => {
    setReset(false);
    setFilterClient(newValue);
    if(newValue != null && newValue.name && filterPartner != null && filterPartner.name ) {
    getTargets({
      variables: {
        clientName : newValue.name,
        partnerName :filterPartner.name
      },
    })
  }
}
  const partnerFilter = (event: any, newValue: any) => {
    setReset(false);
    setFilterPartner(newValue);
    if(newValue != null && newValue.partner_id ) {
    getClients({
      variables: {
        partnerId: newValue.partner_id,
      },
    });
  }
  };
  const startDateFilter = (event: any) => {
    // console.log("STARTDATe",moment(event.target.value).format(
    //   "YYYY-MM-DDTHH:mm:ss+00"
    // ));
    setStartDate(event.target.value);
    // YYYY-MM-DDTHH:mm
  };
  const endDateFilter = (event: any) => {
    // console.log("enddate",moment(event.target.value).format(
    //   "YYYY-MM-DDT24:60:99+99"
    // ));
    setEndDate(event.target.value);
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
      handleSearch();
    }
  }
  const resetForm = () => {
    setReset(true);
    setFilterStatus("");
    setFilterTarget("");
    setFilterClient("");
    setFilterPartner("");
    setStartDate("");
    setEndDate("");
  };

  const handleSearch = () => {
    let searchData: any = {};
    if (filterName) {
      searchData["name_contains"] = filterName.toString();
    }
    if (
      filterTarget !== undefined &&
      filterTarget !== null &&
      Object.keys(filterTarget).length !== 0
    ) {
      // console.log("filterCategory issue");
      searchData["target"] = filterTarget;
    }
    if (
      filterPartner !== undefined &&
      filterPartner !== null &&
      Object.keys(filterPartner).length !== 0 &&
      filterPartner !== null
    ) {
      searchData["partner"] = filterPartner;
    }
    if (
      filterClient !== undefined &&
      filterClient !== null &&
      Object.keys(filterClient).length !== 0 &&
      filterClient !== null
    ) {
      // console.log("filterCategory issue");
      searchData["client"] = filterClient;
    }
    if (
      filterStatus !== undefined &&
      filterStatus !== null
      // filterStatus.length > 0
    ) {
      let reportStatusArr = [];
      for (let i in filterStatus) {
        reportStatusArr.push(filterStatus[i]);
      }
      searchData["report_status_in"] = reportStatusArr;
    }
    if (
      startDate !== undefined &&
      startDate !== null &&
      Object.keys(startDate).length !== 0 &&
      startDate !== null
    ) {
      // console.log("filterCategory issue");
      searchData["startDate"] = startDate;
    }
    if (
      endDate !== undefined &&
      endDate !== null &&
      Object.keys(endDate).length !== 0 &&
      endDate !== null
    ) {
      // console.log("filterCategory issue");
      searchData["endDate"] = endDate;
    }

    // if (
    //   filterCompanyType !== undefined &&
    //   filterCompanyType !== null &&
    //   filterCompanyType.length > 0
    // ) {
    //   let companyTypeArr = [];
    //   for (let i in filterCompanyType) {
    //     companyTypeArr.push(filterCompanyType[i].id);
    //   }
    //   searchData["company_type_in"] = companyTypeArr;
    // }

    // console.log("searchData", searchData);

    setFilters(searchData);
    // console.log(filters)
    // refetchReportListing();
  };

  const getPartnerName = {
    options: getPartnerNameList,
    getOptionLabel: (option: { name: String }) => option.name,
  };
  const getClientName = {
    options: getClientNameList,
    getOptionLabel: (option: { name: String }) => option.name,
  };
  const getTargetName = {
    options: getTargetNameList,
    getOptionLabel: (option: { name: String }) => option.name,
  };
  if (loadingReportListing) return <Loading />;
  return (
    <React.Fragment>
      <CssBaseline />
      {/* <main className={styles.layout}> */}
      <Typography component="h5" variant="h1">
        Report Status
      </Typography>
      <Grid className={styles.FilterWrap}>
        {/* <div className={styles.FilterInput}>
          <Input
            label="Partner Name"
            name="partnerName"
            id="partnerName"
            value={filterPartner}
            onChange={partnerFilter}
            onKeyDown={handleKeyDown}
          />
        </div> */}

        <div className={styles.FilterInput}>
          <AutoCompleteDropDown
            {...getPartnerName}
            id="partnerName"
            value={reset ? null : filterPartner ? filterPartner : null}
            onChange={partnerFilter}
            renderInput={(params: any) => (
              <Input
                {...params}
                id="PartnerFilter"
                label="Partner"
                onKeyDown={handleKeyDown}
              />
            )}
          />
        </div>

        <div className={styles.FilterInput}>
          <AutoCompleteDropDown
            {...getClientName}
            id="clientName"
            value={reset ? null : filterClient != null ? filterClient : null}
            onChange={clientFilter}
            renderInput={(params: any) => (
              <Input
                {...params}
                id="ClientFilter"
                label="Client"
                onKeyDown={handleKeyDown}
              />
            )}
          />
        </div>
        {/*             
        <div className={styles.FilterInput}>
          <Input
            label="Target"
            name="filterName"
            id="combo-box-demo"
            value={filterTarget}
            onChange={targetFilter}
            onKeyDown={handleKeyDown}
          />
        </div> */}

        <div className={styles.FilterInput}>
          <AutoCompleteDropDown
            {...getTargetName}
            id="clientName"
            value={reset ? null : filterTarget != null ? filterTarget : null}
            onChange={targetFilter}
            renderInput={(params: any) => (
              <Input
                {...params}
                id="filterTarget"
                label="Target"
                onKeyDown={handleKeyDown}
              />
            )}
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
            value={startDate}
            onChange={startDateFilter}
            // defaultValue="2021-01-08"
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
            value={endDate}
            onChange={endDateFilter}
            // defaultValue="2021-01-09"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className={styles.FilterSearchButton}>
          <Button color="primary" variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </div>
        <div className={styles.FilterResetButton}>
          <Button color="secondary" variant="contained" onClick={resetForm}>
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
