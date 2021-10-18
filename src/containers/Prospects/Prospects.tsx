import React, { useState, useEffect } from "react";
import styles from "./Prospects.module.css";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_TARGET_STATUS_BY_TYPE } from "../../graphql/queries/ReportListing";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "../../components/UI/Table/MaterialTable";
import { IconButton, Typography } from "@material-ui/core";
import Cookies from "js-cookie";
import { RA_REPORT_DOWNLOAD } from "../../config";
import GetAppIcon from "@material-ui/icons/GetApp";
import Grid from "@material-ui/core/Grid";
import { Button } from "../../components/UI/Form/Button/Button";
import { useHistory } from "react-router-dom";
import * as routeConstant from "../../common/RouteConstants";
import { PUBLISH_REPORT } from "../../graphql/mutations/PublishReport";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PublishIcon from "@material-ui/icons/Publish";
import { ZIP_FILE } from "../../graphql/mutations/Upload";
import { DialogBox } from "../../components/UI/DialogBox/DialogBox";
import { DELETE_TARGET } from "../../graphql/mutations/Target";
import SimpleBackdrop from "../../components/UI/Layout/Backdrop/Backdrop";
import Alert from "../../components/UI/Alert/Alert";
import CloseIcon from "@material-ui/icons/Close";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../common/MessageConstants";

