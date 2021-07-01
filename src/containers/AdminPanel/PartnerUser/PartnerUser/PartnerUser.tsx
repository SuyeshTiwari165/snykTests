import React, { useState, useEffect } from "react";
import styles from "./PartnerUser.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography, FormHelperText } from "@material-ui/core";
import { Button } from "../../../../components/UI/Form/Button/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Alert from "../../../../components/UI/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "../../../../components/UI/Table/MaterialTable";
import SimpleBackdrop from "../../../../components/UI/Layout/Backdrop/Backdrop";
import Loading from "../../../../components/UI/Layout/Loading/Loading";
import { Link } from "react-router-dom";
import {
  useQuery,
  useMutation,
  FetchResult,
  useLazyQuery,
} from "@apollo/client";
import AutoCompleteDropDown from "../../../../components/UI/Form/Autocomplete/Autocomplete";
import * as validations from "../../../../common/validateRegex";
import { GET_PARTNER_USER, GET_PARTNER_ID_USER } from "../../../../graphql/queries/PartnerUser";
import logout from "../../../Auth/Logout/Logout";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import * as routeConstant from "../../../../common/RouteConstants";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../../common/MessageConstants";
import DeleteIcon from "@material-ui/icons/Delete";
import { DELETE_USER} from "../../../../graphql/mutations/PartnerUser";

interface partnerValues {
  id: number;
  name: string;
  __typename: string;
}

