import React, { useState, useEffect } from "react";
import styles from "./RaReportListing.module.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Button } from "../../../components/UI/Form/Button/Button";
import Loading from "../../../components/UI/Layout/Loading/Loading";
import SimpleBackdrop from "../../../components/UI/Layout/Backdrop/Backdrop";
import MaterialTable from "../../../components/UI/Table/MaterialTable";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
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
import { saveAs } from "file-saver";
import { ZIP_FILE } from "../../../graphql/mutations/Upload";
import { PUBLISH_REPORT } from "../../../graphql/mutations/PublishReport";
import PublishIcon from "@material-ui/icons/Publish";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Alert from "../../../components/UI/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER
} from "../../../common/MessageConstants";
import Switch from "../../../components/UI/Switch/Switch";

export const RaReportListing: React.FC = (props: any) => {
  const [name, setName] = useState<String>("");
  const [published, setPublished] = useState<any>({});
  const [backdrop, setBackdrop] = useState<Boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState<Boolean>(true);
  const [selectedFile, setSelectedFile] = useState<any>({});
  const history = useHistory();
  const [newData, setNewData] = useState();
  const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  let userRole: any;
  if (user) {
    userRole = user.isSuperuser == true ? "SuperUser" : "CompanyUser";
  }
  //table

  const CompnyUserColumns = [
    { title: "Target", field: "target" },
    { title: "Status", field: "status" },
  ];
  const AdminColumns = [{ title: "Target", field: "target" },
  { title: "Status", field: "status" },
  { title: "Report Status", field: "report_status" }
  ];
  const columns = partner.partnerId ? CompnyUserColumns : AdminColumns;
  const title = "Listing of Reports";
  const [filters, setFilters] = useState<any>({});
  const [orderBy, setOrderBy] = useState<String>();
  //static values
  const propsClientName = props.location.state && props.location.state.clientInfo ? props.location.state.clientInfo.name : undefined;
  const propsClientId = props.location.state && props.location.state.clientInfo
    ? parseInt(props.location.state.clientInfo.clientId)
    : undefined;
  const clientInfo = props.location.state
    ? props.location.state.clientInfo
    : undefined;
  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: ""
  });
  // console.log("props.location.state", props.location.state)
  const [haveOtherOffice, setHaveOtherOffice] = useState(true);
  //filter query condition declaration
  const [getReportListingData, {
    data: dataReportListing,
    loading: loadingReportListing,
    refetch: refetchReportListing
  }] = useLazyQuery(GET_REPORT_LISTING);

  const [uploadFile] = useMutation(ZIP_FILE);
  const [publishReport] = useMutation(PUBLISH_REPORT);

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

      setPublished(
        getPublishDataList(
          dataReportListing.getReportStatus.edges,
          distinctTargetArray
        )
      );

      setNewData(temp);
    }
    if (partner.partnerId) {
      getReportListingData({
        variables: {
          clientname: propsClientName,
        }
      })
      // if (props.location.state.refetchData) {
      //   // getReportListingData()
      //   // refetchReportListing();
      // }
    }
    if (partner.partnerId == undefined) {
      getReportListingData({
        variables: {
          clientname: propsClientName,
          status: "Done"
        }
      })
      if (props.location.state.refetchData) {
        // getReportListingData()
        // refetchReportListing();
      }
    }
  }, [dataReportListing]);

  //for task data
  if (loadingReportListing || backdrop) return <SimpleBackdrop />;
  // if (errorReportListing) {
  // history.push({
  //   pathname: routeConstant.DASHBOARD,
  // });
  // }
  function convertTargetArray(data: any) {
    const targetObj = new Set(
      data.map((x: any) => x.node.vatTargetId.targetName)
    );
    // let array = [...targetObj];
    let array: any = [];
    targetObj.forEach(v => array.push(v));
    return array;
  }

  function convertTableData(data: any, targetArr: any) {
    let arr: any = [];
    for (let i in targetArr) {
      let tempArr: any = {};
      tempArr["target"] = targetArr[i];
      let statusVar = false;
      let targetId = 0;
      let targetHost;
      let targetIpAddress;
      let publishFlag = "";
      for (let j in data) {
        if (targetArr[i] === data[j].node.vatTargetId.targetName) {
          if (data[j].node.vatTargetId.publishedFlag == "Published") {
            tempArr["report_status"] = "Published";
            tempArr["status"] = "Done";
          }

          if (data[j].node.vatTargetId.publishedFlag == "Unpublished") {
            tempArr["report_status"] = "Unpublished";
            tempArr["status"] = "In Progress";
          }
          targetId = data[j].node.vatTargetId.id;

          if (partner.partnerId == undefined) {
            if (data[j].node.scanRunStatus == "Done") {
              tempArr["status"] = "Done";
            }
            if (data[j].node.scanRunStatus == "In Progress") {
              tempArr["status"] = "In Progress";
            }
          }
        }
        console.log("data[j].node.vatTargetId", data[j].node)
        if (targetArr[i] === data[j].node.vatTargetId.targetName) {
          publishFlag = data[j].node.vatTargetId.publishedFlag;
        }
        if (targetArr[i] === data[j].node.vatTargetId.targetName) {
          targetHost = data[j].node.vatTargetId.host;
        }
        if (targetArr[i] === data[j].node.vatTargetId.targetName) {
          targetIpAddress = data[j].node.vatTargetId.ipAddress;
        }
      }

      tempArr["publish"] = publishFlag == "Unpublished" ? false : true;
      tempArr["targetId"] = targetId !== 0 ? targetId : null;
      tempArr["host"] = targetHost;
      tempArr["linuxIpAddress"] = targetIpAddress;
      arr.push(tempArr);
    }
    return arr;
  }

  function getPublishDataList(data: any, targetArr: any) {
    let arr: any = [];
    let tempArr: any = {};
    for (let i in targetArr) {
      let targetId = 0;
      let statusVar = false;
      // tempArr["target"] = targetArr[i];
      let publishFlag = "";
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
        if (targetArr[i] === data[j].node.vatTargetId.targetName) {
          publishFlag = data[j].node.vatTargetId.publishedFlag;
        }
      }

      // tempArr["targetId"] = targetId !== 0 ? targetId : null;
      tempArr[targetId] = publishFlag == "Unpublished" ? false : true;

      arr.push(tempArr);
    }
    return tempArr;
  }

  const handleClickView = (rowData: any) => {
    history.push({
      pathname: routeConstant.REPORT_STATUS,
      state: { targetName: rowData.target, clientInfo: clientInfo, target: rowData }
    });
  };

  const handleClickOpen = (rowData: any) => {
    console.log("rowData", rowData);
    history.push({
      pathname: routeConstant.TARGET,
      state: { reRun: true, targetName: rowData.target, targetData: rowData, clientInfo: clientInfo }
    });
  };

  const handleAlertClose = () => {
    setFormState(formState => ({
      ...formState,
      isSuccess: false,
      isUpdate: false,
      isDelete: false,
      isFailed: false,
      errMessage: ""
    }));
  };

  const handleDownload = (rowData: any) => {
    setBackdrop(true)
    let intTargetId = parseInt(rowData.targetId);
    const DocUrl =
      RA_REPORT_DOWNLOAD + "?cid=" + propsClientId + "&tid=" + intTargetId;
    fetch(DocUrl, {
      method: "GET"
    }).then((response: any) => {
      setBackdrop(false)
      response.blob().then((blobData: any) => {
        saveAs(blobData, "RA_Report");
      });
    });
  };

  const getBase64 = (file: any, cb: any) => {
    let reader = new FileReader();
    // console.log("reader", file);
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = function () {
        cb(reader.result);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  };

  const onChangeHandler = (event: any, rowData: any) => {
    setSelectedFile({ [rowData.targetId]: event.target.files[0] });
    if (event.target.files[0]) {
      setSubmitDisabled(false);
    }
  };

  const handleUpload = (rowData: any) => {
    if (selectedFile[rowData.targetId]) {
      setBackdrop(true)
      let idCardBase64 = "";
      getBase64(selectedFile[rowData.targetId], (result: any) => {
        idCardBase64 = result;
        var res = result.slice(result.indexOf(",") + 1);
        uploadFile({
          variables: {
            input: {
              client: parseInt(props.location.state.clientInfo.clientId),
              targetName: rowData.target,
              file: res
            }
          }
        })
          .then((response: any) => {
            if (response.data.uploadZipFile.success == "File Uploaded Failed") {
              setFormState(formState => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage: " File Upload Failed."
              }));
              setSelectedFile({});
              setBackdrop(false)
            } else {
              setFormState(formState => ({
                ...formState,
                isSuccess: true,
                isUpdate: false,
                isDelete: false,
                isFailed: false,
                errMessage: "File Uploaded Successfully !!"
              }));
              setSelectedFile({});
              setBackdrop(false)
            }
          })
          .catch((error: Error) => {
            setFormState(formState => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: ""
            }));
            setBackdrop(false)
          });
      });
    }
  };

  console.log("props", props.location.state)

  let checked: boolean;
  const handlePublish = (event: any, rowdata: any) => {
    setPublished({ ...published, [rowdata.targetId]: event.target.checked });
  };

  const handlePublishchange = (event: any, rowData: any) => {
    if (event.target.checked !== undefined) {
      setBackdrop(true)
      publishReport({
        variables: {
          input: {
            client: parseInt(props.location.state.clientInfo.clientId),
            targetName: rowData.target,
            partner: props.location.state.clientInfo.partnerId,
            flagStatus: event.target.checked
          }
        }
      }).then((response: any) => {
        setBackdrop(false)
        if (
          event.target.checked !== true && response.data.publishedReport.success ==
          "Report Published Successfully "
        ) {
          setFormState(formState => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: "Report Published Successfully !!"
          }));
          setSelectedFile({});
        } else {
          setFormState(formState => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: " Report Un-Published Successfully !!"
          }));
        }
      }).catch((error: any) => {
        setBackdrop(false)
      })
    }
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
        <Grid container className={styles.backToListButtonPanel}>
          <Grid item xs={12} md={12} className={styles.backToListButton}>
            {/* {userRole === "SuperUser" ? ( */}
            <Button
              className={styles.BackToButton}
              variant={"contained"}
              onClick={() => {
                let data = {};
                data = { clientInfo: clientInfo };
                history.push(routeConstant.CLIENT, data);
              }}
              color="secondary"
              data-testid="cancel-button"
            >
              <img
                src={
                  process.env.PUBLIC_URL + "/icons/svg-icon/back-list.svg"
                }
                alt="user icon"
              />
                    &nbsp; Back to List
                  </Button>
            {/* ) : null} */}
            {partner.partnerId ? (
              <Button
                color="primary"
                variant="contained"
                onClick={handleAddNewReport}
                className={styles.ActionButton}
              >
                <AddCircleIcon className={styles.EditIcon} />
                  &nbsp; New Risk Assessment
              </Button>
            ) : null}
          </Grid>
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
              filter: true
            }}
            onOrderChange={(orderedColumnId: any, orderDirection: any) => {
              orderFunc(orderedColumnId, orderDirection);
            }}
            actions={[
              partner.partnerId
                ? {
                  icon: () => <VisibilityIcon />,
                  tooltip: "View Data",
                  onClick: (event: any, rowData: any) => {
                    handleClickView(rowData);
                  }
                }
                : null,
              partner.partnerId
                ? (rowData: any) => (rowData.status == "Done" ? {
                  // disabled: rowData.status !== "Done",
                  icon: () => <SyncIcon />,
                  tooltip: "Re-run",
                  onClick: (event: any, rowData: any) => {
                    handleClickOpen(rowData);
                  }
                } : null)
                : null,
              (rowData: any) => (rowData.status == "Done" ? {
                // disabled: rowData.status !== "Done",
                icon: () => <GetAppIcon />,
                tooltip: "Download",
                onClick: (event: any, rowData: any) => {
                  handleDownload(rowData);
                }
              } : null),
              partner.partnerId
                ? null
                : (rowData: any) => ({
                  // disabled: rowData.status !== "Done",
                  icon: () => (
                    <div>
                      <input
                        type="file"
                        name={rowData.tableData.id}
                        id="zipUpload"
                        className={styles.uploadButton}
                        hidden
                        onChange={(event: any) => {
                          onChangeHandler(event, rowData);
                        }}
                      />
                      <label htmlFor="zipUpload"><CloudUploadIcon /></label>
                    </div>
                  ),
                  tooltip: "Browse",
                  name: "file",
                  type: "file",
                  onClick: (event: any, rowData: any) => {
                    // onChangeHandler(event, rowData)
                  }
                }),
              partner.partnerId
                ? null
                : (rowData: any) => ({
                  // disabled: rowData.status !== "Done",
                  icon: () => <PublishIcon />,
                  tooltip: "Upload",
                  name: "file",
                  id: "file",
                  onClick: (event: any, rowData: any) => {
                    handleUpload(rowData);
                  }
                }),
              partner.partnerId
                ? null
                : (rowData: any) => ({
                  // disabled: rowData.status !== "Done",
                  icon: () => (
                    <div>
                      <div className={styles.raswitch}>
                        <Switch
                          className={
                            published[rowData.targetId]
                              ? styles.PublishSwitch
                              : styles.PublishSwitchCheck
                          }

                          id="rowData.targetId"
                          checked={published[rowData.targetId]}
                          onChange={(event: any) => {
                            handlePublish(event, rowData);
                          }}
                          name={rowData.targetId}
                          {...props}
                        ></Switch>
                      </div>
                      <span className={styles.PublishSwitchLabels}>
                        <span className={styles.PublishSwitchNo}>NO</span>
                        <span className={styles.PublishSwitchYes}>YES</span>
                      </span>
                    </div>
                  ),
                  tooltip: "Publish",
                  onClick: (event: any, rowData: any) => {
                    handlePublishchange(event, rowData);
                  }
                })
            ]}
          />
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default RaReportListing;
