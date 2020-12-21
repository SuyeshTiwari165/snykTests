import React, { useState, useEffect } from "react";
import styles from "./PartnerUserForm.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography, FormHelperText } from "@material-ui/core";
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
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {
  useQuery,
  useMutation,
  FetchResult,
  useLazyQuery,
} from "@apollo/client";
import AutoCompleteDropDown from "../../../components/UI/Form/Autocomplete/Autocomplete";
import * as validations from "../../../common/validateRegex";

// import {
//   CREATE_CONTACT,
//   UPDATE_CONTACT,
// } from "../../../graphql/mutations/Contacts";
// import { CREATE_USER, UPDATE_USER } from "../../../graphql/mutations/User";
// import {
//   CREATE_INDIVIDUAL,
//   UPDATE_INDIVIDUAL,
// } from "../../../graphql/mutations/Individual";
// import {
//   GET_ROLE,
//   GET_USER,
//   GET_ROLE_BASED_USER,
// } from "../../../graphql/queries/User";
// import { CompanyUser } from "../../../common/Roles";
// import { GET_ORGANIZATION } from "../../../graphql/queries/Organization";
// import { GET_CONTACT_INFO } from "../../../graphql/queries/Contact";
// import { GET_INDIVIDUAL } from "../../../graphql/queries/Individual";
import logout from "../../../containers/Auth/Logout/Logout";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import * as routeConstant from "../../../common/RouteConstants";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../common/MessageConstants";

interface partnerValues {
  id: number;
  name: string;
  __typename: string;
}

