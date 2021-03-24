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
import { GET_CLIENT } from "../../../graphql/queries/Client";
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
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loader, setLoader] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [createFlag, setCreateFlag] = useState(false);
  const [rowData, setRowData] = useState(false);
  const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");

  const [
    getClients,
    { data: ipData, loading: ipLoading },
  ] = useLazyQuery(GET_CLIENT, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setRowData(true);
      setEmail(data.getClient.edges[0].node.emailId)
      setName(data.getClient.edges[0].node.clientName)
      setPhoneNumber(data.getClient.edges[0].node.mobileNumber)
    },
  });


  useEffect(() => {
    if (props.location.state) {
      getClients({
        variables: {
          clientName: props.location.state.name
        },
      });
    setRowData(true);
    setEmail(props.location.state.email != "-" ? props.location.state.email : "")
    setName(props.location.state.name ? props.location.state.name : "")
    setPhoneNumber(props.location.state.phone != "-" ? props.location.state.phone : "")
    } 
  }, []);

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

  const [createClient, { data: createDataCL }] = useMutation(CREATE_CLIENT);
  const [updateClient, { data: updateDataCL }] = useMutation(UPDATE_CLIENT);

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

  useEffect(() => {
    if (
      formState.isDelete === true ||
      formState.isFailed === true ||
      formState.isSuccess === true ||
      formState.isUpdate === true
    ) {
      setTimeout(function () {
        handleAlertClose();
      }, ALERT_MESSAGE_TIMER);
    }
    if (formState.isSuccess === true || formState.isUpdate === true) {
      if (props.location.state != null) {
        props.location.state.formState = formState;
        // backToList();
      }
      if(props.location.state === null ||props.location.state === undefined) {
        props.location.state = [];
        props.location.state.from = "client-form"
        props.location.state.formState = formState;
        // backToList();
      }
    }
  }, [formState]);
  if (ipLoading || loader) return <Loading />;
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
      if (props.location.pathname.includes("/client-form/edit")) {
        updateIntoClient();
      } else {
        insertIntoClient();
      }
    }
  };

  const insertIntoClient = () => {
    setLoader(true)
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
      setLoader(false)
      setFormState((formState) => ({
        ...formState,
        isSuccess: true,
        isUpdate: false,
        isDelete: false,
        isFailed: false,
        errMessage: " " + name + " " ,
      }));
      backToList();
    })
    .catch((err) => {
      setLoader(false)
      let error = err.message;
      if (
        error.includes(
          "duplicate key value violates unique constraint"
        )
      ) {
        error = " Client Name Already Exists ";
      }
       else {
        error = err.message;
      }
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

  const updateIntoClient = () => {
    if (props.location.state)
    setLoader(true)
      updateClient({
        variables: {
          id: props.location.state.clientId,
          ClientInput: {
            clientName: name,
            mobileNumber: phoneNumber,
            emailId: email
          }
        },
      }).then((res: any) => {
        setLoader(false)
         setFormState((formState) => ({
        ...formState,
        isSuccess: true,
        isUpdate: false,
        isDelete: false,
        isFailed: false,
        errMessage: " " + name + " " ,
      }));
        backToList();
      })
      .catch((err) => {
        setLoader(false)
        let error = err.message;
        if (
          error.includes(
            "duplicate key value violates unique constraint"
          )
        ) {
          error = " Client Name Already Exists ";
        }
         else {
          error = err.message;
        }
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

  const backToList = () => {
    history.push(routeConstant.CLIENT,props.location.state);
    setIsError({ error: null });
    setOpenEdit(false);
    setRowData(false);
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
        {/* {!openEdit ? "Clients" :
          <div> */}
            {rowData ? "Edit Client " : "Add Client"}
            {/* {rowData ? rowData.name : null} */}
          {/* </div>} */}
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
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6} className={rowData ? styles.disfield : styles.test}>
            <Input
              type="text"
              label="Email"
              name="email"
              value={email}
              disabled = {rowData}
              onChange={handleChange}
              error={isError.email}
              helperText={isError.email}
            
              
            >
              E-mail
              </Input>
          </Grid>
          <Grid item xs={12} md={6}>
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
