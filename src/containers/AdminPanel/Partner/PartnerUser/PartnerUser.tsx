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
// import {
//   GET_ROLE,
//   GET_USER,
//   GET_ROLE_BASED_USER,
// } from "../../../../graphql/queries/User";
// import { CompanyUser } from "../../../../common/Roles";
// import { GET_ORGANIZATION } from "../../../../graphql/queries/Organization";
// import { GET_CONTACT_INFO } from "../../../../graphql/queries/Contact";
// import { GET_INDIVIDUAL } from "../../../../graphql/queries/Individual";
import logout from "../../../../containers/Auth/Logout/Logout";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import * as routeConstant from "../../../../common/RouteConstants";
import EditIcon from "@material-ui/icons/Edit";

import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../../common/MessageConstants";

interface partnerValues {
  id: number;
  name: string;
  __typename: string;
}

export const PartnerUser: React.FC = (propsData: any) => {
  // console.log("Partner user props >", propsData.location.state);
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userRole, setUserRole] = useState();
  const [partnerList, setPartnerList] = useState("");
  const [partner, setPartner] = useState<any>("");
  const [newData, setNewData] = useState([]);
  const [partnerListError, setPartnerListError] = useState(false);
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
  const contact = JSON.parse(localStorage.getItem("contact") || "{}");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  let partnerUserdata: any;
  if (propsData.location.state !== null) {
    partnerUserdata = propsData.location.state
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
    // { title: "Partner", field: "partner" },
    { title: "Phone", field: "phone" },
  ];

  // const { data: partnerLoggedIn, loading: loadRoleuser } = useQuery(
  //   GET_ROLE_BASED_USER,
  //   {
  //     variables: {
  //       where: { id: contact.user_id.id },
  //     },
  //     onCompleted: (data) => {},
  //   }
  // );

  // const { data: dataOrg, error: errorOrg, loading: loadingOrg } = useQuery(
  //   GET_ORGANIZATION,
  //   {
  //     variables: {
  //       where: { subtype: "Partner" },
  //     },
  //     fetchPolicy: "cache-and-network",
  //     onCompleted: () => {
  //       let contact_id_array = dataOrg.organizations.map(
  //         (val: any) => val.contact_id.id
  //       );
  //       getContactInfo({
  //         variables: {
  //           where: { id_in: contact_id_array },
  //         },
  //       });
  //     },
  //   }
  // );

  // const [
  //   getContactInfo,
  //   { data: contactData, loading: contactLoading },
  // ] = useLazyQuery(GET_CONTACT_INFO, {
  //   fetchPolicy: "cache-and-network",
  //   onCompleted: () => {
  //     if (partnerList.length === 0) {
  //       setPartnerList(contactData.contacts);
  //     }
  //   },
  // });

  // const [getRole, { data: userData, loading: userLoading }] = useLazyQuery(
  //   GET_ROLE,
  //   {
  //     fetchPolicy: "cache-and-network",
  //   }
  // );

  // const [getIndividual, { data: iData, loading: iLoading }] = useLazyQuery(
  //   GET_INDIVIDUAL,
  //   {
  //     fetchPolicy: "cache-and-network",
  //     onCompleted: () => {
  //       if (
  //         partnerUserdata !== undefined &&
  //         partnerLoggedIn &&
  //         partnerLoggedIn.users[0].role.name === "Administrator"
  //       ) {
  //         createTableDataObject(iData.individuals);
  //       }
  //       if (iData.individuals[0]) {
  //         setPartner(iData.individuals[0].partner_id.id);
  //       }
  //       if (
  //         partnerUserdata === undefined ||
  //         (partnerUserdata === null && iData.individuals[0] !== undefined)
  //       ) {
  //         getIndividualpartner({
  //           variables: {
  //             where: { partner_id: iData.individuals[0].partner_id.id },
  //           },
  //         });
  //       }
  //     },
  //   }
  // );

  // const [
  //   getIndividualpartner,
  //   { data: ipData, loading: ipLoading },
  // ] = useLazyQuery(GET_INDIVIDUAL, {
  //   fetchPolicy: "cache-and-network",
  //   onCompleted: () => {
  //     createTableDataObject(ipData.individuals);
  //   },
  // });

  const createTableDataObject = (data: any) => {
    // let arr: any = [];
    // data.map((element: any, index: any) => {
    //   let obj: any = {};
    //   obj["id"] = element.contact_id.id;
    //   obj["email"] = element.contact_id.email;
    //   obj["name"] = element.contact_id.name;
    //   // obj["partner"] = element.partner_id.name;
    //   obj["phone"] = !element.contact_id.phone ? "-" : element.contact_id.phone;
    //   obj["first_name"] = element.first_name;
    //   obj["last_name"] = element.last_name;
    //   obj["partner_id"] = element.id;
    //   arr.push(obj);
    // });
    // setNewData(arr);
  };

  // useEffect(() => {
  //   setParam(propsData.location.state);
  //   // if (partnerUserdata) {
  //   //   getOrg(
  //   //     {
  //   //       variables: {
  //   //         where: { subtype: "Partner", partner_id: partnerUserdata.id }
  //   //       }
  //   //     })
  //   // }
  //   // from super user
  //   if (partnerUserdata) {
  //     getIndividual({
  //       variables: {
  //         where: { partner_id: partnerUserdata.id },
  //       },
  //     });
  //     if (partnerUserdata.formState) {
  //       setFormState(partnerUserdata.formState);
  //     }
  //   }
  //   //from partner user
  //   if (
  //     propsData.location.state === null ||
  //     propsData.location.state === undefined ||
  //     propsData.location.state.from && propsData.location.state.from === "partner-user"
  //   ) {
  //     getIndividual({
  //       variables: {
  //         where: { partner_id_null: false, contact_id: contact.id },
  //         sort: "created_at:desc",
  //       },
  //     });
  //     if( propsData.location.state != undefined &&  propsData.location.state != null && propsData.location.state.formstate) {
  //       setFormState(propsData.location.state.formstate);
  //     }
  //   }
  //   getRole();
  // }, []);

  // let UserRole: any;
  // useEffect(() => {
  //   if (userData) {
  //     userData.roles.map((val: any) => {
  //       if (val.name === CompanyUser) UserRole = parseInt(val.id);
  //     });
  //   }
  //   setUserRole(UserRole);
  // }, [userData]);

  const handleAlertClose = () => {
  //   setFormState((formState) => ({
  //     ...formState,
  //     isSuccess: false,
  //     isUpdate: false,
  //     isDelete: false,
  //     isFailed: false,
  //     errMessage: "",
  //   }));
  };

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

  // if (loadingOrg || contactLoading || userLoading || ipLoading)
  //   return <Loading />;
  // if (errorOrg) {
  //   let error = { message: "Error" };
  //   return (
  //     <div className="error">
  //       Error!
  //       {logout()}
  //     </div>
  //   );
  // }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.name === "firstName") {
  //     setFirstName(event.target.value);
  //     let err =
  //       event.target.value === "" || null ? "First Name is Required" : "";
  //     setIsError((error: any) => ({
  //       ...error,
  //       firstName: err,
  //     }));
  //   }
  //   if (event.target.name === "lastName") {
  //     setLastName(event.target.value);
  //     let err =
  //       event.target.value === "" || null ? " Last Name is Required" : "";
  //     setIsError((error: any) => ({
  //       ...error,
  //       lastName: err,
  //     }));
  //   }
  //   if (event.target.name === "email") {
  //     let errors = "";
  //     setEmail(event.target.value);
  //     let err = event.target.value === "" || null ? "Email is Required" : "";
  //     setIsError((error: any) => ({
  //       ...error,
  //       email: err,
  //     }));
  //     if (!err) {
  //       if (!validations.EMAIL_REGEX.test(event.target.value)) {
  //         errors = "Please enter valid email address.";
  //         setIsError((error: any) => ({
  //           ...error,
  //           email: errors,
  //         }));
  //       }
  //     }
  //   }
  //   // if (event.target.name === "password" ) {
  //   //   setPassword(event.target.value);
  //   //   if(!rowData) {
  //   //   let err = event.target.value === "" || null ? "Password is Required" : "";
  //   //   setIsError((error: any) => ({
  //   //     ...error,
  //   //     password: err,
  //   //   }));
  //   // }
  //   //   // if (
  //   //   //   event.target.name &&
  //   //   //   validations.PASSWORD_REGEX.test(event.target.name)
  //   //   // ) {
  //   //   //   setPassRegError(true);
  //   //   // } else {
  //   //   //   setIsError({ error: null });
  //   //   //   setPassRegError(false);
  //   //   // }
  //   // }
  //   // if (event.target.name === "confirmPassword") {
  //   //   setConfirmPassword(event.target.value);
  //   //   let err = event.target.value === "" || null ? "Confirm Password is Required" : "";
  //   //   setIsError((error: any) => ({
  //   //     ...error,
  //   //     confirmPassword: err,
  //   //   }));
  //   // }
  //   // if(confirmPassword && password) {
  //   // if(password !== confirmPassword) {
  //   // if (event.target.name == 'password' || event.target.name == 'confirmPassword') {
  //   //       console.log("confirm",confirmPassword);
  //   //       console.log("password",password);
  //   //       if( password != confirmPassword) {
  //   //   setConfirmPassError(true);
  //   //   console.log("setError",confirmPassError)
  //   //   } else {
  //   //     setConfirmPassError(false);
  //   //     console.log("Remove Error",confirmPassError)
  //   //     // setIsError({'error': null})
  //   //   }
  //   // }
  //   if (event.target.name === "phoneNumber") {
  //     setPhoneNumber(event.target.value);
  //     // let err = event.target.value === "" || null ? "Required" : "";
  //     // setIsError((error: any) => ({
  //     //   ...error,
  //     //   phoneNumber: err,
  //     // }));
  //     // if (!err) {
  //     //   if (phoneNumber.length < 9) {
  //     //     let errors = "Please enter valid Phone no.";
  //     //     setIsError((error: any) => ({
  //     //       ...error,
  //     //       phoneNumber: errors,
  //     //     }));
  //     //   }
  //     // }
  //   }
  //   setSubmitDisabled(checkValidation);
  // };

  // const checkValidation = () => {
  //   let validation = false;
  //   // if (isError.partnerName !== "" && isError.address !== "") {
  //   //   validation = true;
  //   // }
  //   return validation;
  };



  const handleClickOpen = () => {
    // param.propsData.from = "admin-partner-user";
    history.push(routeConstant.PARTNER_USER_FORM_ADD);
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

  // Set Partner value
  // const handlePartnerChange = (event: any, selectedValue: any) => {
  //   if (!selectedValue) {
  //     setPartnerListError(true);
  //   } else {
  //     setPartnerListError(false);
  //   }
  //   setPartner(selectedValue);
  // };
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

  const handleClickEdit = (rowData: any, event: any) => {
    if (
      user && user.user && user.user.role &&
      user.user.role.name === "Company User"
    ) {
      history.push(routeConstant.PARTNER_USER_FORM_EDIT + rowData.id);
    }
    if (
      user && user.user && user.user.role &&
      user.user.role.name  === "Administrator"
    ) {
      param.propsData.from = "admin-partner-user";
      history.push(routeConstant.PARTNER_USER_FORM_EDIT + rowData.id, param);
    }
  };
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
          <Grid item xs={6} sm={8} className={styles.FilterWrap}>
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
          <Grid item xs={4} sm={4} className={styles.backToListButton}>
            {/* {propsData.location.state != null &&
            partnerLoggedIn &&
            partnerLoggedIn.users[0].role.name === "Administrator" ? ( */}
              <div className={styles.ButtonGroup1}>
                <div className={styles.FilterInputgotolist}>
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
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleClickOpen}
                  >
                    <AddCircleIcon />
                    &nbsp; User
                  </Button>
                </div>
              </div>
            {/* ) : null} */}
            {/* {user && user.user && user.user.role &&
            user.user.role.name === "Company User" ? (
              <div className={styles.ButtonGroup2}>
                <div className={styles.FilterInput}>
                  <Link to={routeConstant.PARTNER_USER_FORM_ADD}>
                    <Button color="primary" variant="contained">
                      <AddCircleIcon />
                      User
                    </Button>
                  </Link>
                  <Button
                        color="primary"
                        variant="contained"
                        onClick={handleClickOpen}
                      >
                        <AddCircleIcon />
                        &nbsp; Add User
                      </Button>
                </div>
              </div>
            ) : null} */}
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
          <div className={styles.ScrollTable}>
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
                // {
                //   icon: () => <DeleteIcon />,
                //   tooltip: "Delete",
                //   // onClick: (event: any, rowData: any) => {
                //   //   handleClickAdd(rowData);
                //   // },
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