export const Prospects: React.FC = (props: any) => {
  const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");
  const user = Cookies.getJSON("ob_user") || "";

  let userRole: any;
  if (user) {
    userRole = user.isSuperuser == true ? "SuperUser" : "CompanyUser";
  }
  if (user.getUserDetails) {
    userRole =
      user.getUserDetails.edges[0].node.isSuperuser == true
        ? "SuperUser"
        : "CompanyUser";
  }

  const history = useHistory();

  const [newData, setNewData] = useState([]);
  const [selectedFile, setSelectedFile] = useState<any>({});
  const [rowData2, setRowData] = useState<any>({});
  const [openDialogBox, setOpenDialogBox] = useState<boolean>(false);
  const [dialogBoxMsg, setDialogBoxMsg] = useState("");
  const [backdrop, setBackdrop] = useState<Boolean>(false);


  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });

  const column = [
    { title: "Prospect Name", field: "name" },
    { title: "Prospect Status", field: "status" },
  ];

  const [publishReport] = useMutation(PUBLISH_REPORT);
  const [uploadFile] = useMutation(ZIP_FILE);
  const [deleteTarget] = useMutation(DELETE_TARGET);

  useEffect(() => {
    getTarget({
      variables: {
        client_name: props.location.state
          ? props.location.state.clientInfo.client
          : null,
        client_type: "Prospect",
        scan_type: props.location.state.type,
      },
    });
  }, []);

  const [getTarget, { data: ipData, loading: ipLoading }] = useLazyQuery(
    GET_TARGET_STATUS_BY_TYPE,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: (data: any) => {
        createTableDataObject(data.getTarget.edges);
      },
      onError: (error) => {
        // logout()
      },
    }
  );

  const createTableDataObject = (data: any) => {
    let arr: any = [];
    data.map((element: any) => {
      if(userRole === "SuperUser") {
        if(element.node.targetStatus.name == "Generating Report" || element.node.targetStatus.name === "Report Generated") {
        let obj: any = {};
        obj["name"] = element.node.targetName;
        obj["clientId"] = element.node.client.id;
        obj["clientName"] = element.node.client.clientName;
        obj["status"] = element.node.targetStatus.name;
        obj["targetId"] = element.node.id;
        obj["publish"] =
          element.node.publishedFlag == "Unpublished" ? false : true;
        arr.push(obj);
        } 
    }
      else {
        let obj: any = {};
        obj["name"] = element.node.targetName;
        obj["clientId"] = element.node.client.id;
        obj["clientName"] = element.node.client.clientName;
        obj["status"] = element.node.targetStatus.name;
        obj["targetId"] = element.node.id;
        obj["publish"] =
          element.node.publishedFlag == "Unpublished" ? false : true;
        arr.push(obj);
      }
    });
    setNewData(arr);
  };
  const handleDownload = (rowData: any) => {
    if (Cookies.getJSON("ob_session")) {
      setBackdrop(true)
      let intTargetId = parseInt(rowData.targetId);
      const DocUrl =
        RA_REPORT_DOWNLOAD + "?cid=" + rowData.clientId + "&tid=" + intTargetId;
      fetch(DocUrl, {
        method: "GET",
      })
        .then((response: any) => {
          response.blob().then((blobData: any) => {
            saveAs(blobData, rowData.name);
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
      // logout();
    }
  };
  const handlePublishchange = (event: any, rowData: any) => {
    // if (event.target.checked !== undefined) {
    setBackdrop(true)
    publishReport({
      variables: {
        input: {
          client: parseInt(props.location.state.clientInfo.clientId),
          targetName: rowData.name,
          // partner: props.location.state.clientInfo.partnerId,
          flagStatus: true,
        },
      },
    })
      .then((response: any) => {
        setBackdrop(false)
        if (
          response.data.publishedReport.success ==
          "Report Published Successfully "
        ) {
          setFormState((formState) => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: "Report Published Successfully !!",
          }));
          getTarget({
            variables: {
              client_name: props.location.state
                ? props.location.state.clientInfo.client
                : null,
              client_type: "Prospect",
              scan_type: props.location.state.type,
            },
          });
          // setSelectedFile({});
        } else {
          // getReportListingData({
          //   variables: {
          //     clientname: propsClientName,
          //   },
          // });
          setFormState((formState) => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: " Report Un-Published Successfully !!",
          }));
        }
      })
      .catch((err: any) => {
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
              file: res,
            },
          },
        })
          .then((response: any) => {
            if (response.data.uploadZipFile.success == "File Uploaded Failed") {
              setFormState((formState) => ({
                ...formState,
                isSuccess: false,
                isUpdate: false,
                isDelete: false,
                isFailed: true,
                errMessage: " File Upload Failed.",
              }));
              setSelectedFile({});
              setBackdrop(false)
            } else {
              setFormState((formState) => ({
                ...formState,
                isSuccess: true,
                isUpdate: false,
                isDelete: false,
                isFailed: false,
                errMessage: "File Uploaded Successfully !!",
              }));
              setSelectedFile({});
              setBackdrop(false)
            }
          })
          .catch((error: Error) => {
            setFormState((formState) => ({
              ...formState,
              isSuccess: false,
              isUpdate: false,
              isDelete: false,
              isFailed: true,
              errMessage: "",
            }));
            setBackdrop(false)
          });
      });
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

  const handleClickDelete = (event: any, rowData: any) => {
    handleAlertClose();
    setBackdrop(true);
    setOpenDialogBox(true);
    // setDialogBoxMsg(msgConstant.LINUX_NETWORK_CREDENTIALS);
    setDialogBoxMsg("Are you sure you want to remove " + rowData.name + "?");
    setRowData(rowData);
  }
  const closeDialogBox = () => {
    setBackdrop(false);
    setOpenDialogBox(false);
  };

  const confirmDelete = async () => {
    closeDialogBox();
      // SetTargetDeleted(false);
    deleteTarget({
      variables: {
        id: rowData2.targetId
      },
    }).then((res: any) => {
      setBackdrop(false);
      if(res.data.deleteTarget.status == "Target Deleted Successfully") {
      //   if(propsClientName != undefined) {
      //   getReportListingData({
      //     variables: {
      //       clientname: propsClientName,
      //     },
      //   });
      // }
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
      setBackdrop(false);
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
    .catch((err : any) => {
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

  }
  return (
    <React.Fragment>
      <Typography component="h5" variant="h1">
        {props.location.state.type} Prospects
      </Typography>
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
            {SUCCESS}
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
            {UPDATE}
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
            <strong>{formState.errMessage}</strong>
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
      <Grid container className={styles.backToListButtonPanel}>
      <Grid item xs={12} md={12} className={styles.backToListButton}>
      {/* {userRole === "SuperUser" ? ( */}
      <Button
            className={styles.BackToButton}
            variant={"contained"}
            onClick={() => {
              // history.push(routeConstant.CLIENT,props);
              window.history.back()
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
       </Grid>
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
          <p>
            {dialogBoxMsg}
          </p>
        </div>
      </DialogBox>
      {backdrop   ? <SimpleBackdrop/>: null}

      <Paper className={styles.paper}>
      {ipLoading   ? <SimpleBackdrop/>: null}

        <div className={styles.ScrollTable}>
          {newData.length !== 0 ? (
            <MaterialTable
              columns={column}
              data={newData}
              actions={[
                
                // (rowData: any) =>
                //   rowData.status == "Report Generated"
                //     ? {
                //         // disabled: rowData.status !== "Done",
                //         icon: () => <GetAppIcon />,
                //         tooltip: "Download",
                //         onClick: (event: any, rowData: any) => {
                //           handleDownload(rowData);
                //         },
                //       }
                //     : null,
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
                      icon: () =>
                        !rowData.publish ? (
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
                        ) : (
                          <CloudUploadIcon
                            style={{
                              fill: "grey",
                              position: "relative",
                              top: "10px",
                            }}
                          />
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
                          <PublishIcon
                            style={{
                              fill: "grey",
                              position: "relative",
                              top: "10px",
                            }}
                          />
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
                // (rowData: any) =>
                //   rowData
                //     ? {
                //         // icon: () => <DeleteIcon />,
                //         icon: () => (
                //           <img
                //             className={styles.EditIcon}
                //             src={
                //               process.env.PUBLIC_URL +
                //               "/icons/svg-icon/delete.svg"
                //             }
                //             alt="delete icon"
                //           />
                //         ),
                //         tooltip: "Delete",
                //         onClick: (event: any, rowData: any) => {
                //           handleClickDelete(event, rowData);
                //         },
                //       }
                //     : null,
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
          ) : (
            <Typography component="h5" variant="h3">
              You don't have any Prospects
            </Typography>
          )}
        </div>
      </Paper>
    </React.Fragment>
  );
};

export default Prospects;
