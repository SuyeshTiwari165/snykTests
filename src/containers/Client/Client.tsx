import React, { useEffect, useState } from "react";
import styles from "./Client.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import { Button } from "../../components/UI/Form/Button/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AddEditForm } from "../../components/UI/AddEditForm/AddEditForm";
import Input from "../../components/UI/Form/Input/Input";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Alert from "../../components/UI/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "../../components/UI/Table/MaterialTable";
import Loading from "../../components/UI/Layout/Loading/Loading";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
// import {
//   CREATE_CONTACT,
//   UPDATE_CONTACT,
// } from "../../../graphql/mutations/Contacts";
// import { CREATE_ORG, UPDATE_ORG } from "../../graphql/mutations/Organization";
// import { GET_ORGANIZATION } from "../../graphql/queries/Organization";
// import { GET_CONTACT_INFO } from "../../graphql/queries/Contact";
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import AssessmentIcon from "@material-ui/icons/Assessment";
import DeleteIcon from "@material-ui/icons/Delete";
import DescriptionIcon from "@material-ui/icons/Description";
import * as routeConstant from "../../common/RouteConstants";
import { useHistory } from "react-router-dom";
import logout from "../../containers/Auth/Logout/Logout";
// import { GET_INDIVIDUAL } from "../../graphql/queries/Individual";
// import { GET_PARTNER_SUBSCRIPTION } from "../../graphql/queries/PartnerSubscription";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../common/MessageConstants";
import * as validations from "../../common/validateRegex";
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
  const [CCsubscription, setCCsubscription] = useState(false);
  const [RAsubscription, setRAsubscription] = useState(false);
  const [createFlag, setCreateFlag] = useState(false);
  const [rowData, setRowData] = useState(false);

  

  useEffect(() => {
    if (props.location.state && props.location.state != null && props.location.state.showAddClient) {
      setOpenEdit(true)
    }else {
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

  // const [createContact] = useMutation(CREATE_CONTACT);
  // const [UpdateContact] = useMutation(UPDATE_CONTACT);
  // const [createOrganization] = useMutation(CREATE_ORG);
  // const [updateOrganization] = useMutation(UPDATE_ORG);

  // const [getIndividual, { data: iData, error: iError, loading: iLoading }] = useLazyQuery(
  //   GET_INDIVIDUAL,
  //   {
  //     fetchPolicy: "cache-and-network",
  //     onCompleted: () => {
  //       getPartnerSubs({
  //         variables: {
  //           where: { contact_id: iData.individuals[0].partner_id.id },
  //         },
  //       });
  //       getIndividualpartner({
  //         variables: {
  //           where: { partner_id: iData.individuals[0].partner_id.id },
  //         },
  //       });
  //     },
  //   }
  // );
  let contactIdArray: any = [];
  // const [
  //   getIndividualpartner,
  //   { data: ipData, loading: ipLoading },
  // ] = useLazyQuery(GET_INDIVIDUAL, {
  //   fetchPolicy: "cache-and-network",
  //   onCompleted: (data) => {
  //     // if( ipData[0]){
  //     for (let i in data.individuals) {
  //       contactIdArray.push(data.individuals[i].contact_id.id);
  //     }
  //     console.log("ipData", data.individuals[0]);
  //     // }
  //     // createTableDataObject(ipData.individuals)
  //   },
  // });
  // const [getPartnerSubs, { data: dataSubs, loading: loadSubs }] = useLazyQuery(
  //   GET_PARTNER_SUBSCRIPTION,
  //   {
  //     onCompleted: (data: any) => {
  //       if (data.partnerSubscriptions) {
  //         setCCsubscription(data.partnerSubscriptions[0].cc_subscription);
  //         setRAsubscription(data.partnerSubscriptions[0].ra_subscription);
  //       }
  //     },
  //     fetchPolicy: "cache-and-network",
  //   }
  // );

  const createTableDataObject = (data: any) => {
    // let arr: any = [];
    // data.map((element: any) => {
    //   let obj: any = {};
    //   obj["createdon"] = moment(element.contact_id.created_at).format(
    //     "MM/DD/YYYY hh:mm a"
    //   );
    //   obj["email"] = !element.contact_id.email ? "-" : element.contact_id.email;
    //   obj["name"] = element.contact_id.name;
    //   obj["phone"] = !element.contact_id.phone ? "-" : element.contact_id.phone;
    //   obj["clientId"] = element.contact_id.id;
    //   obj["partnerId"] = element.partner_id.id;
    //   obj["clientOrgId"] = element.id;
    //   arr.push(obj);
    // });
    // setNewData(arr.sort(function(a:any, b:any){
    //   var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
    //   if (nameA < nameB) //sort string ascending
    //    return -1;
    //   // if (nameA > nameB)  //sort string decending
    //   //  return 1;
    //   return 0; //default return value (no sorting)
    //  }));
  };
  // if(contactIdArray.length > 0){
  // const { data: dataOrg, error: errorOrg, loading: loadingOrg } = useLazyQuery(GET_ORGANIZATION, {
  // const [
  //   getOrganization,
  //   { data: dataOrg, loading: loadingOrg },
  // ] = useLazyQuery(GET_ORGANIZATION, {
  //   fetchPolicy: "cache-and-network",
  //   onError: () => {
  //     logout();
  //   },
  //   onCompleted: () => {
  //     createTableDataObject(dataOrg.organizations);
  //   },
  // });
  // }

  // useEffect(() => {
  //   console.log("---caleed");
  //   getIndividual({
  //     variables: {
  //       where: { partner_id_null: false, contact_id: contact.id },
  //     },
  //   });
  // }, [createFlag]);

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

  // useEffect(() => {
  //   if (contactIdArray.length > 0) {
  //     getOrganization({
  //       variables: {
  //         where: { subtype: "Client", partner_id: contactIdArray },
  //         // sort: "created_at:desc"
  //       },
  //     });
  //   }
  // }, [contactIdArray]);

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
    setFormState((formState) => ({
      ...formState,
      isSuccess: false,
      isUpdate: false,
      isDelete: false,
      isFailed: false,
      errMessage: "",
    }));
    if (rowData) {
      if (rowData.name) {
        setRowData(true);
        setName(rowData.name);
      }
      if (rowData.clientId) {
        setContactId(rowData.clientId);
      }
      if (rowData.clientOrgId) {
        setOrgId(rowData.clientOrgId);
      }
      if (rowData.email && rowData.email != "-") {
        setEmail(rowData.email);
      }
      if (rowData.phone && rowData.phone != "-") {
        setPhoneNumber(rowData.phone);
      }
    }
    // setName("");
    // setEmail("");
    // setPhoneNumber(phone);
    setOpenEdit(true);
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
          setIsError({'error': null})
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
      {!openEdit ? (
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
                CCsubscription
                  ? {
                      id: "CC",
                      icon: () => <DescriptionIcon />,
                      tooltip: "Cyber Compliance",
                      onClick: (event: any, rowData: any, oldData: any) => {
                        onRowClick(event, rowData, oldData, "CC");
                      },
                    }
                  : null,
                RAsubscription
                  ? {
                      icon: () => <AssessmentIcon />,
                      tooltip: "Risk Assessment",
                      onClick: (event: any, rowData: any, oldData: any) => {
                        onRowClick(event, rowData, oldData, "RA");
                      },
                    }
                  : null,
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
      ) : (
        <AddEditForm
          handleOk={handleSubmit}
          // disabled={submitDisabled}
          handleCancel={backToList}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
            <Grid item xs={6}>
              <Input
                type="text"
                label="Name*"
                name="Name"
                value={name}
                onChange={handleChange}
                error={isError.name}
                helperText={isError.name}
              >
                Name
              </Input>
            </Grid>
            <Grid item xs={6}>
              <Input
                type="text"
                label="Email"
                name="email"
                value={email}
                onChange={handleChange}
                error={isError.email}
                helperText={isError.email}
              >
                E-mail
              </Input>
            </Grid>
            <Grid item xs={6}>
              <Input
                type="text"
                label="Phone Number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleChange}
                error={isError.phoneNumber}
                helperText={isError.phoneNumber}
              >
                Phone Number
              </Input>
            </Grid>
          </Grid>
        </AddEditForm>
      )}
    </React.Fragment>
  );
};

export default Client;
