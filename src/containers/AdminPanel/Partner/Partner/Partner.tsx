import React, { useState, useEffect } from "react";
import styles from "./Partner.module.css";
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

export const Partner: React.FC = (props: any) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [partnerName, setPartnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [newData, setNewData] = useState<any>([]);
  const [rowData, setRowData] = useState<any>();
  const [partnerSubsID, setPartnerSubsID] = useState<any>();
  const [param, setParam] = useState<any>();
  const [foundErrors, setFoundError] = useState(false);
  const [emailExistError, setEmailExistError] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  //table
  const column = [
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Phone", field: "phone" },
  ];

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

  const { data: Org, loading: loadOrg, refetch: refetchOrg } = useQuery(
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

  const createTableDataObject = (data: any) => {
    let arr: any = [];
    data.map((element: any, index: any) => {
      let obj: any = {};
      obj["partner_id"] = element.node.id;
      obj["name"] = element.node.partnerName;
      obj["email"] = element.node.emailId;
      obj["phone"] = element.node.mobileNumber;
      obj["address"] = element.node.address;
      arr.push(obj);
    });
    setNewData(arr);
  };

  const handleClickOpen = () => {
    history.push(routeConstant.PARTNER_FORM_ADD);
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

  const handleClickAdd = (rowData: any) => {
    let viewdata: any = rowData;
    history.push(routeConstant.PARTNER_USER, viewdata);
  };

  const handleClickEdit = (rowData: any, event: any) => {
    console.log("rowData",rowData)
    if (
      user && user.user && user.user.role &&
      user.user.role.name === "Company User"
    ) {
      history.push(routeConstant.PARTNER_FORM_EDIT + rowData.partner_id, rowData);
    }
    if (user && user.isSuperuser) {
      // param.propsData.from = "admin-partner-user";
      history.push(routeConstant.PARTNER_FORM_EDIT + rowData.partner_id, rowData);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        Partner
      </Typography>
      {/* {!openEdit ? ( */}
      <Grid className={styles.TableWrap}>
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
                  &nbsp; Partner
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
              Partner <strong>{formState.errMessage}</strong> {SUCCESS}
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
              Partner <strong>{formState.errMessage}</strong> {UPDATE}
            </Alert>
          ) : null}
          <MaterialTable
            columns={column}
            data={newData}
            actions={[
              {
                icon: () => <EditIcon />,
                tooltip: "Edit",
                onClick: (event: any, rowData: any) => {
                  handleClickEdit(rowData, event);
                },
              },
              {
                icon: () => <AddCircleIcon />,
                tooltip: "Add Partner User",
                onClick: (event: any, rowData: any) => {
                  handleClickAdd(rowData);
                },
              },
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
            }}
          />
        </Paper>
      </Grid>
      {/* ) : (
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
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
        )} */}
    </React.Fragment>
  );
};

export default Partner;
