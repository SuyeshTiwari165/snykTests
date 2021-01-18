import React, { useState, useEffect } from "react";
import styles from "./PartnerForm.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import { Button } from "../../../../components/UI/Form/Button/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AddEditForm } from "../../../../components/UI/AddEditForm/AddEditForm";
import Input from "../../../../components/UI/Form/Input/Input";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Alert from "../../../../components/UI/Alert/Alert";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import * as routeConstant from "../../../../common/RouteConstants";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "../../../../components/UI/Table/MaterialTable";
import { Logout } from "../../../Auth/Logout/Logout";
import Loading from "../../../../components/UI/Layout/Loading/Loading";
import EditIcon from "@material-ui/icons/Edit";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../../common/MessageConstants";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {
  CREATE_PARTNER,
  UPDATE_PARTNER,
} from "../../../../graphql/mutations/RaPartner";
import { GET_PARTNER } from "../../../../graphql/queries/Partners";
import * as validations from "../../../../common/validateRegex";

export const PartnerForm: React.FC = (props: any) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [partnerName, setPartnerName] = useState("");
  const [email, setEmail] = useState("");
  const [partnerID, setPartnerID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [newData, setNewData] = useState<any>([]);
  const [rowData, setRowData] = useState<any>();
  const [partnerSubsID, setPartnerSubsID] = useState<any>();
  const [foundErrors, setFoundError] = useState(false);
  const [param, setParam] = useState<any>();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [isError, setIsError] = useState<any>({
    partnerName: "",
    address: "",
    email: "",
    phoneNumber: "",
  });
  const history = useHistory();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [addPartner, setAddPartner] = useState(false);

  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });

  const [createPartner] = useMutation(CREATE_PARTNER);
  const [updatePartner] = useMutation(UPDATE_PARTNER);

  const { data: partnerData, loading: loadPartner, error: errorPartner, refetch: refetchOrg } = useQuery(
    GET_PARTNER,
    {
      onCompleted: (data: any) => {
        createTableDataObject(data.getPartner.edges);
      },
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    setParam(props.location.state);
  }, []);


  useEffect(() => {
    if (param) {
      setPartnerID(param.partner_id);
      setPartnerName(param.name ? param.name : param.partner);
      setEmail(param.email);
      setPhoneNumber(param.phone);
      setAddress(param.address);
    }
  }, [param]);
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
      if (props.location.state === null || props.location.state === undefined) {
        props.location.state = [];
        props.location.state.from = "Partner-form";
        props.location.state.formState = formState;
        backToList();
      }
    }
  }, [formState]);
  if (loadPartner) return <Loading />;
  if (errorPartner) {
    let error = { message: "Error" };
    return (
      <div className="error">
        Error!
        {Logout()}
      </div>
    )
  }
  const createTableDataObject = (data: any) => {
    let arr: any = [];
    data.map((element: any, index: any) => {
      let obj: any = {};
      obj["id"] = element.node.id;
      obj["name"] = element.node.partnerName;
      obj["email"] = element.node.emailId;
      obj["phone"] = element.node.mobileNumber;
      arr.push(obj);
    });
    setNewData(arr);
  };

  if (loadPartner) return <Loading />;
  if (errorPartner) {
    let error = { message: "Error" };
    return (
      <div className="error">
        Error!
        {Logout()}
      </div>
    )
  }

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "partnerName") {
      setPartnerName(event.target.value);
      let err = event.target.value === "" || null ? "Required" : "";
      setIsError((error: any) => ({
        ...error,
        partnerName: err,
      }));
    }
    if (event.target.name === "email") {
      setEmail(event.target.value);
      let err = event.target.value === "" || null ? "Required" : "";
      setIsError((error: any) => ({
        ...error,
        email: err,
      }));
      if (!err) {
        var pattern = new RegExp(
          /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        );
        if (!validations.EMAIL_REGEX.test(event.target.value)) {
          let errors = "Please enter valid email address.";
          setIsError((error: any) => ({
            ...error,
            email: errors,
          }));
        }
      }
    }
    if (event.target.name === "phoneNumber") {
      setPhoneNumber(event.target.value);

    }
    if (event.target.name === "address") {
      setAddress(event.target.value);
      let err = event.target.value === "" || null ? "Required" : "";
      setIsError((error: any) => ({
        ...error,
        address: err,
      }));
    }
    setSubmitDisabled(checkValidation);
  };

  const checkValidation = () => {
    let validation = false;
    if (isError.partnerName !== "" && isError.address !== "") {
      validation = true;
    }
    return validation;
  };

  const handleInputErrors = () => {
    let foundErrors = false;
    if (!partnerName) {
      let err = "Required";
      setIsError((error: any) => ({
        ...error,
        partnerName: err,
      }));
      foundErrors = true;
    }
    if (!email) {
      let errors = "Required";
      setIsError((error: any) => ({
        ...error,
        email: errors,
      }));
      foundErrors = true;
    }
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
    createPartner({
      variables: {
        input: {
          partnerName: partnerName,
          emailId: email,
          mobileNumber: phoneNumber,
          address: address
        }
      },
    }).then((res: any) => {
      setFormState((formState) => ({
        ...formState,
        isSuccess: true,
        isUpdate: false,
        isDelete: false,
        isFailed: false,
        errMessage: " " + partnerName + " ",
      }));
      backToList();
    })
    .catch((err) => {
      // setLoader(false)
      let error = err.message;
      if (
        error.includes(
          "duplicate key value violates unique constraint"
        )
      ) {
        error = " Partner Name Already Exists ";
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

  const updateIntoPartner = () => {
    updatePartner({
      variables: {
        id: partnerID,
        partnerdata: {
          partnerName: partnerName,
          emailId: email,
          mobileNumber: phoneNumber,
          address: address
        }
      },
    }).then((res: any) => {
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: true,
        isDelete: false,
        isFailed: false,
        errMessage: " " + partnerName + " ",
      }));
      backToList();
    })
    .catch((err) => {
      // setLoader(false)
      let error = err.message;
      if (
        error.includes(
          "duplicate key value violates unique constraint"
        )
      ) {
        error = " Partner Name Already Exists ";
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

  const handleClickAdd = (rowData: any) => {
    let viewdata: any = { propsData: rowData };
    history.push(routeConstant.PARTNER_USER, viewdata);
  };

  const deleteTableRow = (rowData: any) => { };

  const backToList = () => {
    history.push(routeConstant.ADD_PARTNER,props.location.state);

  };


  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        Partner
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
              label="Partner Name*"
              name="partnerName"
              value={partnerName}
              onChange={handleChange}
              error={isError.partnerName}
              helperText={isError.partnerName}
            >
              Partner Name
              </Input>
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              type="text"
              label="Email*"
              name="email"
              value={email}
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
          <Grid item xs={12} md={6}>
            <Input
              type="text"
              label="Address"
              name="address"
              value={address}
              onChange={handleChange}
              error={isError.address}
              helperText={isError.address}
            >
              Address
              </Input>
          </Grid>

        </Grid>
      </AddEditForm>

    </React.Fragment>
  );
};

export default PartnerForm;