export const PartnerUserForm: React.FC = (propsData: any) => {
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

  // const [createContact] = useMutation(CREATE_CONTACT);
  // const [createUser] = useMutation(CREATE_USER);
  // const [updateUser] = useMutation(UPDATE_USER);
  // const [updateContact] = useMutation(UPDATE_CONTACT);
  // const [createIndividual] = useMutation(CREATE_INDIVIDUAL);
  // const [updateIndividual] = useMutation(UPDATE_INDIVIDUAL);

  // const [getUser, { data: userdata, loading: loaduser }] = useLazyQuery(
  //   GET_USER,
  //   {
  //     onCompleted: (data: any) => {},
  //     fetchPolicy: "cache-and-network",
  //   }
  // );
  // const { data: partnerLoggedIn, loading: loadRoleuser } = useQuery(
  //   GET_ROLE_BASED_USER,
  //   {
  //     variables: {
  //       where: { id: contact.user_id.id },
  //     },
  //     onCompleted: (data) => {},
  //   }
  // );
  //   const { data: partnerLoggedIn , loading : loadRoleuser } = useQuery(GET_ROLE_BASED_USER, {
  //     variables: {
  //       where: { id: contact.user_id.id }
  //     },
  //     onCompleted: data => {}
  //   });

  //   const { data: dataOrg, error: errorOrg, loading: loadingOrg } = useQuery(
  //     GET_ORGANIZATION,
  //     {
  //       variables: {
  //         where: { subtype: "Partner" }
  //       },
  //       fetchPolicy: "cache-and-network",
  //       onCompleted: () => {
  //         let contact_id_array = dataOrg.organizations.map(
  //           (val: any) => val.contact_id.id
  //         );
  //         getContactInfo({
  //           variables: {
  //             where: { id_in: contact_id_array }
  //           }
  //         });
  //       }
  //     }
  //   );

  // const [
  //   getContactInfo,
  //   { data: contactData, loading: contactLoading },
  // ] = useLazyQuery(GET_CONTACT_INFO, {
  //   fetchPolicy: "cache-and-network",
  //   onCompleted: () => {
  //     setRowData(contactData.contacts[0]);
  //     // if (partnerList.length === 0) {
  //     // setPartnerList(contactData.contacts);
  //     // }
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
  //       if (propsData.location.pathname.includes("/partner-user-form/edit")) {
  //         setRowData(iData.individuals[0].contact_id);
  //       }

  //       // if (partnerUserdata !== undefined) {
  //       //   createTableDataObject(iData.individuals);
  //       // }
  //       if (iData.individuals[0]) {
  //         setPartner(iData.individuals[0].partner_id.id);
  //       }
  //       // if (
  //       //   partnerUserdata === undefined &&
  //       //   iData.individuals[0] !== undefined
  //       // ) {
  //       //   getIndividualpartner({
  //       //     variables: {
  //       //       where: { partner_id: iData.individuals[0].partner_id.id }
  //       //     }
  //       //   });
  //       // }
  //     },
  //   }
  // );

  // const [
  //   getIndividualpartner,
  //   { data: ipData, loading: ipLoading },
  // ] = useLazyQuery(GET_INDIVIDUAL, {
  //   fetchPolicy: "cache-and-network",
  //   onCompleted: () => {},
  // });

  // useEffect(() => {
  //   // setParam(propsData.location.state);
  //   // if (partnerUserdata) {
  //   //   getOrg(
  //   //     {
  //   //       variables: {
  //   //         where: { subtype: "Partner", partner_id: partnerUserdata.id }
  //   //       }
  //   //     })
  //   // }
  //   //from super user
  //   if (partnerUserdata) {
  //     getIndividual({
  //       variables: {
  //         where: { partner_id: partnerUserdata.id }
  //       }
  //     });
  //   }
  //   //from partner user
  //   if (
  //     propsData.location.state === null ||
  //     propsData.location.state === undefined
  //   ) {
  //     getIndividual({
  //       variables: {
  //         where: { partner_id_null: false, contact_id: contact.id },
  //         sort: "created_at:desc"
  //       }
  //     });
  //   }
  //   getRole();
  //   if(propsData.location.state && propsData.location.state.showPartnerUser) {
  //     setOpenEdit(true);
  //     getIndividual({
  //       variables: {
  //         where: { partner_id_null: false, contact_id: contact.id },
  //         sort: "created_at:desc"
  //       }
  //     });
  //   }
  // }, []);

  let UserRole: any;
  // useEffect(() => {
  //   if (userData) {
  //     userData.roles.map((val: any) => {
  //       if (val.name === CompanyUser) UserRole = parseInt(val.id);
  //     });
  //   }
  //   setUserRole(UserRole);
  // }, [userData]);

  // useEffect(() => {
  //   if (propsData.location.pathname.includes("/partner-user-form/edit")) {
  //     getIndividual({
  //       variables: {
  //         where: {
  //           partner_id_null: false,
  //           contact_id: propsData.location.pathname.slice(24),
  //         },
  //         sort: "created_at:desc",
  //       },
  //     });
  //   }
  //   if (
  //     propsData.location.pathname.includes(routeConstant.PARTNER_USER_FORM_ADD)
  //   ) {
  //     getIndividual({
  //       variables: {
  //         where: { partner_id_null: false, contact_id: contact.id },
  //         sort: "created_at:desc",
  //       },
  //     });
  //   }
  //   getRole();
  // }, []);
  // useEffect(() => {
  //   if (
  //     rowData != null &&
  //     propsData.location.pathname.includes("/partner-user-form/edit")
  //   ) {
  //     if (rowData.email) {
  //       setEmail(rowData.email);
  //     }
  //     if (rowData.phone && rowData.phone != "-") {
  //       setPhoneNumber(rowData.phone);
  //     }
  //     if (rowData.name) {
  //       setFirstName(rowData.name.split(" ")[0]);
  //     }
  //     if (rowData.name) {
  //       setLastName(
  //         rowData.name.includes(" ") &&
  //           rowData.name.substr(rowData.name.lastIndexOf(" ") + 1).split(" ")[0]
  //       );
  //     }
  //   }
  // }, [rowData, iData]);
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
  //   if (formState.isSuccess === true || formState.isUpdate === true) {
  //     if (propsData.location.state != null) {
  //       propsData.location.state.propsData.formState = formState;
  //       backToList();
  //     }
  //     console.log(propsData.location.state);
  //     if(propsData.location.state === null ||propsData.location.state === undefined) {
  //       propsData.location.state = [];
  //       propsData.location.state.from = "partner-user"
  //       propsData.location.state.formstate = formState;
  //       backToList();
  //     }
  //   }
  // }, [formState]);

    // if ( contactLoading || userLoading) return <Loading />;
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
    if (event.target.name === "firstName") {
      setFirstName(event.target.value);
      let err =
        event.target.value === "" || null ? "First Name is Required" : "";
      setIsError((error: any) => ({
        ...error,
        firstName: err,
      }));
    }
    if (event.target.name === "lastName") {
      setLastName(event.target.value);
      let err =
        event.target.value === "" || null ? " Last Name is Required" : "";
      setIsError((error: any) => ({
        ...error,
        lastName: err,
      }));
    }
    if (event.target.name === "email") {
      let errors = "";
      setEmail(event.target.value);
      let err = event.target.value === "" || null ? "Email is Required" : "";
      setIsError((error: any) => ({
        ...error,
        email: err,
      }));
      if (!err) {
        if (!validations.EMAIL_REGEX.test(event.target.value)) {
          errors = "Please enter valid email address.";
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
    setSubmitDisabled(checkValidation);
  };

  const checkValidation = () => {
    let validation = false;
    // if (isError.partnerName !== "" && isError.address !== "") {
    //   validation = true;
    // }
    return validation;
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

  const backToList = () => {
    if (
      propsData &&
      propsData.location.state &&
      propsData.location.state.propsData &&
      propsData.location.state.propsData.from &&
      propsData.location.state.propsData.from === "admin-partner-user"
    ) {
      history.push(routeConstant.PARTNER_USER, propsData.location.state);
    } else {
      history.push(routeConstant.PARTNER_USER,propsData.location.state);
    }

    //     setOpenEdit(false);
    //     setIsError({ error: null });
    //     if (partnerUserdata && partnerLoggedIn && partnerLoggedIn.users[0].role.name === 'Administrator') {
    //       getIndividual({
    //         variables: {
    //           where: { partner_id: partnerUserdata.id },
    //           sort: "created_at:desc"
    //         }
    //       });
    //     }
    // //     //from partner user
    //     if (propsData.location.state === null ) {
    //       getIndividual({
    //         variables: {
    //           where: { partner_id_null: false, contact_id: contact.id },
    //           sort: "created_at:desc"
    //         }
    //       });
    //     }
    //     if(propsData.location.state && propsData.location.state.showPartnerUser) {
    //       getIndividual({
    //         variables: {
    //           where: { partner_id_null: false, contact_id: contact.id },
    //           sort: "created_at:desc"
    //         }
    //       });
    //     }
    //     getRole();
  };

  const handleInputErrors = () => {
    let foundErrors = false;
    if (!firstName) {
      let err = "First Name is Required";
      setIsError((error: any) => ({
        ...error,
        firstName: err,
      }));
      foundErrors = true;
    }
    if (!lastName) {
      let err = "Last Name is Required";
      setIsError((error: any) => ({
        ...error,
        lastName: err,
      }));
      foundErrors = true;
    }
    if (!email) {
      let errors = "Email is Required";
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
    if (!password && !rowData) {
      let errors = "Password is Required";
      setIsError((error: any) => ({
        ...error,
        password: errors,
      }));
      foundErrors = true;
    }
    if (!confirmPassword && !rowData) {
      let errors = "Confirm Password is Required";
      setIsError((error: any) => ({
        ...error,
        confirmPassword: errors,
      }));
      foundErrors = true;
    }
    if (confirmPassword && password != confirmPassword) {
      setConfirmPassError(true);
      foundErrors = true;
    }
    // if (password && !validations.PASSWORD_REGEX.test(password))  {
    //     setPassRegError(true);
    //   foundErrors = true;
    // }

    return foundErrors;
  };
  const handleSubmit = () => {
    if (!handleInputErrors()) {
      if (propsData.location.pathname.includes("/partner-user-form/edit")) {
        updateIntoUser();
      } else {
        insertIntoUser();
      }
    }
  };

  const insertIntoUser = () => {
    // if (userRole) {
    //   createUser({
    //     variables: {
    //       username: email.toLowerCase(),
    //       email: email.toLowerCase(),
    //       password: password,
    //       role: userRole,
    //       confirmed: true,
    //     },
    //   })
    //     .then((userRes) => {
    //       insertIntoContact(userRes);
    //     })
    //     .catch((err) => {
    //       let error = err.message;
    //       if (
    //         error.includes(
    //           "Cannot return null for non-nullable field UsersPermissionsUser.id."
    //         )
    //       ) {
    //         error = " Email already exists.";
    //       } else {
    //         error = err.message;
    //       }
    //       setFormState((formState) => ({
    //         ...formState,
    //         isSuccess: false,
    //         isUpdate: false,
    //         isDelete: false,
    //         isFailed: true,
    //         errMessage: error,
    //       }));
    //       if (
    //         err ==
    //         "Error: Cannot return null for non-nullable field UsersPermissionsUser.id."
    //       ) {
    //         let errors = "This email already exists";
    //         setIsError((error: any) => ({
    //           ...error,
    //           email: errors,
    //         }));
    //       }
    //     });
    // }
  };

  const insertIntoContact = (
    // userRes: FetchResult<any, Record<string, any>, Record<string, any>>
  ) => {
    // createContact({
    //   variables: {
    //     name: firstName + " " + lastName,
    //     email: email.toLowerCase(),
    //     phone: phoneNumber,
    //     contact_type: "Individual",
    //     user_id: userRes.data.createUser.user.id,
    //   },
    // })
    //   .then((conRes) => {
    //     insertIntoIndividual(conRes);
    //   })
    //   .catch((err) => {});
  };

  const insertIntoIndividual = (
    // conRes: FetchResult<any, Record<string, any>, Record<string, any>>
  ) => {
    // if (partnerUserdata) {
    //   createIndividual({
    //     variables: {
    //       first_name: firstName,
    //       last_name: lastName,
    //       contact_id: conRes.data.createContact.contact.id,
    //       partner_id: partnerUserdata.id,
    //     },
    //   })
    //     .then((res) => {
    //       setFormState((formState) => ({
    //         ...formState,
    //         isSuccess: true,
    //         isUpdate: false,
    //         isDelete: false,
    //         isFailed: false,
    //         errMessage: " " + firstName + " " + lastName + " ",
    //       }));
    //       // backToList();
    //     })
    //     .catch((err) => {});
    // }
    // if (!partnerUserdata) {
    //   createIndividual({
    //     variables: {
    //       first_name: firstName,
    //       last_name: lastName,
    //       contact_id: conRes.data.createContact.contact.id,
    //       partner_id: partner,
    //     },
    //   })
    //     .then((res) => {
    //       setFormState((formState) => ({
    //         ...formState,
    //         isSuccess: true,
    //         isUpdate: false,
    //         isDelete: false,
    //         isFailed: false,
    //         errMessage: " " + firstName + " " + lastName + " ",
    //       }));
    //       // backToList();
    //     })
    //     .catch((err) => {});
    // }
  };

  const updateIntoUser = () => {
    // if (userRole && iData.individuals[0].partner_id.id) {
    //   if (password) {
    //     updateUser({
    //       variables: {
    //         id: iData.individuals[0].id,
    //         username: email.toLowerCase(),
    //         email: email.toLowerCase(),
    //         password: password,
    //         role: userRole,
    //         confirmed: true,
    //       },
    //     })
    //       .then((userRes) => {
    //         setFormState((formState) => ({
    //           ...formState,
    //           isSuccess: false,
    //           isUpdate: true,
    //           isDelete: false,
    //           isFailed: false,
    //           errMessage: " " + firstName + " " + lastName + " ",
    //         }));
    //         updateIntoContact(userRes);
    //       })
    //       .catch((err) => {
    //         let error = err.message;
    //         if (
    //           error.includes(
    //             "Cannot return null for non-nullable field UsersPermissionsUser.id."
    //           )
    //         ) {
    //           error = " Email already exists.";
    //         } else {
    //           error = err.message;
    //         }
    //         setFormState((formState) => ({
    //           ...formState,
    //           isSuccess: false,
    //           isUpdate: false,
    //           isDelete: false,
    //           isFailed: true,
    //           errMessage: error,
    //         }));
    //       });
    //   } else {
    //     updateUser({
    //       variables: {
    //         id: iData.individuals[0].id,
    //         username: email.toLowerCase(),
    //         email: email.toLowerCase(),
    //         // password: password,
    //         role: userRole,
    //         confirmed: true,
    //       },
    //     })
    //       .then((userRes) => {
    //         setFormState((formState) => ({
    //           ...formState,
    //           isSuccess: false,
    //           isUpdate: true,
    //           isDelete: false,
    //           isFailed: false,
    //           errMessage: " " + firstName + " " + lastName + " ",
    //         }));
    //         updateIntoContact(userRes);
    //       })
    //       .catch((err) => {
    //         let errors = "This email already exists";
    //         setIsError((error: any) => ({
    //           ...error,
    //           email: errors,
    //         }));

    //         let error = " Email already exists.";
    //         setFormState((formState) => ({
    //           ...formState,
    //           isSuccess: false,
    //           isUpdate: false,
    //           isDelete: false,
    //           isFailed: true,
    //           errMessage: error,
    //         }));
    //       });
    //   }
    // }
  };

  const updateIntoContact = (
    // userRes: FetchResult<any, Record<string, any>, Record<string, any>>
  ) => {
    // updateContact({
    //   variables: {
    //     name: firstName + " " + lastName,
    //     email: email.toLowerCase(),
    //     phone: phoneNumber,
    //     contact_type: "Individual",
    //     user_id: userRes.data.updateUser.user.id,
    //     id: rowData.id,
    //   },
    // })
    //   .then((conRes) => {
    //     updateIntoIndividual(conRes);
    //   })
    //   .catch((err) => {});
  };
  const updateIntoIndividual = (
    // conRes: FetchResult<any, Record<string, any>, Record<string, any>>
  ) => {
    // updateIndividual({
    //   variables: {
    //     first_name: firstName,
    //     last_name: lastName,
    //     contact_id: conRes.data.updateContact.contact.id,
    //     id: iData.individuals[0].id,
    //   },
    // })
    //   .then((res) => {
    //     backToList();
    //     setRowData("");
    //   })
    //   .catch((err) => {});
    // // }
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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

  return (
    <React.Fragment>
      <CssBaseline />
          <Typography component="h5" variant="h1">
            <div>
              {rowData ? "Edit User: " : "Add User "}
              {rowData ? rowData.name : null}
            </div>
          </Typography>
          <AddEditForm handleOk={handleSubmit} handleCancel={backToList}>
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
              label="First Name*"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              error={isError.firstName}
              helperText={isError.firstName}
            >
              First Name
            </Input>
          </Grid>
          <Grid item xs={6}>
            <Input
              type="text"
              label="Last Name*"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              error={isError.lastName}
              helperText={isError.lastName}
            >
              Last Name
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
          <Grid item xs={6} className={styles.ConfirmPasswordWrap}>
            <FormControl className={styles.TextField} variant="outlined">
              <InputLabel classes={{ root: styles.FormLabel }}>
                Password*
              </InputLabel>
              <OutlinedInput
                classes={{
                  root: styles.InputField,
                  notchedOutline: styles.InputField,
                  focused: styles.InputField,
                }}
                type={showPassword ? "text" : "password"}
                label="Password*"
                value={password}
                onChange={handlePasswordChange()}
                name="password"
                required
                error={isError.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {isError.password ? (
                <FormHelperText
                  error={isError.password}
                  classes={{ root: styles.FormHelperText }}
                >
                  Password is Required.
                </FormHelperText>
              ) : null}
            </FormControl>
          </Grid>
          {!rowData ? (
            <Grid item xs={6} className={styles.ConfirmPasswordWrap}>
              <FormControl className={styles.TextField} variant="outlined">
                <InputLabel classes={{ root: styles.FormLabel }}>
                  Confirm Password*
                </InputLabel>
                <OutlinedInput
                  classes={{
                    root: styles.InputField,
                    notchedOutline: styles.InputField,
                    focused: styles.InputField,
                  }}
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password*"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange()}
                  name="confirmPassword"
                  required
                  error={isError.confirmPassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {isError.confirmPassword ? (
                  <FormHelperText
                    error={isError.confirmPassword}
                    classes={{ root: styles.FormHelperText }}
                  >
                    Confirm Password is Required.
                  </FormHelperText>
                ) : null}
                {confirmPassError ? (
                  isError.confirmPassword ? null : (
                    <FormHelperText classes={{ root: styles.FormHelperText }}>
                      Confirm Password should be same
                    </FormHelperText>
                  )
                ) : null}
              </FormControl>
            </Grid>
          ) : null}
        </Grid>
      </AddEditForm>
    </React.Fragment>
  );
};

export default PartnerUserForm;
