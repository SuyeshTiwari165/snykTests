import React, { useEffect, useState } from "react";
import styles from "./ClientForm.module.css";
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
import { CREATE_CLIENT, UPDATE_CLIENT } from "../../../graphql/mutations/Clients";
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import AssessmentIcon from "@material-ui/icons/Assessment";
import DeleteIcon from "@material-ui/icons/Delete";
import DescriptionIcon from "@material-ui/icons/Description";
import * as routeConstant from "../../../common/RouteConstants";
import { useHistory } from "react-router-dom";
import logout from "../../Auth/Logout/Logout";
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
  const [CCsubscription, setCCsubscription] = useState(false);
  const [RAsubscription, setRAsubscription] = useState(false);
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
  
  const [createClient, { data }] = useMutation(CREATE_CLIENT);

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
  console.log("props",props)
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
    if (!handleInputErrors()) {
      if (props.location.pathname.includes("/partner-form/edit")) {
        updateIntoPartner();
      } else {
        insertIntoPartner();
      }
    }
  };

  const insertIntoPartner = () => {
    createClient({
      variables: {
        input: {
          partnerId: partner.partnerId,
          clientName: name,
          mobileNumber: phoneNumber,
          emailId: email
        }
      },
    }).then((res: any) => {
      console.log("res", res)
      backToList();
    })
  };

  const updateIntoPartner = () => {
    // updateClient({
    //   variables: {
    //     input: {
    //       partnerId: 4,
    //       clientName: name,
    //       mobileNumber: phoneNumber,
    //       emailId: email
    //     }
    //   },
    // }).then((res: any) => {
    //   console.log("res", res)
    //   backToList();
    // })
  }

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
    </React.Fragment>
  );
};

export default Client;
