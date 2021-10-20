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
import { GET_REPORT_LISTING,GET_REPORT_LISTING_STATUS } from "../../../graphql/queries/ReportListing";
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
import DeleteIcon from "@material-ui/icons/Delete";
import { DELETE_TARGET } from "../../../graphql/mutations/Target";
import { DialogBox } from "../../../components/UI/DialogBox/DialogBox";
import AlertBox from "../../../components/UI/AlertBox/AlertBox";
import * as msgConstant from "../../../common/MessageConstants";
import logout from "../../Auth/Logout/Logout";
import Cookies from 'js-cookie';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import ComputerIcon from "@material-ui/icons/Computer";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DehazeSharpIcon from "@material-ui/icons/DehazeSharp";

export const RaReportListing: React.FC = (props: any) => {
  const [published, setPublished] = useState<any>({});
  const [backdrop, setBackdrop] = useState<Boolean>(false);
  const [showBackdrop, setShowBackdrop] = useState<Boolean>(true);
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
    { title: "Company Name", field: "clientName" },
    { title: "Target", field: "target" },
    { title: "Scan Type", field: "scanType" },
    { title: "Status", field: "status" },
  ];
  const AdminColumns = [{ title: "Target", field: "target" },
  { title: "Status", field: "status" },
  { title: "Report Status", field: "report_status" }
  ];
  const columns = partner.partnerId ? CompnyUserColumns : AdminColumns;
  const title = "Listing of Reports";
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
  const [targetDeleted, SetTargetDeleted] = useState(false);
  const [rowData2, setRowData] = useState<any>({});
  const [openDialogBox, setOpenDialogBox] = useState<boolean>(false);
  const [dialogBoxMsg, setDialogBoxMsg] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  //filter query condition declaration
  const [getReportListingData, {
    data: dataReportListing,
    loading: loadingReportListing,
  }] = useLazyQuery(GET_REPORT_LISTING_STATUS,
    {
      fetchPolicy: "cache-and-network",
      onCompleted:(data)=>{
        setShowBackdrop(false);
        createTableDataObject(data.getTargetStatus);
      },
      onError: error => {
         logout()
        // history.push(routeConstant.DASHBOARD);
      }
    });

  const [uploadFile] = useMutation(ZIP_FILE);
  const [publishReport] = useMutation(PUBLISH_REPORT);
  const [deleteTarget] = useMutation(DELETE_TARGET);


  useEffect(() => {
    if (Cookies.getJSON("ob_session")) { 
    getReportListingData({
      variables: {
        clientname: propsClientName,
      },
    });
  } else{
     logout();
  }
  }, []);

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

  // useEffect(() => {
  //   if (
  //     formState.isDelete === true ||
  //     formState.isFailed === true ||
  //     formState.isSuccess === true ||
  //     formState.isUpdate === true
  //   ) {
  //     setTimeout(function () {
  //       handleAlertClose();
  //     }, ALERT_MESSAGE_TIMER);
  //   }
  // }, [formState]);
  

  useEffect(() => {
    // if (dataReportListing) {
    //   let distinctTargetArray: any = [];
    //   distinctTargetArray = convertTargetArray(
    //     dataReportListing.getReportStatus.edges
    //   );
    //   let temp: any = {};
    //   temp = convertTableData(
    //     dataReportListing.getReportStatus.edges,
    //     distinctTargetArray
    //   );

    //   setPublished(
    //     getPublishDataList(
    //       dataReportListing.getReportStatus.edges,
    //       distinctTargetArray
    //     )
    //   );
    //   setNewData(temp);
    // }
    // if (partner.partnerId && propsClientName!= undefined) {
      getReportListingData({
        variables: {
          clientname: propsClientName,
        }
      })
    // }
    // if (partner.partnerId == undefined) {
    //   getReportListingData({
    //     variables: {
    //       clientname: propsClientName,
    //       // status: "Done",
    //       // reportCreationFlag : "Processed" 
    //     }
    //   })
    // }
  }, [dataReportListing || targetDeleted]);


  //for task data
  // if (loadingReportListing || backdrop || showBackdrop) return <SimpleBackdrop />;
  // if (errorReportListing) {
  // history.push({
  //   pathname: routeConstant.DASHBOARD,
  // });
  // }
  // function convertTargetArray(data: any) {
  //   const targetObj = new Set(
  //     data.map((x: any) => x.node.vatTargetId.targetName)
  //   );
  //   // let array = [...targetObj];
  //   let array: any = [];
  //   targetObj.forEach(v => array.push(v));
  //   return array;
  // }

  // function convertTableData(data: any, targetArr: any) {
  //   let arr: any = [];
  //   for (let i in targetArr) {
  //     let tempArr: any = {};
  //     tempArr["target"] = targetArr[i];
  //     let statusVar = false;
  //     let targetId = 0;
  //     let targetHost;
  //     let targetIpAddress;
  //     let publishFlag = "";
  //     for (let j in data) {
  //       if (targetArr[i] === data[j].node.vatTargetId.targetName) {
  //         tempArr["scanType"] = data[j].node.vatTargetId.scanType
  //         if (data[j].node.vatTargetId.publishedFlag == "Published") {
  //           tempArr["report_status"] = "Published";
  //           tempArr["status"] = "Done";
  //         }

  //         if (data[j].node.vatTargetId.publishedFlag == "Unpublished") {
  //           tempArr["report_status"] = "Unpublished";
  //           tempArr["status"] = "In Progress";
  //         }
  //         targetId = data[j].node.vatTargetId.id;

  //         if (partner.partnerId == undefined) {
  //           if (data[j].node.scanRunStatus == "Done") {
              
  //             tempArr["status"] = "Done";
  //           }
  //           if (data[j].node.scanRunStatus == "In Progress") {
  //             tempArr["status"] = "In Progress";
  //           }
  //         }
  //       }
  //       if (targetArr[i] === data[j].node.vatTargetId.targetName) {
  //         publishFlag = data[j].node.vatTargetId.publishedFlag;
  //       }
  //       if (targetArr[i] === data[j].node.vatTargetId.targetName) {
  //         targetHost = data[j].node.vatTargetId.host;
  //       }
  //       if (targetArr[i] === data[j].node.vatTargetId.targetName) {
  //         targetIpAddress = data[j].node.vatTargetId.ipAddress;
  //       }
  //     }

  //     tempArr["publish"] = publishFlag == "Unpublished" ? false : true;
  //     tempArr["targetId"] = targetId !== 0 ? targetId : null;
  //     tempArr["host"] = targetHost;
  //     tempArr["linuxIpAddress"] = targetIpAddress;
  //     arr.push(tempArr);
  //   }
  //   return arr;
  // }

  // function getPublishDataList(data: any, targetArr: any) {
  //   let arr: any = [];
  //   let tempArr: any = {};
  //   for (let i in targetArr) {
  //     let targetId = 0;
  //     let statusVar = false;
  //     // tempArr["target"] = targetArr[i];
  //     let publishFlag = "";
  //     for (let j in data) {
  //       if (targetArr[i] === data[j].node.vatTargetId.targetName) {
  //         if (
  //           data[j].node.scanRunStatus !== "Done" ||
  //           data[j].node.scanRunStatus === "In Progress"
  //         ) {
  //           statusVar = true;
  //         }
  //         targetId = data[j].node.vatTargetId.id;
  //       }
  //       if (targetArr[i] === data[j].node.vatTargetId.targetName) {
  //         publishFlag = data[j].node.vatTargetId.publishedFlag;
  //       }
  //     }

  //     // tempArr["targetId"] = targetId !== 0 ? targetId : null;
  //     tempArr[targetId] = publishFlag == "Unpublished" ? false : true;

  //     arr.push(tempArr);
  //   }
  //   return tempArr;
  // }

  const createTableDataObject = (data: any) => {
    let arr: any = [];
    if(partner.partnerId == undefined) {
    data.map((element: any) => {
      if(element.status == "Generating Report" || element.status === "Report Generated") {
      let obj: any = {};
      obj["targetId"] = element.targetId !== 0 ? element.targetId : null;
      obj["host"] = element.host;
      obj["target"] = element.targetName;
      obj["scanType"] = element.scanType;
      obj["status"] = element.status;
      obj["publish"] = element.publishedFlag == "Unpublished" ? false : true;
      obj["report_status"] = element.publishedFlag;
      obj["clientName"] = element.clientName;
      arr.push(obj);
      }
    });
  }     
    if(partner.partnerId != undefined) {
      data.map((element: any) => {
        let obj: any = {};
      obj["targetId"] = element.targetId !== 0 ? element.targetId : null;
      obj["host"] = element.host;
      obj["target"] = element.targetName;
      obj["scanType"] = element.scanType;
      obj["status"] = element.status;
      obj["publish"] = element.publishedFlag == "Unpublished" ? false : true;
      obj["report_status"] = element.publishedFlag;
      obj["clientName"] = element.clientName;
      arr.push(obj);
    });
    }

    setNewData(arr);
  };

  const handleClickView = (rowData: any) => {
    if (Cookies.getJSON("ob_session")) {
      history.push({
        pathname: routeConstant.REPORT_STATUS,
        state: {
          targetName: rowData.target,
          clientInfo: clientInfo,
          // target: rowData,
        },
      });
    } else {
      logout();
    }
  };

  const handleClickOpen = (rowData: any) => {
    history.push({
      pathname: routeConstant.TARGET,
      state: { reRun: true, targetName: rowData.target, targetData: rowData, clientInfo: clientInfo }
    });
  };



  const handleDownload = (rowData: any) => {
    handleAlertClose();
    if (Cookies.getJSON("ob_session")) { 
    setBackdrop(true)
    let intTargetId = parseInt(rowData.targetId);
    const DocUrl =
      RA_REPORT_DOWNLOAD + "?cid=" + propsClientId + "&tid=" + intTargetId;
    fetch(DocUrl, {
      method: "GET"
    }).then((response: any) => {
      response.blob().then((blobData: any) => {
        saveAs(blobData, rowData.target);
        setBackdrop(false)
      });
    })
    .catch((err) => {
      setBackdrop(false);
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
  } else {
    logout();
  }
  };

  const getBase64 = (file: any, cb: any) => {
    let reader = new FileReader();
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

  let checked: boolean;
  // const handlePublish = (event: any, rowdata: any) => {
  //   setPublished({ ...published, [rowdata.targetId]: event.target.checked });
  // };

  const handlePublishchange = (event: any, rowData: any) => {
    // if (event.target.checked !== undefined) {
      setBackdrop(true)
      publishReport({
        variables: {
          input: {
            client: parseInt(props.location.state.clientInfo.clientId),
            targetName: rowData.target,
            // partner: props.location.state.clientInfo.partnerId,
            flagStatus: true
          }
        }
      }).then((response: any) => {
        setBackdrop(false)
        if (
          response.data.publishedReport.success ==
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
          getReportListingData({
            variables: {
              clientname: propsClientName,
            },
          });
          setSelectedFile({});
        } else {
          // getReportListingData({
          //   variables: {
          //     clientname: propsClientName,
          //   },
          // });
          setFormState(formState => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: " Report Un-Published Successfully !!"
          }));
        }
      }).catch((err: any) => {
        setBackdrop(false)
          let error = err.message;
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: false,
            isFailed: true,
            errMessage: error,
          }));
      })
  };

  const handleAddNewReport = () => {
    handleAlertClose();
    let data = {};
    data = { clientInfo: clientInfo };
    history.push(routeConstant.EXTERNAL_TARGET, data);
  };

  const handleAddNewAdvanceReport = () => {
    handleAlertClose();
    let data = {};
    data = { clientInfo: clientInfo };
    history.push(routeConstant.TARGET, data);
  };
  const handleAddNewPentest = () => {
    handleAlertClose();
    let data = {};
    data = { clientInfo: clientInfo };
    history.push(routeConstant.PEN_TEST, data);
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

  const handleClickDelete = (event: any, rowData: any) => {
    handleAlertClose();
    setShowBackdrop(true);
    setOpenDialogBox(true);
    // setDialogBoxMsg(msgConstant.LINUX_NETWORK_CREDENTIALS);
    setDialogBoxMsg("Are you sure you want to remove " + rowData.target + "?");
    setRowData(rowData);
  }

  const confirmDelete = async () => {
    closeDialogBox();
      // SetTargetDeleted(false);
    deleteTarget({
      variables: {
        id: rowData2.targetId
      },
    }).then((res: any) => {
      setShowBackdrop(false);
      if(res.data.deleteTarget.status == "Target Deleted Successfully") {
        if(propsClientName != undefined) {
        getReportListingData({
          variables: {
            clientname: propsClientName,
          },
        });
      }
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: true,
        isFailed: false,
        errMessage: "  " + rowData2.target + "  " ,
      }));
    }
    if(res.data.deleteTarget.status === "Target Not Deleted") {
      setShowBackdrop(false);
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: " Unable to delete  " + rowData2.target + " " ,
      }));
    }
    })
    .catch((err) => {
      setShowBackdrop(false);
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
  const closeDialogBox = () => {
    setShowBackdrop(false);
    setOpenDialogBox(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event :any) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        {/* Report List */}
        Vulnerability List
      </Typography>
      <Grid>
      {loadingReportListing || backdrop || showBackdrop  ? <SimpleBackdrop/>: null}
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
          <p>
            {dialogBoxMsg}
          </p>
        </div>
      </DialogBox>

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
                src={process.env.PUBLIC_URL + "/icons/svg-icon/back-list.svg"}
                alt="user icon"
              />
              &nbsp; Back to List
            </Button>
            {/* ) : null} */}
            {partner.partnerId ? 
             <> 
            <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  className={styles.ActionButton}

                >
                  <AddCircleIcon className={styles.CircleIcon} />
                  &nbsp; CREATE TEST
                </Button>
            <Menu
               id="simple-menu"
               anchorEl={anchorEl}
               keepMounted
               open={Boolean(anchorEl)}
               onClose={handleClose}
               className={styles.MenuButton}

             >
               <MenuItem onClick={handleAddNewReport}> &nbsp; External Vulnerability Test</MenuItem>
               <MenuItem onClick={handleAddNewAdvanceReport}> &nbsp; Advanced Vulnerability Test</MenuItem>
               <MenuItem onClick={handleAddNewPentest}> &nbsp; Pentest</MenuItem>
             </Menu>
             </>
              : null}
      
          </Grid>
        </Grid>
        <Paper className={styles.paper}>
        <Grid item xs={12} className={styles.AlertWrap}>
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
            {formState.isDelete ? (
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
              {DELETE}
            </Alert>
          ) : null}
        </Grid>
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
            actions={[
              partner.partnerId
                ? (rowData: any) =>
                 rowData.scanType != "Pentest" ? {
                    icon: () => <VisibilityIcon />,
                    tooltip: "View Data",
                    onClick: (event: any, rowData: any) => {
                      handleClickView(rowData);
                    },
                  } : null
                : null,
              partner.partnerId
                ? (rowData: any) =>
                    rowData.status == "Report Generated" && rowData.scanType != "External"
                      ? {
                          // disabled: rowData.status !== "Done",
                          icon: () => <SyncIcon />,
                          tooltip: "Make a copy",
                          onClick: (event: any, rowData: any) => {
                            handleClickOpen(rowData);
                          },
                        }
                      : null
                : null,
                partner.partnerId
?
              (rowData: any) =>
                rowData.status == "Report Generated"
                  ? {
                      // disabled: rowData.status !== "Done",
                      icon: () => <GetAppIcon />,
                      tooltip: "Download",
                      onClick: (event: any, rowData: any) => {
                        handleDownload(rowData);
                      },
                    }
                  : null :  {
                    // disabled: rowData.status !== "Done",
                    icon: () => <GetAppIcon />,
                    tooltip: "Download",
                    onClick: (event: any, rowData: any) => {
                      handleDownload(rowData);
                    },
                  },
              partner.partnerId
                ? null
                : (rowData: any) => ({
                    // disabled: rowData.status !== "Done",
                    icon: () => !rowData.publish ? ( 
                      <div>
                        <input
                          type="file"
                          name={rowData.targetId}
                          id={rowData.targetId}
                          className={styles.uploadButton}
                          hidden
                          onChange={(event: any) => {
                            setSelectedFile({
                              [rowData.targetId]: event.target.files[0],
                            });
                          }}
                        />
                        <label htmlFor={rowData.targetId}>
                          <CloudUploadIcon />
                        </label>
                      </div>
                    ): (
                      <CloudUploadIcon style={{ fill: "grey",position: "relative", top: "10px"}} />
                    ),
                    tooltip: "Browse",
                    name: "file",
                    type: "file",
                    disabled: rowData.publish,
                    // onClick: (event: any, rowData: any) => {
                    //   getRowData(rowData);
                    // }
                  }),
              partner.partnerId
                ? null
                : (rowData: any) => ({
                    // disabled: selectedFile == {} ? false : true,
                    icon: () =>
                    rowData.publish ? (
                      <PublishIcon style={{ fill: "grey", position: "relative", top: "10px" }} />
                    ) : (
                      <PublishIcon />
                    ),
                    // <PublishIcon />,
                    tooltip: "Upload",
                    name: "file",
                    disabled: rowData.publish,
                    id: "file",
                    onClick: (event: any, rowData: any) => {
                      handleUpload(rowData);
                    },
                  }),
                  (rowData: any) =>
                  rowData ?
                  {
                    // icon: () => <DeleteIcon />,
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
                    onClick: (event: any, rowData: any) => {
                      handleClickDelete(event, rowData);
                    },
                  } : null,
              partner.partnerId
                ? null
                : (rowData: any) => ({
                    icon: () => (
                      <div>
                        <div className={styles.raswitch}>
                          <Button
                            color="primary"
                            variant={"contained"}
                            data-testid="ok-button"
                            className={styles.PublishButton}
                            disabled={rowData.publish}
                          >
                            Publish
                          </Button>
                        </div>
                      </div>
                    ),
                    name: "Publish",
                    disabled: rowData.publish,
                    onClick: (event: any, rowData: any) => {
                      handlePublishchange(event, rowData);
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
