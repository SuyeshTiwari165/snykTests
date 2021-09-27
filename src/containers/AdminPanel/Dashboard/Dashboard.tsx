import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import Typography from "@material-ui/core/Typography";
import MaterialTable from "../../../components/UI/Table/MaterialTable";
import Grid from "@material-ui/core/Grid";
import { Button } from "../../../components/UI/Form/Button/Button";
import Paper from "@material-ui/core/Paper";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Input from "../../../components/UI/Form/Input/Input";
import DescriptionIcon from "@material-ui/icons/Description";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import AssessmentIcon from "@material-ui/icons/Assessment";
import SimpleBackdrop from "../../../components/UI/Layout/Backdrop/Backdrop";
import DeleteIcon from "@material-ui/icons/Delete";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_PARTNER } from "../../../graphql/queries/Partners";
import { GET_PARTNER_USERS, GET_PARTNER_ID_USER } from "../../../graphql/queries/PartnerUser";
import { useHistory } from "react-router-dom";
import * as routeConstant from "../../../common/RouteConstants";
import moment from "moment";
import { CompanyUser } from "../../../common/Roles";
import Loading from "../../../components/UI/Layout/Loading/Loading";
import logout from "../../../containers/Auth/Logout/Logout";
import { GET_REPORT_LISTING,GET_REPORT_LISTING_STATUS } from "../../../graphql/queries/ReportListing";
import Cookies from "js-cookie";

