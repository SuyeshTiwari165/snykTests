import React, { useState, useEffect } from "react";
import styles from "./ReportStatus.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography} from "@material-ui/core";
import { Button } from "../../../components/UI/Form/Button/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Input from "../../../components/UI/Form/Input/Input";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "../../../components/UI/Table/MaterialTable";
import Loading from "../../../components/UI/Layout/Loading/Loading";
import {
  useQuery,
  useLazyQuery,
} from "@apollo/client";
import SimpleBackdrop from "../../../components/UI/Layout/Backdrop/Backdrop";
import AutoCompleteDropDown from "../../../components/UI/Form/Autocomplete/Autocomplete";
import logout from "../../Auth/Logout/Logout";
import TextField from "@material-ui/core/TextField";
import { GET_ADMIN_REPORT_LISTING } from "../../../graphql/queries/ReportListing";
import moment from "moment";
import { GET_PARTNER } from "../../../graphql/queries/Partners";
import { GET_CLIENTS } from "../../../graphql/queries/Client";
import { GET_TARGET_ADMIN } from "../../../graphql/queries/Target";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import DateFnsUtils from '@date-io/date-fns';
import { GET_TASK_DETAILS } from "../../../graphql/queries/TaskDetails";


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
  const [filterTaskName, setFilterTaskName] = useState<any>([
    {
      taskName: "",
      taskId: null,
    },
  ]);
  const [filterStatus, setFilterStatus] = useState<any | null>();
  const [targetFilterStatus, setTargetFilterStatus] = useState<any | null>();
  const [reset, setReset] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [getPartnerNameList, setPartnerNameList] = useState([]);
  const [getClientNameList, setClientNameList] = useState([]);
  const [getTargetNameList, setTargetNameList] = useState([]);
  const [getTaskNameList, setTaskNameList] = useState([]);

  const title = "Listing of Reports ";
  const [newData, setNewData] = useState();
  useEffect(()=>{
    getPartners({ 
      variables: {
        orderBy : "partner_name"
      },
      })
  },[])
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
    {
      title: "Target Status",
      field: "targetStatus",
    },
    { title: "Task Name", field: "taskName" },
    {
      title: "Task Status",
      field: "status",
    },
    {
      title: "Scan Start Date ",
      field: "scan_start_date"
    },
    { title: "Scan End Date", field: "scan_end_date" },
  ];

  const [startSelectedDate, setStartSelectedDate] = React.useState<Date | null>(
    // new Date('2014-08-18T21:11:54'),
  );
  const [endSelectedDate, setEndSelectedDate] = React.useState<Date | null>();
  
  const handleDateChange = (date : any) => {
    setStartSelectedDate(date);
    setStartDate(date);
  };
  const handleEndDateChange = (date : any) => {
    setEndSelectedDate(date);
    setEndDate(date);
  };
  const [
    getReportList,
    { data: dataReportListing, loading: loadingReportListing },
  ] = useLazyQuery(GET_ADMIN_REPORT_LISTING, {
    fetchPolicy: "cache-and-network",
    onError: () => {
      logout();
    },
    onCompleted: () => {},
  });
    const [getPartners, { data: Org, loading: loadOrg}] = useLazyQuery(GET_PARTNER, {
      onCompleted: (data: any) => {
        console.log("data",data)
        if (data.getPartner.edges != null || data.getPartner.edges != undefined) {
          let arr: any = [];
          data.getPartner.edges.map((element: any, index: any) => {
            let obj: any = {};
            obj["partner_id"] = element.node.id;
            obj["name"] = element.node.partnerName;
            arr.push(obj);
          });
          setPartnerNameList(arr);
        }
      },
      onError: () => {
        logout();
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

    const [getTasks, { data: taskData, loading: taskLoading }] = useLazyQuery(
      GET_TASK_DETAILS, {
        fetchPolicy: "cache-and-network",
      onCompleted: (data: any) => {
        if (data.getTask.edges[0]) {
          console.log("data.getTask.edges[0]", data.getTask.edges)
        }
        if (
          data.getTask.edges != null ||
          taskData.getTask.edges != undefined
        ) {
          let arr: any = [];
          taskData.getTask.edges.map((element: any, index: any) => {
            let obj: any = {};
            obj["name"] = element.node.taskName;
            obj["id"] = element.node.id;
            arr.push(obj);
          });
          setTaskNameList(arr);
        }
      },
    }
    );

  useEffect(() => {
    setStartSelectedDate(new Date())
    setEndSelectedDate(new Date())
    setStartDate(new Date())
    setEndDate(new Date())
    getReportList({
      variables: {
        orderBy : "-scan_start_date",
        scanEndDate: moment(new Date()).format("YYYY-MM-DDT23:00:00") ,
        scanStartDate : moment(new Date()).format("YYYY-MM-DDT00:00:00") ,
      }
    });

  }, []);

  useEffect(() => {
    if(filters != null || filters != undefined) {
      console.log("filterTaskName",filterTaskName)
    getReportList({
      variables: {
        orderBy : "-scan_start_date",
        targetid: filterTarget ? filterTarget.name : null,
        status: filterStatus ? filterStatus.name : null,
        partnername: filterPartner ? filterPartner.name : null,
        clientname: filterClient ? filterClient.name : null,
        scanEndDate: endDate ? moment(endDate).format("YYYY-MM-DDT23:00:00") : null,
        scanStartDate :startDate ? moment(startDate).format("YYYY-MM-DDT00:00:00") : null,
        targetstatus : targetFilterStatus ? targetFilterStatus.name : null,
        taskname :filterTaskName ? filterTaskName.name : null,
      },
    });
  }
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
  }, [dataReportListing]);

  function convertTargetArray(data: any) {
    const targetObj = new Set(
      data.map((x: any) => x.node.vatTargetId.targetName)
    );
    let array: any = [];
    targetObj.forEach((v) => array.push(v));
    return array;
  }

  function convertTableData(data: any, targetArr: any) {
    let arr: any = [];
    console.log("DATA",data);
    data.map((element: any) => {
      let obj: any = {};
      obj["target"] = element.node.vatTargetId ? element.node.vatTargetId.targetName : null;
      obj["status"] = element.node.scanRunStatus ? element.node.scanRunStatus : null;
      obj["scan_start_date"] =element.node.scanStartDate ? moment(element.node.scanStartDate).format("MM/DD/YYYY hh:mm a") : "-";
      obj["scan_end_date"] =element.node.scanEndDate ? moment(element.node.scanEndDate).format("MM/DD/YYYY hh:mm a"): "-";
      obj["taskName"] = element.node.vatTaskId ? element.node.vatTaskId.taskName : null;
      obj["partnername"] = element.node.vatTargetId.partner ? element.node.vatTargetId.partner.partnerName : null;
      obj["clientname"] = element.node.vatTargetId.client ? element.node.vatTargetId.client.clientName : null;
      obj["targetStatus"] = element.node.vatTargetId.targetStatus ? element.node.vatTargetId.targetStatus.name : null;
      arr.push(obj);
    });
    return arr
   };

  const targetFilter = (event: any, newValue: any) => {
    setFilterTarget(newValue);

    if(newValue != null && newValue.name) {
    getTasks({
      variables: {
         targetName: newValue ? newValue.name : null,
      },
    })
    console.log("call Tasks",newValue);
  }
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

const taskNameFilter = (event: any, newValue: any) => {
  setReset(false);
  setFilterTaskName(newValue);
}

  const partnerFilter = (event: any, newValue: any) => {
    setReset(false);
    setFilterPartner(newValue);
    setFilterStatus("");
    setTargetFilterStatus("")
    setFilterTarget("");
    setFilterClient("");
    setFilterTaskName("")
    setStartDate(new Date());
    setStartSelectedDate(new Date())
    setEndDate(new Date());
    setEndSelectedDate(new Date())
    if(newValue != null && newValue.name ) {
    getClients({
      variables: {
        orderBy : "client_name",
        partnerId_PartnerName: newValue.name,
      },
    });
  }
  };

  const getStatusList = [
    { name: "Done" },
    { name: "In Progress" },
    { name: "Scheduled" },
  ];

  const getTargetStatusList = [
    { name: "Scheduled" },
    { name: "In Progress" },
    { name: "Scan Completed" },
    { name: "Generating Report" },
    { name: "Report Generated" },
  ];

  const getStatus = {
    options: getStatusList,
    getOptionLabel: (option: { name: String }) => option.name,
  };
  const getTargetStatus = {
    options: getTargetStatusList,
    getOptionLabel: (option: { name: String }) => option.name,
  };
  

  const statusFilter = (event: any, newValue: any) => {
    setReset(false);
    setFilterStatus(newValue);
  };

  const statusTargetFilter = (event: any, newValue: any) => {
    setReset(false);
    setTargetFilterStatus(newValue);
  };
  

  function handleKeyDown(event: any) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }
  const resetForm = () => {
    setReset(true);
    setFilterStatus("");
    setTargetFilterStatus("")
    setFilterTarget("");
    setFilterClient("");
    setFilterTaskName("")
    setFilterPartner("");
    setStartSelectedDate(new Date())
    setEndSelectedDate(new Date())
    setStartDate(new Date())
    setEndDate(new Date())
    getReportList({
      variables: {
        orderBy : "-scan_start_date",
        scanEndDate:  moment(new Date()).format("YYYY-MM-DDT23:00:00"),
        scanStartDate :moment(new Date()).format("YYYY-MM-DDT00:00:00"),
      }
    });
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

    console.log("searchData", searchData);

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
  const getTaskName = {
    options: getTaskNameList,
    getOptionLabel: (option: { name: String }) => option.name,
  };
  const getTargetName = {
    options: getTargetNameList,
    getOptionLabel: (option: { name: String }) => option.name,
  };
  if (loadingReportListing) return <SimpleBackdrop />;
  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        Report Status
      </Typography>
      <Grid className={styles.FilterWrap}>
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
            {...getTargetStatus}
            id="TargetStatusFilter"
            value={reset ? null : targetFilterStatus ? targetFilterStatus : null}
            onChange={statusTargetFilter}
            renderInput={(params: any) => (
              <Input
                {...params}
                id="filterTargetStatus"
                label="Target Status"
                onKeyDown={handleKeyDown}
              />
            )}
          />
        </div>

        <div className={styles.FilterInput}>
          <AutoCompleteDropDown
            {...getTaskName}
            id="TaskName"
            value={reset ? null : filterTaskName != null ? filterTaskName : null}
            onChange={taskNameFilter}
            renderInput={(params: any) => (
              <Input
                {...params}
                id="TaskNameFilter"
                label="Task Name"
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
                label="Task Status"
                onKeyDown={handleKeyDown}
              />
            )}
          />
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div className={styles.FilterDateInput}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="startDate"
              label="Scan Start Date"
              value={startSelectedDate}
              // onChange={newDate => handleDateChange(newDate)}
              onChange={(newDate) => handleDateChange(newDate)}
              disableFuture={true}
              autoOk={true}
              fullWidth
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </div>
          <div className={styles.FilterDateInput}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="startDate"
              label="Scan End Date"
              value={endSelectedDate}
              onChange={(newDate) => handleEndDateChange(newDate)}
              disableFuture={true}
              autoOk={true}
              fullWidth
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </div>
        </MuiPickersUtilsProvider>
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
      <div className={styles.status_report}>
        <Paper className={styles.paper}>
          <MaterialTable
            title={title}
            columns={columns}
            data={newData}
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
      </div>
    </React.Fragment>
  );
};

export default ReportStatus;
