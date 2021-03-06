import React, { useState, useEffect } from "react";
import styles from "./Partner.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import { Button } from "../../../../components/UI/Form/Button/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Alert from "../../../../components/UI/Alert/Alert";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import SimpleBackdrop from "../../../../components/UI/Layout/Backdrop/Backdrop";
import * as routeConstant from "../../../../common/RouteConstants";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "../../../../components/UI/Table/MaterialTable";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../../common/MessageConstants";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_PARTNER } from "../../../../graphql/queries/Partners";
import moment from "moment";
import PeopleIcon from '@material-ui/icons/People';
import DeleteIcon from "@material-ui/icons/Delete";
import { DELETE_PARTNER } from "../../../../graphql/mutations/RaPartner";

export const Partner: React.FC = (props: any) => {
  const [newData, setNewData] = useState<any>([]);
  const [param, setParam] = useState<any>();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);

  //table
  const column = [
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Phone", field: "phone" },
    { title: "Created On", field: "created_on" },
  ];

  const history = useHistory();
  const [formState, setFormState] = useState({
    isSuccess: false,
    isUpdate: false,
    isFailed: false,
    isDelete: false,
    errMessage: "",
  });

  const [deletePartner] = useMutation(DELETE_PARTNER);

  const { data: Org,error: iError, loading: loadOrg, refetch } = useQuery(GET_PARTNER, {
    variables: {
      orderBy : "-created_date"
    },
    onCompleted: (data: any) => {
      createTableDataObject(data.getPartner.edges);
    },
    onError: (error: any) => {
     history.push(routeConstant.ADMIN_DASHBOARD,param)
    },
    fetchPolicy: "cache-and-network"
  });
  useEffect(() => {
    setParam(props.location.state);
    if (props.location.state && props.location.state !== null && props.location.state.formState) {
      setFormState(props.location.state.formState);
    }
  }, []);
  
  useEffect(() => {
    if (
      formState.isDelete === true ||
      formState.isFailed === true ||
      formState.isSuccess === true ||
      formState.isUpdate === true
    ) {
      setTimeout(function() {
        handleAlertClose();
      }, ALERT_MESSAGE_TIMER);
    }
  }, [formState]);

  function convertDate(inputFormat: any) {
    function pad(s: any) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  }

  // const getDateAndTime = (utcDate: any) => {
  //   if (utcDate === "" || utcDate === null) {
  //     return null;
  //   } else {
  //     var dateFormat: any = new Date(utcDate);
  //     var hours = dateFormat.getHours();
  //     var minutes = dateFormat.getMinutes();
  //     var ampm = hours >= 12 ? 'PM' : 'AM';
  //     hours = hours % 12;
  //     hours = hours ? hours : 12; // the hour '0' should be '12'
  //     minutes = minutes < 10 ? '0' + minutes : minutes;
  //     var strTime = hours + ':' + minutes + ' ' + ampm;
  //     var dateAndTime = convertDate(new Date(utcDate)) + " " + strTime;
  //     return dateAndTime;
  //   }
  // };

  const createTableDataObject = (data: any) => {
    let arr: any = [];
    data.map((element: any, index: any) => {
      let obj: any = {};
      obj["id"] = element.node.id;
      obj["partner_id"] = element.node.partnerName;
      obj["name"] = element.node.partnerName;
      obj["email"] = element.node.emailId;
      obj["phone"] = element.node.mobileNumber;
      obj["address"] = element.node.address;
      obj["created_on"] = element.node.createdDate ? moment(element.node.createdDate).format(
        "MM/DD/YYYY hh:mm a") : "-";
      arr.push(obj);
    });
    setNewData(arr);
  };

  // const handleClickOpen = () => {
  //   history.push(routeConstant.PARTNER_FORM_ADD);
  // };

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

  const handleClickAdd = (rowData: any) => {
    let viewdata: any = rowData;
    history.push(routeConstant.PARTNER_USER, viewdata);
  };

  const handleClickClient = (rowData: any) => {
    history.push(routeConstant.CLIENT, rowData);
  };

  const handleClickEdit = (rowData: any, event: any) => {
    if (
      user && user.user && user.user.role &&
      user.user.role.name === "Company User"
    ) {
      history.push(routeConstant.PARTNER_FORM_EDIT + rowData.partner_id, rowData);
    }
    if (user && user.isSuperuser) {
      history.push(routeConstant.PARTNER_FORM_EDIT + rowData.partner_id, rowData);
    }
  };
  const handleClickDelete = (event: any, rowData: any) => {
    setShowBackdrop(true);
    deletePartner({
      variables: {
        id: rowData.partner_id
      },
    }).then((res: any) => {
      setShowBackdrop(false);
      refetch()
      if(res.data.deletePartner.status === "Partner is deleted") {
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: true,
        isFailed: false,
        errMessage: "  " + rowData.name + "  " ,
      }));
    }
    if(res.data.deletePartner.status === "Partner is not deleted") {
      setShowBackdrop(false);
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: " Failed to Delete Partner  " + rowData.name + " " ,
      }));
    }
    })
    .catch((err) => {
      setShowBackdrop(false);
      setFormState((formState) => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: true,
        errMessage: err,
      }));
    });
    
  }
  
  if (loadOrg || showBackdrop) return <SimpleBackdrop />;

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        Partner
      </Typography>
      <Grid className={styles.TableWrap}>
        {/* <Grid container>
          <Grid item xs={12} className={styles.FilterAddWrap}>
            <div className={styles.FilterInput}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleClickOpen}
              >
                <AddCircleIcon className={styles.EditIcon} />
                  &nbsp; Partner
                </Button>
            </div>
          </Grid>
        </Grid> */}
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
              <strong>{formState.errMessage}</strong>
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
                icon: () => <AddCircleIcon className={styles.CircleIcon} />,
                tooltip: "Add Partner User",
                onClick: (event: any, rowData: any) => {
                  handleClickAdd(rowData);
                },
              },
              {
                icon: () => <PeopleIcon className={styles.CircleIcon} />,
                tooltip: "Clients",
                onClick: (event: any, rowData: any) => {
                  handleClickClient(rowData);
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
              thirdSortClick: false,
              pageSize: 25,
              pageSizeOptions: [25, 50, 75, 100] // rows selection options
            }}
          />
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default Partner;