export const Dashboard: React.FC = (props: any) => {
  const [partnerCount, setPartnerCount] = useState();
  const [partnerUserCount, setPartnerUserCount] = useState();
  const [newData, setNewData] = useState();
  const [prosData, setProsData] = useState();

  const history = useHistory();

  useEffect(()=>{
    getPartnerUsersdata()
  },[])
  
    const{ error:partnerError , loading: loadPartner } = useQuery(GET_PARTNER, {
      variables: {
        orderBy: "-created_date",
      },
      onCompleted: (data: any) => {
        // createTableDataObject(data.getPartner.edges);
        setPartnerCount(data.getPartner.edges.length);
      },
      fetchPolicy: "cache-and-network",
    });

    const{   data: dataReportListing, loading: loadClient  } = useQuery(GET_REPORT_LISTING_STATUS, {
        fetchPolicy: "cache-and-network",
        onCompleted:(data)=>{
          createTableDataObject(data.getTargetStatus);
        },
        onError: error => {
           logout()
          // history.push(routeConstant.DASHBOARD);
        }
      });

  const [getPartnerUsersdata ,{ loading: loadPartnerUsers }] = useLazyQuery(
    GET_PARTNER_USERS,
    {
      onCompleted: (data: any) => {
        let arr: any = [];
        data.getPartnerUserDetails.edges.map((element: any, index: any) => {
          if(element.node.userType == 'Partner') {
            let obj: any = {};
            arr.push(obj);
          }
        });
        setPartnerUserCount(arr.length);
      },
      fetchPolicy: "cache-and-network",
      onError:()=>{
        logout()
      }
    }
  );

  //table
  const column = [
    { title: "Client", field: "client" },
    // { title: "Target", field: "target" },
    // { title: "Start Date", field: "startDate" },
    // { title: "Status", field: "status" },
    // { title: "Published Status", field: "publishedFlag" }
  ];
  const ProspectColumn = [
    { title: "Prospect", field: "client" },
  ];

  const createTableDataObject = (data: any) => {
    let arr: any = [];
    let prosarr : any = [];
    data.map((element: any, index: any) => {
      let obj: any = {};
      let obj2 :any = {}
      if(element.status=== "Generating Report" && element.publishedFlag === "Unpublished" && element.clientType === "Client") {
      obj["client"] = element.clientName;
      obj["target"] = element.targetName;
      obj["targetId"] = element.targetId;
      obj["clientId"] = element.clientId;
      obj["status"] = element.status;
      obj["publishedFlag"] = element.publishedFlag;
      obj["startDate"] = element.startDate;
      arr.push(obj);
      }
      if(element.status=== "Generating Report" && element.publishedFlag === "Unpublished" && element.clientType === "Prospect") {
        obj2["client"] = element.clientName;
        obj2["target"] = element.targetName;
        obj2["targetId"] = element.targetId;
        obj2["clientId"] = element.clientId;
        obj2["status"] = element.status;
        obj2["publishedFlag"] = element.publishedFlag;
        obj2["startDate"] = element.startDate;
        obj2["external"] = element.external;
        obj2["pentest"] = element.pentest;
        prosarr.push(obj2);
        }
    });
    // setNewData(arr.slice(0, 5));
    let pp = arr.filter( (ele :any , ind:any) => ind === arr.findIndex( (elem : any) => elem.client === ele.client ))
    let pp2 = prosarr.filter( (ele :any , ind:any) => ind === prosarr.findIndex( (elem : any) => elem.client === ele.client ))
    setNewData(pp);
    setProsData(pp2)

  };

  const partnerClickOpen = () => {
    let data: any = { "AddPartner": true };
    history.push(routeConstant.ADD_PARTNER, data);
  };

  const ReportClickOpen = () => {
    // let data: any = { "AddPartner": true };
    history.push(routeConstant.ADMIN_REPORT_STATUS);
  };
  

  const onRowClick = (event: any, rowData: any, oldData: any, param: any) => {
    let data: any = { clientInfo: rowData };
    if (param === "RA") {
      history.push(routeConstant.RA_REPORT_LISTING, data);
    }

    if (param === "Edit") {
      history.push(routeConstant.PARTNER_FORM_EDIT + rowData.partnerId, rowData);
    }
    if (param === "View") {
      let d = {
        "clientId" : rowData.clientId,
        "name": rowData.client
      }
      let data: any = { clientInfo: d, partnerId : "" };
      history.push(routeConstant.RA_REPORT_LISTING, data);
    }
    if (param === "ViewExternal") {
      if (Cookies.getJSON("ob_session")) {
        let data = { clientInfo: rowData ,type: "External"};
        history.push(routeConstant.VIEW_PROSPECT, data);
      } else {
        logout();
      }
    }
    if (param === "viewPenTest") {
      if (Cookies.getJSON("ob_session")) {
        let data = { clientInfo: rowData ,type: "Pentest"};
        history.push(routeConstant.VIEW_PROSPECT, data);
      } else {
        logout();
      }
    }
  };

  // if (loadPartner || loadPartnerUsers || loadClient ) return <SimpleBackdrop />;
  if (partnerError) {
    let error = { message: "Error" };
    return (
      <div className="error">
        Error!
        {logout()}
      </div>
    )
  }

  return (
    <div>
      <React.Fragment>
        <CssBaseline />
        {loadPartner || loadPartnerUsers || loadClient   ? <SimpleBackdrop/>: null}

        <Grid container spacing={3} className={styles.GridBox}>
          <Grid item xs={12} sm={6} className={styles.FilterAddWrap}>
            <div className={styles.dash_block}>
              <div className={styles.dash_head}>Partners</div>
              <div className={styles.dash_count}>{partnerCount}</div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className={styles.FilterAddWrap}>
            <div className={styles.dash_block}>
              <div className={styles.dash_head}>Partner User</div>
              <div className={styles.dash_count}>{partnerUserCount}</div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
          <div className={styles.partnerButton}>
            <Button
              // className={styles.partnerinsideButton}
              color="primary"
              variant="contained"
              onClick={partnerClickOpen}
            >
              &nbsp; Partner
            </Button>
          </div>
          </Grid>
          <Grid item xs={12} sm={6}>
          <div className={styles.partnerButton}>
            <Button
              // className={styles.partnerinsideButton}
              color="primary"
              variant="contained"
            onClick={ReportClickOpen}
            >
              &nbsp; Report Status
            </Button>
          </div>
          </Grid>
        </Grid>
      </React.Fragment>
      <Grid className={styles.recentTypo} item xs={12}>
        <Typography component="h2" variant="h1" gutterBottom>
            Pending Reports of Clients
        </Typography>
        <br></br>

      </Grid>
      <Grid>
        <Paper className={styles.tableGrid}>
          <MaterialTable
            columns={column}
            data={newData}
            actions={[
              {
                icon: () => <VisibilityIcon />,
                tooltip: "View",
                onClick: (event: any, rowData: any, oldData: any) => {
                  onRowClick(event, rowData, oldData, 'View');
                },
              },
              // {
              //   icon: () => <img className={styles.EditIcon}
              //   src={
              //     process.env.PUBLIC_URL + "/icons/svg-icon/edit.svg"
              //   }
              //   alt="edit icon"
              // />,
              //   tooltip: "Edit",
              //   onClick: (event: any, rowData: any, oldData: any) => {
              //     onRowClick(event, rowData, oldData, "Edit");
              //   }
              // }
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
                backgroundColor: "#fef9f5",
                color: "#002F60"
              },
              actionsColumnIndex: -1,
              paging: false,
              sorting: true,
              search: false,
              filter: true,
              draggable: false
            }}
          />
        </Paper>
      </Grid>
      <Grid className={styles.recentTypo} item xs={12}>
        <Typography component="h2" variant="h1" gutterBottom>
            Pending Reports of Prospects
        </Typography>
        <br></br>

      </Grid>
      <Grid>
        <Paper className={styles.tableGrid}>
          <MaterialTable
            columns={ProspectColumn}
            data={prosData}
            actions={[
              // {
              //   icon: () => <VisibilityIcon />,
              //   tooltip: "View",
              //   onClick: (event: any, rowData: any, oldData: any) => {
              //     onRowClick(event, rowData, oldData, 'View');
              //   },
              // },
              // {
              //   icon: () => <img className={styles.EditIcon}
              //   src={
              //     process.env.PUBLIC_URL + "/icons/svg-icon/edit.svg"
              //   }
              //   alt="edit icon"
              // />,
              //   tooltip: "Edit",
              //   onClick: (event: any, rowData: any, oldData: any) => {
              //     onRowClick(event, rowData, oldData, "Edit");
              //   }
              // }
              // {
              //   icon: () => <DeleteIcon />,
              //   tooltip: "Delete",
              //   onClick: (event: any, rowData: any, oldData: any) => {
              //     onRowClick(event, rowData, oldData, 'Delete');
              //   },
              // },
              (rowData: any) =>
              rowData.pentest 
              ? {
                  icon: () => 
                  // "OB360 Pen",
                  <Typography component="h6" variant="h4">
                  OB360 PENTEST {rowData.external ? "|" : null}
              </Typography>,
                  // tooltip: "Pen Test",
                  onClick: (event: any, rowData: any, oldData: any) => {
                    onRowClick(event, rowData, oldData, "viewPenTest");
                  },
                }
              : null,
              (rowData: any) =>
              rowData.external
              ?  {
                icon: () => 
                // <div className={styles.Pen}>OB360 Vulnerability</div>,
              <Typography component="h6" variant="h4">
               OB360 VULNERABILITY TEST
              </Typography>,
                // icon: () => <AddCircleIcon className={styles.CircleIcon} />,
                // tooltip: "View External Vulnerability Test",
                onClick: (event: any, rowData: any, oldData: any) => {
                  onRowClick(event, rowData, oldData, "ViewExternal");
                },
              }
              : null,

            ]}
            options={{
              headerStyle: {
                backgroundColor: "#fef9f5",
                color: "#002F60"
              },
              actionsColumnIndex: -1,
              paging: false,
              sorting: true,
              search: false,
              filter: true,
              draggable: false
            }}
          />
        </Paper>
      </Grid>
    </div>
  );
};

export default Dashboard;
