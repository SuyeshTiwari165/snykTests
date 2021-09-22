import React, { useEffect, useState } from "react";
import styles from "./Client.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
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
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import {
  CREATE_CLIENT,
  UPDATE_CLIENT,
} from "../../../graphql/mutations/Clients";
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import AssessmentIcon from "@material-ui/icons/Assessment";
import DeleteIcon from "@material-ui/icons/Delete";
import DescriptionIcon from "@material-ui/icons/Description";
import * as routeConstant from "../../../common/RouteConstants";
import SimpleBackdrop from "../../../components/UI/Layout/Backdrop/Backdrop";
import { useHistory } from "react-router-dom";
import logout from "../../Auth/Logout/Logout";
import {
  GET_CLIENTS,
  GET_CLIENT_AND_LATEST_REPORTS,
} from "../../../graphql/queries/Client";
// import { GET_PARTNER_SUBSCRIPTION } from "../../graphql/queries/PartnerSubscription";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../common/MessageConstants";
import * as validations from "../../../common/validateRegex";
import moment from "moment";
import { DELETE_CLIENT } from "../../../graphql/mutations/Clients";
import Cookies from "js-cookie";
import { GET_ADMIN_USER } from "../../../graphql/queries/User";
import ComputerIcon from "@material-ui/icons/Computer";
import {
  GET_PROSPECT_CLIENTS,
  GET_TARGET,
} from "../../../graphql/queries/Target";
import { RA_REPORT_DOWNLOAD } from "../../../config";
import { PUBLISH_REPORT } from "../../../graphql/mutations/PublishReport";
import PublishIcon from "@material-ui/icons/Publish";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { ZIP_FILE } from "../../../graphql/mutations/Upload";

