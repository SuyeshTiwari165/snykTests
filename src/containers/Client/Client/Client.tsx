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
// import {
//   CREATE_CONTACT,
//   UPDATE_CONTACT,
// } from "../../../graphql/mutations/Contacts";
import { CREATE_CLIENT, UPDATE_CLIENT } from "../../../graphql/mutations/Clients";
// import { GET_ORGANIZATION } from "../../graphql/queries/Organization";
// import { GET_CONTACT_INFO } from "../../graphql/queries/Contact";
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import AssessmentIcon from "@material-ui/icons/Assessment";
import DeleteIcon from "@material-ui/icons/Delete";
import DescriptionIcon from "@material-ui/icons/Description";
import * as routeConstant from "../../../common/RouteConstants";
import { useHistory } from "react-router-dom";
import logout from "../../Auth/Logout/Logout";
import { GET_CLIENT } from "../../../graphql/queries/Client";
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

export const Client: React.FC = (props: any) => {
  const history = useHistory();
  const contact = JSON.parse(localStorage.getItem("contact") || "{}");
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [ContactId, setContactId] = useState("");
  const [OrgId, setOrgId] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newData, setNewData] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [createFlag, setCreateFlag] = useState(false);
  const [rowData, setRowData] = useState(false);
  const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");
  useEffect(() => {
    if (props.location.state && props.location.state != null && props.location.state.showAddClient) {
      setOpenEdit(true)
    } else {
      setOpenEdit(false)
    }
  }, [])

  //table
  const column = [
    { title: "Company Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Phone", field: "phone" },
    { title: "Created on", field: "createdon" },
  ];

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

  let contactIdArray: any = [];
  const [
    getClients,
    { data: ipData, loading: ipLoading },
  ] = useLazyQuery(GET_CLIENT, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      createTableDataObject(data.getClient.edges)
    },
  });


  useEffect(() => {
    console.log("---partner,", partner);
    if (partner)
      getClients({
        variables: {
          partnerId: partner.partnerId
        },
      });
  }, []);

  const createTableDataObject = (data: any) => {
    let arr: any = [];
    data.map((element: any) => {
      let obj: any = {};
      // obj["createdon"] = moment(element.contact_id.created_at).format(
      //   "MM/DD/YYYY hh:mm a"
      // );
      console.log("element", element)
      obj["email"] = !element.node.emailId ? "-" : element.node.emailId;
      obj["name"] = element.node.clientName;
      obj["phone"] = !element.node.mobileNumber ? "-" : element.node.mobileNumber;
      obj["clientId"] = element.node.id;
      obj["partnerId"] = element.node.partnerId;
      obj["clientOrgId"] = element.id;
      arr.push(obj);
    });
    setNewData(arr.sort(function (a: any, b: any) {
      // var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
      // if (nameA < nameB) //sort string ascending
      return -1;
      // if (nameA > nameB)  //sort string decending
      //  return 1;
      return 0; //default return value (no sorting)
    }));
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

  const handleClickOpen = (rowData: any) => {
    // let partnerData: any = { "partner_id": partnerID }
    history.push(routeConstant.CLIENT_FORM_ADD, props.location.state);
  };

  // if (loadingOrg || iLoading || ipLoading) return <Loading />;
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
        name: err,
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
      if (event.target.value && !validations.EMAIL_REGEX.test(event.target.value)) {
        let errors = "Please enter valid email address.";
        setIsError((error: any) => ({
          ...error,
          email: errors,
        }));
      } else {
        setIsError({ 'error': null })
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
        name: err,
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
        email: errors,
      }));
      foundErrors = true;
    }

    return foundErrors;
  };

  const handleSubmit = () => {

  };

  const backToList = () => {
    history.push(routeConstant.CLIENT);
    setIsError({ error: null });
    setOpenEdit(false);
    setRowData(false);
    setOrgId("");
    setContactId("");
    setName("");
    setEmail("");
    setPhoneNumber("");
    setCreateFlag(false);
  };

  const onRowClick = (event: any, rowData: any, oldData: any, param: any) => {
    let data: any = { clientInfo: rowData };
    if (param === "RA") {
      history.push(routeConstant.RA_REPORT_LISTING, data);
    }
    if (param === "View") {
    }
    if (param === "Edit") {
      handleClickOpen(rowData);
    }
    if (param === "Delete") {
    }
  };
  if (createFlag) return <Loading />;

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        {!openEdit ? "Clients" :
          <div>
            {rowData ? "Edit Client " : "Add Client"}
            {/* {rowData ? rowData.name : null} */}
          </div>}
      </Typography>
      <Grid>
        <Grid container>
          <Grid item xs={6} sm={9} className={styles.FilterWrap}>
            {/* <div className={styles.FilterInput}>
                <Input
                  label="Name"
                  name="filterName"
                  id="combo-box-demo"
                  // value={filterName}
                  // onChange={nameFilter}
                />
              </div> */}
          </Grid>
          <Grid item xs={3} sm={3} className={styles.FilterAddWrap}>
            <div className={styles.FilterInput}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleClickOpen}
              >
                <AddCircleIcon />
                  &nbsp; Client
                </Button>
            </div>
          </Grid>
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
          <div className={styles.ScrollTable}>
            <MaterialTable
              columns={column}
              data={newData}
              actions={[
                {
                  icon: () => <EditIcon />,
                  tooltip: "Edit",
                  onClick: (event: any, rowData: any, oldData: any) => {
                    onRowClick(event, rowData, oldData, "Edit");
                  },
                },
                {
                  icon: () => <AssessmentIcon />,
                  tooltip: "Risk Assessment",
                  onClick: (event: any, rowData: any, oldData: any) => {
                    onRowClick(event, rowData, oldData, "RA");
                  },
                }
                // {
                //   icon: () => <VisibilityIcon />,
                //   tooltip: "View",
                //   onClick: (event: any, rowData: any, oldData: any) => {
                //     onRowClick(event, rowData, oldData, 'View');
                //   },
                // },
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
                  color: "#002F60",
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
            />
          </div>
        </Paper>
      </Grid>

    </React.Fragment>
  );
};

export default Client;
