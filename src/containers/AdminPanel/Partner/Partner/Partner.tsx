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
// import {
//   CREATE_CONTACT,
//   UPDATE_CONTACT,
// } from "../../../../graphql/mutations/Contacts";
// import { CREATE_ORG } from "../../../../graphql/mutations/Organization";
// import {
//   CRREATE_PARTNER_SUBSCRIPTION,
//   UPDATE_PARTNER_SUBSCRIPTIONS,
// } from "../../../../graphql/mutations/PartnerSubscription";
import { GET_PARTNER } from "../../../../graphql/queries/Partners";
import { CREATE_PARTNER } from "../../../../graphql/mutations/RaPartner";
// import {
//   CREATE_ADDRESS,
//   UPDATE_PARTNER_ADDRESS,
// } from "../../../../graphql/mutations/Address";
import { GET_PARTNER_SUBSCRIPTION } from "../../../../graphql/queries/PartnerSubscription";
// import { GET_ADDRESS } from "../../../../graphql/queries/Address";
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
  const [foundErrors, setFoundError] = useState(false);
  const [emailExistError, setEmailExistError] = useState(false);

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
  const [CCsubscription, setCCsubscription] = useState(false);
  const [RAsubscription, setRAsubscription] = useState(false);
  const [addPartner, setAddPartner] = useState(false);

  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });

  // const [createContact] = useMutation(CREATE_CONTACT);
  // const [createOrganization] = useMutation(CREATE_ORG);
  // const [partnerSubscription] = useMutation(CRREATE_PARTNER_SUBSCRIPTION);
  // const [updatePartnerSubscription] = useMutation(UPDATE_PARTNER_SUBSCRIPTIONS);
  // const [createAddress] = useMutation(CREATE_ADDRESS);
  // const [updateAddress] = useMutation(UPDATE_PARTNER_ADDRESS);
  // const [UpdateContact] = useMutation(UPDATE_CONTACT);
  // const [getOrganization, {data: Org, loading: loadOrg }] = useLazyQuery(GET_ORGANIZATION, {

  const { data: Org, loading: loadOrg, refetch: refetchOrg } = useQuery(
    GET_PARTNER,
    {
      onCompleted: (data: any) => {
       
        createTableDataObject(data.getPartner.edges);
        // let contact_id_array = data.getPartner.edges.map(
        //   (val: any) =>  console.log("val",val)
        // );
        // getPartnerSubs({
        //   variables: {
        //     where: { contact_id_in: contact_id_array },
        //   },
        // });
      },
      fetchPolicy: "cache-and-network",
    }
  );

  // Restore Address
  // const [getaddress, { data: dataAD, loading: loadingAD }] = useLazyQuery(
  //   GET_ADDRESS,
  //   {
  //     onCompleted: (data: any) => {
  //       if (data.addresses && data.addresses.length >= 1)
  //         setAddress(data.addresses[0].address_line_1);
  //     },
  //     fetchPolicy: "cache-and-network",
  //   }
  // );

  // useEffect(() => {
  //   if (dataAD !== undefined) {
  //     if (dataAD.addresses.length >= 0) {
  //       setSubmitDisabled(false);
  //     }
  //     if (dataAD.addresses.length === 0) {
  //       setSubmitDisabled(true);
  //     }
  //   }
  // }, [dataAD]);

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
  //   if (props !== undefined) {
  //     // setPartnerName("");
  //     // setEmail("");
  //     // setPhoneNumber("");
  //     // setAddress("");
  //     // setCCsubscription(false);
  //     // setRAsubscription(false);

  //     if (
  //       props.location &&
  //       props.location.state &&
  //       props.location.state &&
  //       props.location.state.AddPartner
  //     ) {
  //       setOpenEdit(true);
  //       setAddPartner(true);
  //       // setRowData("");
  //     }
  //     // if (dataAD.addresses.length >= 0) {
  //     //   setSubmitDisabled(false);
  //     // }
  //     // if (dataAD.addresses.length === 0) {
  //     //   setSubmitDisabled(true);
  //     // }
  //     // createTableDataObject(props.location.state);
  //     if (
  //       props.location &&
  //       props.location.state &&
  //       props.location.state &&
  //       props.location.state.partner
  //     ) {
  //       setPartnerName(props.location.state.partner);
  //       setOpenEdit(true);
  //     }
  //     if (
  //       props.location &&
  //       props.location.state &&
  //       props.location.state &&
  //       props.location.state.email
  //     ) {
  //       setEmail(props.location.state.email);
  //     }
  //     if (
  //       props.location &&
  //       props.location.state &&
  //       props.location.state &&
  //       props.location.state.id
  //     ) {
  //       getaddress({
  //         variables: {
  //           where: {
  //             contact_id: props.location.state.id,
  //           },
  //         },
  //       });
  //       getPartnerSubs({
  //         variables: {
  //           where: { contact_id_in: props.location.state.id },
  //         },
  //       });
  //     }
  //     if (
  //       props.location &&
  //       props.location.state &&
  //       props.location.state &&
  //       props.location.state.phone
  //     )
  //       setPhoneNumber(props.location.state.phone);
  //   }
  // }, [dataAD]);

  // const [getPartnerSubs, { data: dataSubs, loading: loadSubs }] = useLazyQuery(
  //   GET_PARTNER_SUBSCRIPTION,
  //   {
  //     onCompleted: (data: any) => {
  //       // if(data.partnerSubscriptions && data.partnerSubscriptions.length >= 1) {
  //       setPartnerSubsID(data.partnerSubscriptions[0].id);
  //       setCCsubscription(data.partnerSubscriptions[0].cc_subscription);
  //       setRAsubscription(data.partnerSubscriptions[0].ra_subscription);
  //       // }
  //     },
  //     fetchPolicy: "cache-and-network",
  //   }
  // );

  const createTableDataObject = (data: any) => {
   
    let arr: any = [];
    data.map((element: any, index: any) => {
      console.log("element",element.node)
      let obj: any = {};
      obj["id"] = element.node.id;
      obj["name"] = element.node.partnerName;
      obj["email"] = element.node.emailId;
      obj["phone"] = element.node.mobileNumber;
      arr.push(obj);
    });
    setNewData(arr);
  };

  // if (loadOrg || loadSubs) return <Loading />;
  // if (errorOrg) {
  //   let error = { message: "Error" };
  //   return (
  //     <div className="error">
  //       Error!
  //       {logout()}
  //     </div>
  //   )
  // }

  const handleClickOpen = (rowData: any) => {
    setFormState((formState) => ({
      ...formState,
      isSuccess: false,
      isUpdate: false,
      isDelete: false,
      isFailed: false,
      errMessage: "",
    }));
    setPartnerName("");
    setEmail("");
    setPhoneNumber("");
    setAddress("");
    setCCsubscription(false);
    setRAsubscription(false);
    setOpenEdit(true);
    setAddPartner(true);
  };

  const handleSubscription = (
    event: any,
    value: React.SetStateAction<boolean>
  ) => {
    if (event.target.name === "CCsubscription") {
      setCCsubscription(value);
    }
    if (event.target.name === "RAsubscription") {
      setRAsubscription(value);
    }
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
        // var pattern = new RegExp(
        //   /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        // );
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
      // let err = event.target.value === "" || null ? "Required" : "";
      // setIsError((error: any) => ({
      //   ...error,
      //   phoneNumber: err,
      // }));
      // if (!err) {
      //   if (phoneNumber.length < 9) {
      //     let errors = "Please enter valid Phone no.";
      //     setIsError((error: any) => ({
      //       ...error,
      //       phoneNumber: errors,
      //     }));
      //   }
      // }
    }
    if (event.target.name === "address") {
      setAddress(event.target.value);
      // let err = event.target.value === "" || null ? "Required" : "";
      // setIsError((error: any) => ({
      //   ...error,
      //   address: err,
      // }));
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
    // if (!handleInputErrors()) {
    //   // if (dataAD != null && partnerSubsID != null && rowData != "") {
    //   if (!addPartner) {
    //     if (props.location && props.location.state && props.location.state.id) {
    //       UpdateContact({
    //         variables: {
    //           id: props.location.state.id,
    //           name: partnerName,
    //           email: email,
    //           phone: phoneNumber,
    //           contact_type: "Organization",
    //         },
    //       })
    //         .then((userRes) => {
    //           updateAddress({
    //             variables: {
    //               id: dataAD.addresses[0].id,
    //               contact_id: props.location.state.id,
    //               address1: address,
    //               address2: "",
    //               city: "",
    //               state: "",
    //               zip: "",
    //               locationType: "Office",
    //             },
    //           })
    //             .then((res: any) => {
    //               updatePartnerSubscription({
    //                 variables: {
    //                   id: partnerSubsID,
    //                   contact_id: props.location.state.id,
    //                   CCSubscription: CCsubscription,
    //                   RASubscription: RAsubscription,
    //                 },
    //               }).then((res: any) => {
    //                 updateAddress({
    //                   variables: {
    //                     id: dataAD.addresses[0].id,
    //                     contact_id: props.location.state.id,
    //                     address1: address,
    //                     address2: "",
    //                     city: "",
    //                     state: "",
    //                     zip: "",
    //                     locationType: "Office",
    //                   },
    //                 })
    //                   .then((res: any) => {
    //                     setFormState((formState) => ({
    //                       ...formState,
    //                       isSuccess: false,
    //                       isUpdate: true,
    //                       isDelete: false,
    //                       isFailed: false,
    //                       errMessage: " " + partnerName + " ",
    //                     }));
    //                     backToList();
    //                   })
    //                   .catch((Error) => {
    //                     setSubmitDisabled(false);
    //                   });
    //               });
    //             })
    //             .catch((Error) => {
    //               setSubmitDisabled(false);
    //             });
    //         })
    //         .catch((err) => {
    //           let error = err.message;
    //           setFormState((formState) => ({
    //             ...formState,
    //             isSuccess: false,
    //             isUpdate: false,
    //             isDelete: false,
    //             isFailed: true,
    //             errMessage: " " + error,
    //           }));
    //           setSubmitDisabled(false);
    //         });
    //       setRowData("");
    //     } else {
    //       UpdateContact({
    //         variables: {
    //           id: rowData.id,
    //           name: partnerName,
    //           email: email,
    //           phone: phoneNumber,
    //           contact_type: "Organization",
    //         },
    //       })
    //         .then((userRes) => {
    //           updateAddress({
    //             variables: {
    //               id: dataAD.addresses[0].id,
    //               contact_id: rowData.id,
    //               address1: address,
    //               address2: "",
    //               city: "",
    //               state: "",
    //               zip: "",
    //               locationType: "Office",
    //             },
    //           })
    //             .then((res: any) => {
    //               updatePartnerSubscription({
    //                 variables: {
    //                   id: partnerSubsID,
    //                   contact_id: rowData.id,
    //                   CCSubscription: CCsubscription,
    //                   RASubscription: RAsubscription,
    //                 },
    //               }).then((res: any) => {
    //                 updateAddress({
    //                   variables: {
    //                     id: dataAD.addresses[0].id,
    //                     contact_id: rowData.id,
    //                     address1: address,
    //                     address2: "",
    //                     city: "",
    //                     state: "",
    //                     zip: "",
    //                     locationType: "Office",
    //                   },
    //                 })
    //                   .then((res: any) => {
    //                     setFormState((formState) => ({
    //                       ...formState,
    //                       isSuccess: false,
    //                       isUpdate: true,
    //                       isDelete: false,
    //                       isFailed: false,
    //                       errMessage: " " + partnerName + " ",
    //                     }));
    //                     backToList();
    //                   })
    //                   .catch((Error) => {
    //                     setSubmitDisabled(false);
    //                   });
    //               });
    //             })
    //             .catch((Error) => {
    //               setSubmitDisabled(false);
    //             });
    //         })
    //         .catch((err) => {
    //           let error = err.message;
    //           setFormState((formState) => ({
    //             ...formState,
    //             isSuccess: false,
    //             isUpdate: false,
    //             isDelete: false,
    //             isFailed: true,
    //             errMessage: " " + error,
    //           }));
    //           setSubmitDisabled(false);
    //         });
    //       setRowData("");
    //     }
    //   } else {
    //     createContact({
    //       variables: {
    //         name: partnerName,
    //         email: email,
    //         phone: phoneNumber,
    //         contact_type: "Organization",
    //       },
    //     })
    //       .then((contRes: any) => {
    //         createOrganization({
    //           variables: {
    //             contact_id: contRes.data.createContact.contact.id,
    //             subtype: "Partner",
    //           },
    //         }).then((orgRes: any) => {
    //           partnerSubscription({
    //             variables: {
    //               contact_id: contRes.data.createContact.contact.id,
    //               CCSubscription: CCsubscription,
    //               RASubscription: RAsubscription,
    //             },
    //           })
    //             .then((res: any) => {
    //               createAddress({
    //                 variables: {
    //                   contact_id: contRes.data.createContact.contact.id,
    //                   address1: address,
    //                   locationType: "Office",
    //                 },
    //               })
    //                 .then((res: any) => {
    //                   setFormState((formState) => ({
    //                     ...formState,
    //                     isSuccess: true,
    //                     isUpdate: false,
    //                     isDelete: false,
    //                     isFailed: false,
    //                     errMessage: " " + partnerName + " ",
    //                   }));
    //                   backToList();
    //                   refetchOrg();
    //                 })
    //                 .catch((err) => {});
    //             })
    //             .catch((err) => {});
    //         });
    //       })
    //       .catch((err) => {
    //         let error = err.message;
    //         setFormState((formState) => ({
    //           ...formState,
    //           isSuccess: false,
    //           isUpdate: false,
    //           isDelete: false,
    //           isFailed: true,
    //           errMessage: " " + error,
    //         }));
    //       });
    //   }
    // }
  };

  const handleClickAdd = (rowData: any) => {
    let viewdata: any = { propsData: rowData };
    history.push(routeConstant.PARTNER_USER, viewdata);
  };

  const deleteTableRow = (rowData: any) => {};

  const backToList = () => {
    props.location.state = {};
    setIsError({ error: null });
    setOpenEdit(false);
  };

  const handleClickEdit = (rowData: any, event: any) => {
    setFormState((formState) => ({
      ...formState,
      isSuccess: false,
      isUpdate: false,
      isDelete: false,
      isFailed: false,
      errMessage: "",
    }));
    setAddPartner(false);
    setRowData(rowData);
    setOpenEdit(true);
    if (rowData) {
      if (rowData.name) {
        setPartnerName(rowData.name);
      }
      if (rowData.email) {
        setEmail(rowData.email);
      }
      if (rowData.phone) {
        setPhoneNumber(rowData.phone);
      }
    }
    // }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        Partner
      </Typography>
      {!openEdit ? (
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
            {/*  */}
          </Grid>
        </AddEditForm>
      )}
    </React.Fragment>
  );
};

export default Partner;