export const Client: React.FC = (props: any) => {
  const history = useHistory();
  const [showBackdrop, setShowBackdrop] = useState<boolean>(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newData, setNewData] = useState([]);
  const [prospectData, setProspectData] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [createFlag, setCreateFlag] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>({});

  // const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");
  const partner = Cookies.get("ob_partnerData") || "";
  const user = Cookies.getJSON("ob_user") || "";
  // const user = JSON.parse(localStorage.getItem("user") || "{}");
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
  const [clientDeleted, setClientDeleted] = useState(false);

  //table
  const CompanyUsercolumns = [
    { title: "Company Name", field: "name" },
    // { title: "Email", field: "email" },
    { title: "Target Name", field: "targetName" },
    { title: "Last Target Generated on", field: "lastReportGenerated" },
    // { title: "Phone", field: "phone" },
    // { title: "Created on", field: "createdOn" }
  ];

  const ProspectUsercolumns = [
    { title: "Company Name", field: "prospectName" },
  ];

  const SuperUsercolumns = [{ title: "Company Name", field: "name" }];

  const [isError, setIsError] = useState<any>({
    address: "",
    email: "",
    phoneNumber: "",
  });

  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });

  const [deleteClient] = useMutation(DELETE_CLIENT);
  const [publishReport] = useMutation(PUBLISH_REPORT);
  const [uploadFile] = useMutation(ZIP_FILE);

  let contactIdArray: any = [];
  const [getClients, { data: ipData, loading: ipLoading }] = useLazyQuery(
    GET_CLIENTS,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: (data: any) => {
        setShowBackdrop(false);
        if (userRole === "CompanyUser") {
          let partnerdata = JSON.parse(partner);
          createTableDataObject(data.getClient.edges);
        }
        if (userRole === "SuperUser") {
          createTableDataObjectAdmin(data.getClient.edges);
        }
      },
      onError: (error) => {
        logout()
      },
    }
  );

  const [
    getProsClients,
    { data: ProspectusClientData, loading: ProspectusClientLoading },
  ] = useLazyQuery(GET_PROSPECT_CLIENTS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data: any) => {
      setShowBackdrop(false);
      if (userRole === "CompanyUser") {
      let partnerdata =  JSON.parse(partner)
      createProspectTableDataObject(data.getCompanyData[0].data);
      }
      // if (userRole === "SuperUser") {
      // createTableDataObjectAdmin(data.getClient.edges);
      // }
    },
    onError: (error) => {
      logout()
    },
  });
  const [
    getClientsAndReports,
    { data: ClientReportData, loading: ClientReportLoading },
  ] = useLazyQuery(GET_CLIENT_AND_LATEST_REPORTS, {
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      logout();
      // history.push(routeConstant.DASHBOARD);
    },
  });

  let column: any;
  if (userRole === "CompanyUser") {
    column = CompanyUsercolumns;
  } else {
    column = SuperUsercolumns;
  }

  useEffect(() => {
    if (
      props.location.state == null ||
      (props.location.state == undefined && partner !== null && user !== null)
    ) {
      let partnerdata = JSON.parse(partner);
      let userdata = JSON.parse(user);
      localStorage.setItem(
        "user",
        JSON.stringify(userdata.data.getUserDetails.edges[0].node)
      );
      localStorage.setItem(
        "partnerData",
        JSON.stringify(partnerdata.data.getPartnerUserDetails.edges[0].node)
      );
    }
  }, [partner]);

  useEffect(() => {
    if (ipData != undefined) {
      createTableDataObject(ipData.getClient.edges);
    }
  }, [ClientReportData]);

  useEffect(() => {
    // On Login from tool
    if (Cookies.getJSON("ob_session")) {
      if (
        props.location.state == null ||
        (props.location.state == undefined && partner !== null && user !== null)
      ) {
        let partnerdata = JSON.parse(partner);
        if (partnerdata.data != null) {
          if (
            partnerdata.data.getPartnerUserDetails.edges[0].node.hasOwnProperty(
              "partnerId"
            )
          ) {
            console.log(
              "props.location.state",
              partnerdata.data.getPartnerUserDetails.edges[0].node.partnerId.id
            );
            getClients({
              variables: {
                orderBy: "client_name",
                partnerId_PartnerName:
                  partnerdata.data.getPartnerUserDetails.edges[0].node.partnerId
                    .partnerName,
                client_type: "Client",
              },
            });
            getProsClients({
              variables: {
                pgPartnerId:
                  partnerdata.data.getPartnerUserDetails.edges[0].node.partnerId
                    .id,
                // client_type: "Prospect"
              },
            });
            getClientsAndReports({
              variables: {
                partnerId:
                  partnerdata.data.getPartnerUserDetails.edges[0].node.partnerId
                    .id,
              },
            });
          }
        }
      }
      if (
        props.location.state !== null &&
        props.location.state !== undefined &&
        props.location.state.partner_id
      ) {
        getClients({
          variables: {
            orderBy: "client_name",
            partnerId_PartnerName: props.location.state.partner_id,
            client_type: "Client",
          },
        });
        // getProsClients({
        //   variables: {
        //     // orderBy: "client_name",
        //     pgPartnerId: props.location.state.partner_id,
        //     // client_type: "Prospect",
        //   },
        // });
      }
      if (props.location.state && props.location.state.clientInfo) {
        getClients({
          variables: {
            orderBy: "client_name",
            partnerId_PartnerName: props.location.state.clientInfo.partnerId,
            client_type: "Client",
          },
        });

        if (partner != "") {
          let partnerdata = JSON.parse(partner);
          getClientsAndReports({
            variables: {
              partnerId:
                partnerdata.data.getPartnerUserDetails.edges[0].node.partnerId
                  .id,
            },
          });
        }
      }
      if (
        props.location.state &&
        props.location.state !== null &&
        props.location.state.formState
      ) {
        setFormState(props.location.state.formState);
      }
      if(userRole != "SuperUser") {
        let partnerData = JSON.parse(partner)
         getProsClients({
          variables: {
            // orderBy: "client_name",
            pgPartnerId: partnerData.data.getPartnerUserDetails.edges[0].node.partnerId.id ,
            // client_type: "Prospect",
          },
        });
      }
    } else {
      logout();
    }
  }, []);

  // useEffect(() => {
  //   if (
  //     formState.isDelete === true ||
  //     formState.isFailed === true ||
  //     formState.isSuccess === true ||
  //     formState.isUpdate === true
  //   ) {
  //     setTimeout(function() {
  //       handleAlertClose();
  //     }, ALERT_MESSAGE_TIMER);
  //   }
  // }, [formState]);

  const createTableDataObjectAdmin = (data: any) => {
    let arr: any = [];
    data.map((element: any) => {
      let obj: any = {};
      obj["email"] = !element.node.emailId ? "-" : element.node.emailId;
      obj["name"] = element.node.clientName;
      obj["phone"] = !element.node.mobileNumber
        ? "-"
        : element.node.mobileNumber;
      obj["clientId"] = element.node.id;
      obj["partnerId"] = element.node.partner.partnerName;
      obj["createdOn"] = moment(element.node.createdDate).format(
        "MM/DD/YYYY hh:mm a"
      );
      obj["subscription"] = element.node.subscription;
      arr.push(obj);
    });

    setNewData(arr);
  };

  const handlePublishchange = (event: any, rowData: any) => {
    // if (event.target.checked !== undefined) {
    setShowBackdrop(true);
    publishReport({
      variables: {
        input: {
          client: parseInt(rowData.clientId),
          targetName: rowData.targetName,
          flagStatus: true,
        },
      },
    })
      .then((response: any) => {
        setShowBackdrop(false);
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
          // if (
          //   props.location.state !== null &&
          //   props.location.state !== undefined &&
          //   props.location.state.partner_id
          // ) {
          //   getProsClients({
          //     variables: {
          //       // orderBy: "client_name",
          //       partner_name: props.location.state.partner_id,
          //       client_type: "Prospect"
          //     },
          //   });
          // }
          // if (props.location.state && props.location.state.clientInfo) {
          //   getProsClients({
          //     variables: {
          //       // orderBy: "client_name",
          //       partner_name: props.location.state.clientInfo.partnerId,
          //       client_type: "Prospect"
          //     },
          //   });
          // }
          // getReportListingData({
          //   variables: {
          //     clientname: propsClientName,
          //   },
          // });
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
  };
  const createProspectTableDataObject = (data: any) => {
    let arr: any = [];
    data.map((element: any) => {
      let obj: any = {};
      obj["prospectName"] = element.clientName;
      obj["clientId"] = element.clientId;
      obj["external"] = element.external;
      obj["pentest"] = element.pentest;

      // obj["targetId"] = element.node.id !== 0 ? element.node.id : null;

      // obj["scanType"] = element.node.scanType;
      // obj["status"] = element.node.targetStatus.name;
      // obj["publish"] =
      //   element.node.publishedFlag == "Unpublished" ? false : true;
      // obj["targetName"] = element.node.targetName;
      arr.push(obj);
    });
    setProspectData(arr);
  };

  const createTableDataObject = (data: any) => {
    let arr: any = [];
    data.map((element: any) => {
      if (element.node.subscription === "Yes") {
        let obj: any = {};
        obj["email"] = !element.node.emailId ? "-" : element.node.emailId;
        obj["name"] = element.node.clientName;
        obj["phone"] = !element.node.mobileNumber
          ? "-"
          : element.node.mobileNumber;
        obj["clientId"] = element.node.id;
        // obj["partnerId"] = partnerdata.data.getPartnerUserDetails.edges[0].node.partnerId.id
        // obj["partnerName"] = element.node.partner.partnerName;
        obj["partnerId"] = element.node.partner.partnerName;
        obj["createdOn"] = moment(element.node.createdDate).format(
          "MM/DD/YYYY hh:mm a"
        );
        obj["subscription"] = element.node.subscription;
        if (ClientReportData) {
          for (let i in ClientReportData.reportForPg) {
            ClientReportData.reportForPg[i].data.map((data: any) => {
              if (element.node.id === data.clientId.toString()) {
                obj["lastReportGenerated"] = moment(
                  data.targetCreationDate
                ).format("MM/DD/YYYY hh:mm a");
                obj["targetName"] = data.targetName;
              }
            });
          }
        }
        arr.push(obj);
      }
      // if(element.node.subscription === "No") {
      //   let obj: any = {};
      //   obj["name"] = "You don't have any client subscribed for CyberCompliance360"
      //   arr.push(obj);
      // }
    });

    setNewData(arr);
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

  const handleClickEdit = (rowData: any) => {
    handleAlertClose();
    history.push(routeConstant.CLIENT_FORM_EDIT + rowData.clientId, rowData);
  };
  const handleClickDelete = (rowData: any) => {
    handleAlertClose();
    setClientDeleted(false);
    setShowBackdrop(true);
    deleteClient({
      variables: {
        id: rowData.clientId,
      },
    })
      .then((res: any) => {
        setShowBackdrop(false);
        if (res.data.deleteClient.status === "Client is deleted") {
          setClientDeleted(true);
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: true,
            isFailed: false,
            errMessage: "  " + rowData.name + "  ",
          }));
        }
        if (res.data.deleteClient.status === "Client is not deleted") {
          setShowBackdrop(false);
          setFormState((formState) => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: false,
            isFailed: true,
            errMessage: " Failed to Delete Client " + rowData.name + " ",
          }));
        }
      })
      .catch((err) => {
        setShowBackdrop(false);
        setFormState((formState) => ({
          ...formState,
          isSuccess: false,
          isUpdate: false,
          isDelete: false,
          isFailed: true,
          errMessage: err,
        }));
      });
  };

  const onRowClick = (event: any, rowData: any, oldData: any, param: any) => {
    handleAlertClose();
    let data: any = { clientInfo: rowData, partnerId: partner };
    if (param === "RA") {
      // setShowBackdrop(true)
      if (Cookies.getJSON("ob_session")) {
        history.push(routeConstant.RA_REPORT_LISTING, data);
      } else {
        logout();
      }
    }
    if (param === "Edit") {
      handleClickEdit(rowData);
    }
    if (param === "Delete") {
      handleClickDelete(rowData);
    }
    if (param === "Add") {
      if (Cookies.getJSON("ob_session")) {
        let data = { clientInfo: rowData };
        history.push(routeConstant.TARGET, data);
      } else {
        logout();
      }
    }
    if (param === "AddExternal") {
      if (Cookies.getJSON("ob_session")) {
        let data = { clientInfo: rowData };
        history.push(routeConstant.EXTERNAL_TARGET, data);
      } else {
        logout();
      }
    }
    if (param === "penTest") {
      if (Cookies.getJSON("ob_session")) {
        let data = { clientInfo: rowData };
        history.push(routeConstant.PEN_TEST, data);
      } else {
        logout();
      }
    }
    if (param === "ViewExternal") {
      if (Cookies.getJSON("ob_session")) {
        let data = { clientInfo: rowData ,type: "External"};
        history.push(routeConstant.VIEW_PROSPECT, data);
      } else {
        logout();
      }
    }
    if (param === "viewPenTest") {
      if (Cookies.getJSON("ob_session")) {
        let data = { clientInfo: rowData ,type: "PenTest"};
        history.push(routeConstant.VIEW_PROSPECT, data);
      } else {
        logout();
      }
    }
    
  };
  // if (ipLoading || showBackdrop) return <SimpleBackdrop />;
  const handleDownload = (rowData: any) => {
    handleAlertClose();
    if (Cookies.getJSON("ob_session")) {
      setShowBackdrop(true);
      let intTargetId = parseInt(rowData.targetId);
      const DocUrl =
        RA_REPORT_DOWNLOAD + "?cid=" + rowData.clientId + "&tid=" + intTargetId;
      fetch(DocUrl, {
        method: "GET",
      })
        .then((response: any) => {
          response.blob().then((blobData: any) => {
            saveAs(blobData, rowData.target);
            setShowBackdrop(false);
          });
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
    } else {
      logout();
    }
  };
  const handleUpload = (rowData: any) => {
    if (selectedFile[rowData.targetId]) {
      setShowBackdrop(true);
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
              setShowBackdrop(false);
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
              setShowBackdrop(false);
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
            setShowBackdrop(false);
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
  return (
    <React.Fragment>
      <CssBaseline />
      {showBackdrop ? <SimpleBackdrop /> : null}
      <Typography component="h5" variant="h1">
        Clients
      </Typography>
      <Grid>
        {showBackdrop ? <SimpleBackdrop /> : null}
        <Grid container className={styles.backToListButtonPanel}>
          <Grid item xs={12} md={12} className={styles.backToListButton}>
            <div className={styles.ButtonGroup1}>
              <div className={styles.FilterInputgotolist}>
                {userRole === "SuperUser" ? (
                  <Button
                    className={styles.BackToButton}
                    variant={"contained"}
                    onClick={() => {
                      history.push(routeConstant.ADD_PARTNER);
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
                ) : null}
              </div>
            </div>
          </Grid>
          {/* {partner.partnerId ? (
            <Grid item xs={12} md={12} className={styles.FilterAddWrap}>
              <div className={styles.FilterInput}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleClickOpen}
                >
                  <AddCircleIcon className={styles.EditIcon} />
                  &nbsp; Client
                </Button>
              </div>
            </Grid>
          ) : null} */}
        </Grid>
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
            Client<strong>{formState.errMessage}</strong>
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
            Client<strong>{formState.errMessage}</strong>
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
        <Paper className={styles.paper}>
          <div className={styles.ScrollTable}>
            {newData.length !== 0 ? (
              <MaterialTable
                columns={column}
                data={newData}
                actions={[
                  // Pg merge
                  // partner.partnerId
                  //   ? {
                  //       icon: () => (
                  //         <img
                  //           className={styles.EditIcon}
                  //           src={
                  //             process.env.PUBLIC_URL + "/icons/svg-icon/edit.svg"
                  //           }
                  //           alt="edit icon"
                  //         />
                  //       ),
                  //       tooltip: "Edit",
                  //       onClick: (event: any, rowData: any, oldData: any) => {
                  //         onRowClick(event, rowData, oldData, "Edit");
                  //       }
                  //     }
                  //   : null,
                  userRole != "SuperUser"
                    ? {
                        icon: () => <ComputerIcon />,
                        tooltip: "Pen Test",
                        onClick: (event: any, rowData: any, oldData: any) => {
                          onRowClick(event, rowData, oldData, "penTest");
                        },
                      }
                    : null,
                  userRole != "SuperUser"
                    ? {
                        icon: () => (
                          <AddCircleIcon className={styles.CircleIcon} />
                        ),
                        // icon: () => <AddCircleIcon className={styles.CircleIcon} />,
                        tooltip: "Create External Vulnerability Test",
                        onClick: (event: any, rowData: any, oldData: any) => {
                          onRowClick(event, rowData, oldData, "AddExternal");
                        },
                      }
                    : null,
                  userRole != "SuperUser"
                    ? {
                        icon: () => (
                          <AddToPhotosIcon className={styles.CircleIcon} />
                        ),
                        tooltip: "Create Advanced Vulnerability Test",
                        onClick: (event: any, rowData: any, oldData: any) => {
                          onRowClick(event, rowData, oldData, "Add");
                        },
                      }
                    : null,
                  {
                    icon: () => <VisibilityIcon />,
                    tooltip: "View Vulnerability Tests",
                    onClick: (event: any, rowData: any, oldData: any) => {
                      onRowClick(event, rowData, oldData, "RA");
                    },
                  },

                  // Pg merge
                  // {
                  //   icon: () => <DeleteIcon />,
                  //   tooltip: "Delete",
                  //   onClick: (event: any, rowData: any, oldData: any) => {
                  //     onRowClick(event, rowData, oldData, 'Delete');
                  //   },
                  // },
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
            ) : !showBackdrop ? (
              <Typography component="h5" variant="h3">
                You don't have any client subscribed for OB360
              </Typography>
            ) : null}
          </div>
        </Paper>
        <Typography component="h5" variant="h1">
          Prospects
        </Typography>
        <Paper className={styles.paper}>
          <div className={styles.ScrollTable}>
            {prospectData.length !== 0 ? (
              <MaterialTable
                columns={ProspectUsercolumns}
                data={prospectData}
                actions={[
                  (rowData: any) =>
                      rowData.pentest && userRole != "SuperUser"
                      ? {
                          icon: () => <ComputerIcon />,
                          tooltip: "Pen Test",
                          onClick: (event: any, rowData: any, oldData: any) => {
                            onRowClick(event, rowData, oldData, "viewPenTest");
                          },
                        }
                      : null,
                      (rowData: any) =>
                      rowData.external && userRole != "SuperUser"
                      ?  {
                        icon: () => (
                          <AddCircleIcon className={styles.CircleIcon} />
                        ),
                        // icon: () => <AddCircleIcon className={styles.CircleIcon} />,
                        tooltip: "View External Vulnerability Test",
                        onClick: (event: any, rowData: any, oldData: any) => {
                          onRowClick(event, rowData, oldData, "ViewExternal");
                        },
                      }
                      : null,



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
            ) : !showBackdrop ? (
              <Typography component="h5" variant="h3">
                You don't have any Prospects for OB360
              </Typography>
            ) : null}
          </div>
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default Client;
