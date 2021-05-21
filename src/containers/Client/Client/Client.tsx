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
import {
  CREATE_CLIENT,
  UPDATE_CLIENT
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
import { GET_CLIENTS } from "../../../graphql/queries/Client";
// import { GET_PARTNER_SUBSCRIPTION } from "../../graphql/queries/PartnerSubscription";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER
} from "../../../common/MessageConstants";
import * as validations from "../../../common/validateRegex";
import moment from "moment";
import {DELETE_CLIENT } from "../../../graphql/mutations/Clients";


export const Client: React.FC = (props: any) => {
  const history = useHistory();
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newData, setNewData] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [createFlag, setCreateFlag] = useState(false);
  const [rowData, setRowData] = useState(false);
  const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  let userRole: any;
  if (user) {
    userRole = user.isSuperuser == true ? "SuperUser" : "CompanyUser";
  }
  const [clientDeleted, setClientDeleted] = useState(false);

  //table
  const CompanyUsercolumns = [
    { title: "Company Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Phone", field: "phone" },
    { title: "Created on", field: "createdOn" }
  ];

  const SuperUsercolumns = [{ title: "Company Name", field: "name" }];

  const [isError, setIsError] = useState<any>({
    address: "",
    email: "",
    phoneNumber: ""
  });

  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: ""
  });

  const [deleteClient] = useMutation(DELETE_CLIENT);


  let contactIdArray: any = [];
  const [getClients, { data: ipData, loading: ipLoading }] = useLazyQuery(
    GET_CLIENTS,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: (data : any) => {
        createTableDataObject(data.getClient.edges);
      },
      onError: error => {
        // logout()
        history.push(routeConstant.DASHBOARD);
      }
    }
  );

  let column: any;
  if (partner.partnerId) {
    column = CompanyUsercolumns;
  } else {
    column = SuperUsercolumns;
  }

  useEffect(() => {
    // On Login from tool
    if (partner.hasOwnProperty("partnerId")) {
      getClients({
        variables: {
          orderBy : "client_name",
          partnerId_PartnerName: partner.partnerId.partnerName
        }
      });
    }
    if (
      props.location.state !== null &&
      props.location.state !== undefined &&
      props.location.state.partner_id
    ) {
      getClients({
        variables: {
          orderBy : "client_name",
          partnerId_PartnerName: props.location.state.partner_id
        }
      });
    }
    if (props.location.state && props.location.state.clientInfo) {
      getClients({
        variables: {
          orderBy : "client_name",
          partnerId_PartnerName: props.location.state.clientInfo.partnerId
        }
      });
    }
    if (
      props.location.state &&
      props.location.state !== null &&
      props.location.state.formState
    ) {
      setFormState(props.location.state.formState);
    }
  }, []);

  // useEffect(() => {
  //   if (partner !== "{}") {
  //     getClients({
  //       variables: {
  //         orderBy : "client_name",
  //         partnerId_PartnerName: partner.partnerId
  //       }
  //     });
  //   }
  //   if (
  //     props.location.state !== null &&
  //     props.location.state !== undefined &&
  //     props.location.state.partner_id
  //   ) {
  //     getClients({
  //       variables: {
  //         orderBy : "client_name",
  //         partnerId: props.location.state.partner_id
  //       }
  //     });
  //   }
  //   if (props.location.state && props.location.state.clientInfo) {
  //     getClients({
  //       variables: {
  //         orderBy : "client_name",
  //         partnerId: props.location.state.clientInfo.partnerId
  //       }
  //     });
  //   }
  //   if (
  //     props.location.state &&
  //     props.location.state !== null &&
  //     props.location.state.formState
  //   ) {
  //     setFormState(props.location.state.formState);
  //   }
  // }, [clientDeleted]);

  useEffect(() => {
    if (
      formState.isDelete === true ||
      formState.isFailed === true ||
      formState.isSuccess === true ||
      formState.isUpdate === true
    ) {
      setTimeout(function() {
        handleAlertClose();
      }, ALERT_MESSAGE_TIMER);
    }
  }, [formState]);

  function convertDate(inputFormat: any) {
    function pad(s: any) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
  }

  const getDateAndTime = (utcDate: any) => {
    if (utcDate === "" || utcDate === null) {
      return null;
    } else {
      var dateFormat: any = new Date(utcDate);
      var hours = dateFormat.getHours();
      var minutes = dateFormat.getMinutes();
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      var dateAndTime = convertDate(new Date(utcDate)) + " " + strTime;
      return dateAndTime;
    }
  };

  const createTableDataObject = (data: any) => {
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
      arr.push(obj);
    });
    setNewData(arr);
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

  const handleClickEdit = (rowData: any) => {
    history.push(routeConstant.CLIENT_FORM_EDIT + rowData.clientId, rowData);
  };
  const handleClickDelete = (rowData: any) => {
    setClientDeleted(false);
    setShowBackdrop(true);
    console.log("DELETE",rowData)
    deleteClient({
      variables: {
        id: rowData.clientId
      },
    }).then((res: any) => {
      setShowBackdrop(false);
      console.log("RES",res.data.deleteClient.status);
      if(res.data.deleteClient.status === "Client is deleted") {
        setClientDeleted(true);
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: true,
        isFailed: false,
        errMessage: "  " + rowData.name + "  " ,
      }));
    }
    if(res.data.deleteClient.status === "Client is not deleted") {
      setShowBackdrop(false);
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: " Failed to Delete Client " + rowData.name + " " ,
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
  }

  const handleClickOpen = (rowData: any) => {
    history.push(routeConstant.CLIENT_FORM_ADD);
  };

  if (ipLoading || showBackdrop) return <SimpleBackdrop />;
  // if (iError) {
  //   let error = { message: "Error" };
  //   return (
  //     <div className="error">
  //       Error!
  //       {logout()}
  //     </div>
  //   )
  // }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "Name") {
      setName(event.target.value);
      let err = event.target.value === "" || null ? "Required" : "";
      setIsError((error: any) => ({
        ...error,
        name: err
      }));
    }
    if (event.target.name === "email") {
      setEmail(event.target.value);
      // let err = event.target.value === "" || null ? "Required" : "";
      // setIsError((error: any) => ({
      //   ...error,
      //   email: err,
      // }));
      //  if (!err) {
      if (
        event.target.value &&
        !validations.EMAIL_REGEX.test(event.target.value)
      ) {
        let errors = "Please enter valid email address.";
        setIsError((error: any) => ({
          ...error,
          email: errors
        }));
      } else {
        setIsError({ error: null });
      }
      // }
    }
    if (event.target.name === "phoneNumber") {
      setPhoneNumber(event.target.value);
      // let err = event.target.value === "" || null ? "Required" : "";
      // setIsError((error: any) => ({
      //   ...error,
      //   phoneNumber: err,
      // }));
      // if (!err) {
      //   if (phoneNumber.length < 9 ) {
      //     let errors = "Please enter valid Phone no.";
      //     setIsError((error: any) => ({
      //       ...error,
      //       phoneNumber: errors,
      //     }));
      //   }
      // }
    }
    setSubmitDisabled(checkValidation);
  };

  const checkValidation = () => {
    let validation = false;
    // if (isError.name !== "") {
    //   validation = true;
    // }
    return validation;
  };
  const handleInputErrors = () => {
    let foundErrors = false;
    if (!name) {
      let err = "Name is Required";
      setIsError((error: any) => ({
        ...error,
        name: err
      }));
      foundErrors = true;
    }
    // if(!email) {
    //   let errors = "Required";
    //   setIsError((error: any) => ({
    //     ...error,
    //     email: errors,
    //   }));
    //   foundErrors = true;
    // }
    if (email && !validations.EMAIL_REGEX.test(email)) {
      let errors = "Please enter valid email address.";
      setIsError((error: any) => ({
        ...error,
        email: errors
      }));
      foundErrors = true;
    }

    return foundErrors;
  };

  const onRowClick = (event: any, rowData: any, oldData: any, param: any) => {
    let data: any = { clientInfo: rowData, partnerId : partner };
    if (param === "RA") {
      console.log("data",data);
      // setShowBackdrop(true)
      history.push(routeConstant.RA_REPORT_LISTING, data);
    }
    if (param === "View") {
    }
    if (param === "Edit") {
      handleClickEdit(rowData);
    }
    if (param === "Delete") {
      handleClickDelete(rowData)
    }
  };
  if (createFlag) return <SimpleBackdrop />;

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">Client</Typography>
      <Grid>
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
        <Paper className={styles.paper}>
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
          <div className={styles.ScrollTable}>
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
                {
                  icon: () => <AssessmentIcon />,
                  tooltip: "Risk Assessment",
                  onClick: (event: any, rowData: any, oldData: any) => {
                    onRowClick(event, rowData, oldData, "RA");
                  }
                },
                // {
                //   icon: () => <VisibilityIcon />,
                //   tooltip: "View",
                //   onClick: (event: any, rowData: any, oldData: any) => {
                //     onRowClick(event, rowData, oldData, 'View');
                //   },
                // },
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
                  backgroundColor: "#EFF6FD",
                  color: "#002F60"
                },
                thirdSortClick: false,
                actionsColumnIndex: -1,
                paging: true,
                sorting: true,
                search: false,
                filter: true,
                draggable: false,
                pageSize: 25,
                pageSizeOptions: [25, 50, 75, 100] // rows selection options
              }}
            />
          </div>
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default Client;