export const PartnerUser: React.FC = (propsData: any) => {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const[showBackdrop, setShowBackdrop] = useState(true);
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [partnerID, setPartnerID] = useState<any>();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [partnerList, setPartnerList] = useState("");
  const [partner, setPartner] = useState<any>("");
  const [newData, setNewData] = useState([]);
  const [param, setParam] = useState<any>();
  const [rowData, setRowData] = useState<any>();
  const [passRegError, setPassRegError] = useState(false);
  const [confirmPassError, setConfirmPassError] = useState(false);
  const [adminRole, setAdminRole] = useState(false);
  const [isError, setIsError] = useState<any>({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    phoneNumber: "",
  });
  const [userDeleted, SetUserDeleted] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  let userRole: any;
  if (user) {
    userRole = user.isSuperuser == true ? "SuperUser" : "CompanyUser";
  }
  let partnerdata: any;
  if (propsData.location.state !== null) {
    partnerdata = propsData.location.state
      ? propsData.location.state.propsData
      : null;
  }

  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });

  //table
  const column = [
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Created On", field: "created_on" },
    { title: "Phone", field: "phone" },
  ];
  const [deleteUser] = useMutation(DELETE_USER);

  
  const createTableDataObject = (data: any) => {
    let arr: any = [];
    data.map((element: any, index: any) => {
      let obj: any = {};
      obj["id"] = element.node.id;
      obj["email"] = element.node.userId.username;
      obj["name"] = element.node.userId.firstName + " " + element.node.userId.lastName;
      obj["phone"] = !element.node.mobileNumber ? "-" : element.node.mobileNumber;
      obj["first_name"] = element.node.userId.firstName;
      obj["last_name"] = element.node.userId.lastName;
      obj['created_on'] = moment(element.node.userId.dateJoined).format(
        "MM/DD/YYYY hh:mm a");
      if (partnerdata) {
        obj["partner_id"] = partnerdata.partner_id;
      }
      obj["userID"] = element.node.userId.id;
      arr.push(obj);
    });
    setNewData(arr);
  };

  const [getpartnerUserDataforCompuser, { data: PartnerIDDataforCompuser, loading: loadPartnerIDforCompuser }] = useLazyQuery(
    GET_PARTNER_USER, {
    onCompleted: (data: any) => {
      setShowBackdrop(false)
      if(data.getPartnerUserDetails.edges.length >= 0) {
      setPartnerID(data.getPartnerUserDetails.edges[0].node.partnerId)
      }
      createTableDataObject(data.getPartnerUserDetails.edges);
    },
    fetchPolicy: "cache-and-network",
  });

  const [getpartnerIDbyUserID, { data: PartnerIDData, loading: loadPartnerID }] = useLazyQuery(
    GET_PARTNER_ID_USER, {
    onCompleted: (data: any) => {
      setShowBackdrop(false)
      if (data.getPartnerUserDetails.edges[0]) {
        setPartnerID(data.getPartnerUserDetails.edges[0].node.partnerId)
        getpartnerUserDataforCompuser({
          variables: {
            orderBy: "user_id__first_name",
            partner: data.getPartnerUserDetails.edges[0].node.partnerId,
            userType: 'Partner'
          },
        })
      }
    },
    fetchPolicy: "cache-and-network",
  });

  const [getpartnerUserData, { data: PartneruserData, loading: loadPartneruser }] = useLazyQuery(
    GET_PARTNER_USER, {
    onCompleted: (data: any) => {
      setShowBackdrop(false)
      // if(data.getPartnerUserDetails.edges.length > 0) {
      createTableDataObject(data.getPartnerUserDetails.edges);
      // }
    },
    fetchPolicy: "cache-and-network",
  }
  );
  useEffect(() => {
    if (propsData.location.state && propsData.location.state !== null && propsData.location.state.formState) {
      setFormState(propsData.location.state.formState);
    }
    if (propsData.location.state && propsData.location.state !== null && propsData.location.state.partner_id) {
      getpartnerUserData({
        variables: {
          partner: propsData.location.state.partner_id,
          userType: 'Partner',
          orderBy: "user_id__first_name", 
        },
      })
    } else if (propsData.location.state && propsData.location.state.propData) {
      getpartnerUserData({
        variables: {
          partner: propsData.location.state.propData.partner_id,
          userType: 'Partner',
          orderBy: "user_id__first_name", 
        },
      })
    } else {
      getpartnerIDbyUserID({
        variables: {
          userId: user.isSuperuser == true ? propsData.location.state.email : user.username,
        },
      })
    }
  }, []);

  useEffect(() => {
    if (propsData.location.state && propsData.location.state !== null && propsData.location.state.formState) {
      setFormState(propsData.location.state.formState);
    }
    console.log("propsData",propsData)
    if (propsData.location.state && propsData.location.state !== null && propsData.location.state.partner_id) {
      getpartnerUserData({
        variables: {
          partner: propsData.location.state.partner_id,
          userType: 'Partner',
          orderBy: "user_id__first_name", 
        },
      })
    } else if (propsData.location.state && propsData.location.state.propData) {
      getpartnerUserData({
        variables: {
          partner: propsData.location.state.propData.partner_id,
          userType: 'Partner',
          orderBy: "user_id__first_name", 
        },
      })
    }
     else {
      getpartnerIDbyUserID({
        variables: {
          // userId: user.isSuperuser == true ? propsData.location.state.email : user.username,
          userId: propsData.location.state != null && propsData.location.state.hasOwnProperty("email") ? propsData.location.state.email : user.username,
        },
      })
    }
  }, [userDeleted]);

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
  }, [formState]);

  if (showBackdrop ) return <SimpleBackdrop />;

  function convertDate(inputFormat: any) {
    function pad(s: any) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  }

  const getDateAndTime = (utcDate: any) => {
    if (utcDate === "" || utcDate === null) {
      return null;
    } else {
      var dateFormat: any = new Date(utcDate);
      var hours = dateFormat.getHours();
      var minutes = dateFormat.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      var dateAndTime = convertDate(new Date(utcDate)) + " " + strTime;
      console.log(convertDate(new Date(utcDate)))
      return dateAndTime;
    }
  };



  const handleClickOpen = () => {
    let partnerData: any = { "partner_id": partnerID }
    history.push(routeConstant.PARTNER_USER_FORM_ADD, propsData.location.state ? propsData.location.state : partnerData);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const getPartnerList = {
    options: partnerList,
    getOptionLabel: (option: partnerValues) => (option.name ? option.name : ""),
  };

  const handlePasswordChange = () => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
    let err = event.target.value === "" || null ? "Password is Required" : "";
    setIsError((error: any) => ({
      ...error,
      password: err,
    }));
    // setPasswordError(false);
  };
  const handleConfirmPasswordChange = () => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
    let err =
      event.target.value === "" || null ? "Confirm Password is Required" : "";
    setIsError((error: any) => ({
      ...error,
      confirmPassword: err,
    }));
    if (password != event.target.value) {
      setConfirmPassError(true);
    } else {
      setConfirmPassError(false);
      setIsError({ error: null });
    }
  };
  let propuserData = propsData.location.state
  const handleClickEdit = (rowData: any, event: any) => {
    let PartnerUserData = { rowData, propuserData }
    if (
      user && !user.isSuperuser
    ) {
      history.push(routeConstant.PARTNER_USER_FORM_EDIT + rowData.id, PartnerUserData);
    }
    if (user && user.isSuperuser) {
      // param.propsData.from = "admin-partner-user";
      history.push(routeConstant.PARTNER_USER_FORM_EDIT + rowData.id, rowData);
    }
  };
  const handleClickDelete = (event: any, rowData: any) => {
    SetUserDeleted(false);
    console.log("RowData",rowData);
    setShowBackdrop(true);
    deleteUser({
      variables: {
        id: rowData.userID
      },
    }).then((res: any) => {
      setShowBackdrop(false);
      console.log("RES",res.data.deleteUser.status);
      if(res.data.deleteUser.status == "User is Deleted") {
        SetUserDeleted(true);
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: true,
        isFailed: false,
        errMessage: "  " + rowData.name + "  " ,
      }));
    }
    if(res.data.deleteUser.status === "User Not Deleted") {
      setShowBackdrop(false);
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: " Failed to Delete Partner  " + rowData.target + " " ,
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
  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        {!openEdit ? (
          "Users"
        ) : (
            <div>
              {rowData ? "Edit User: " : "Add User "}
              {rowData ? rowData.name : null}
            </div>
          )}
      </Typography>
      <Grid>
        <Grid container>
          <Grid item xs={12} md={8} className={styles.FilterWrap}>
            {/* <div className={styles.FilterInput}>
                <Input
                  label="Email"
                  name="filterName"
                  id="combo-box-demo"
                // value={filterName}
                // onChange={nameFilter}
                />
              </div> */}
          </Grid>
          <Grid item xs={12} md={4} className={styles.backToListButton}>
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
                      } alt="user icon"
                    />
                    &nbsp; Back to List
                  </Button>
                ) : null}
                {/* <Button
                  color="primary"
                  variant="contained"
                  onClick={handleClickOpen}
                >
                  <AddCircleIcon className={styles.EditIcon} />
                    &nbsp; User
                  </Button> */}
              </div>
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
              User <strong>{formState.errMessage}</strong> {SUCCESS}
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
              User <strong>{formState.errMessage}</strong> {UPDATE}
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
          <div className={styles.ScrollTable}>
            <MaterialTable
              columns={column}
              data={newData}
              actions={[
                {
                  icon: () => <img className={styles.EditIcon}
                    src={
                      process.env.PUBLIC_URL + "/icons/svg-icon/edit.svg"
                    }
                    alt="edit icon"
                  />,
                  tooltip: "Edit",
                  onClick: (event: any, rowData: any) => {
                    handleClickEdit(rowData, event);
                  },
                },
                {
                  icon: () => <DeleteIcon />,
                  tooltip: "Delete",
                  onClick: (event: any, rowData: any) => {
                    handleClickDelete(event, rowData);
                  },
                },
              ]}
              options={{
                headerStyle: {
                  backgroundColor: "#fef9f5",
                  color: "#002F60",
                },
                actionsColumnIndex: -1,
                paging: true,
                sorting: true,
                search: false,
                filter: true,
                draggable: false,
                pageSize: 25,
                pageSizeOptions: [25, 50, 75, 100],
              }}
            />
          </div>
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default PartnerUser;
