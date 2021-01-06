import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import Typography from "@material-ui/core/Typography";
import MaterialTable from "../../components/UI/Table/MaterialTable";
import Grid from "@material-ui/core/Grid";
import { Button } from "../../components/UI/Form/Button/Button";
import Paper from "@material-ui/core/Paper";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Input from "../../components/UI/Form/Input/Input";
import DescriptionIcon from "@material-ui/icons/Description";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import AssessmentIcon from "@material-ui/icons/Assessment";
import DeleteIcon from "@material-ui/icons/Delete";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_CLIENTS } from "../../graphql/queries/Client";
import { useHistory } from "react-router-dom";
import logout from "../../containers/Auth/Logout/Logout";
import * as routeConstant from "../../common/RouteConstants";
import moment from "moment";
import Loading from "../../components/UI/Layout/Loading/Loading";
import { Link } from 'react-router-dom'

export const Dashboard: React.FC = () => {
  const [clientCount, setClientCount] = useState();
  const [partnerCount, setPartnerCount] = useState();
  const contact = JSON.parse(localStorage.getItem("contact") || "{}");
  const [newData, setNewData] = useState();
  const [CCsubscription, setCCsubscription] = useState(false);
  const [RAsubscription, setRAsubscription] = useState(false);
  const history = useHistory();
  const partner = JSON.parse(localStorage.getItem("partnerData") || "{}");

  const [
    getClients,
    { data: ipData, loading: ipLoading },
  ] = useLazyQuery(GET_CLIENTS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      createTableDataObject(data.getClient.edges)
      setClientCount(data.getClient.edges.length)
    },
  });


  useEffect(() => {
    if (partner)
      getClients({
        variables: {
          partnerId: partner.partnerId
        },
      });
  }, []);

  const createTableDataObject = (data: any) => {
    let arr: any = [];
    data.map((element: any) => {
      let obj: any = {};
      obj["email"] = !element.node.emailId ? "-" : element.node.emailId;
      obj["name"] = element.node.clientName;
      obj["phone"] = !element.node.mobileNumber ? "-" : element.node.mobileNumber;
      obj["clientId"] = element.node.id;
      obj["partnerId"] = element.node.partnerId;
      obj["clientOrgId"] = element.id;
      arr.push(obj);
    });
    setNewData(arr.slice(0, 5));
  };

  //table
  const column = [
    { title: "Company Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Phone", field: "phone" },
    { title: "Created on", field: "createdon" },
  ];

  const handleClickOpen = () => {
    let data: any = { showAddClient: true };
    history.push(routeConstant.CLIENT, data);
  };
  const partnerClickOpen = () => {
    let data: any = { "showPartnerUser": true };
    history.push(routeConstant.PARTNER_USER, data);
  };

  const handleClickEdit = (rowData: any) => {
    history.push(routeConstant.CLIENT_FORM_EDIT + rowData.clientId, rowData);
  };

  const onRowClick = (event: any, rowData: any, oldData: any, param: any) => {
    let data: any = { clientInfo: rowData };
    // if (param === "CC") {
    //   history.push(routeConstant.COMPLIANCE_LIST, data);
    // }
    if (param === "RA") {
      history.push(routeConstant.RA_REPORT_LISTING, data);
    }
    if (param === "View") {
    }
    if (param === "Edit") {
      handleClickEdit(rowData);
    }
    if (param === "Delete") {
    }
  };


  // if (loadSubs || ipLoading || iLoading || loadingOrg) return <Loading />;
  // if (iError) {
  //   let error = { message: "Error" };
  //   return (
  //     <div className="error">
  //       Error!
  //       {logout()}
  //     </div>
  //   )
  // }

  return (
    <div>
      <React.Fragment>
        <CssBaseline />
        <Grid container spacing={3} className={styles.GridBox}>
          <Grid item xs={6} className={styles.FilterAddWrap}>

            <div className={styles.dash_block}>
              <div className={styles.dash_head}>Clients</div>
              <div className={styles.dash_count}>{clientCount}</div>
            </div>
          </Grid>
          <Grid item xs={6} className={styles.FilterAddWrap}>
            <div className={styles.partnerButton}>
              <Link to={routeConstant.PARTNER_USER_FORM_ADD}>
                <Button color="primary" variant="contained">
                  <AddCircleIcon />
                  User
                </Button>
              </Link>
            </div>
            <div className={styles.partnerButton}>
              <Link to={routeConstant.CLIENT_FORM_ADD}>
                <Button
                  color="primary"
                  variant="contained"
                // onClick={handleClickOpen}
                >
                  <AddCircleIcon />
                 Client
              </Button>
              </Link>
            </div>
          </Grid>
        </Grid>
        {/* </Container> */}
      </React.Fragment>
      <Grid className={styles.recentTypo} item xs={6}>
        <Typography component="h2" variant="h1" gutterBottom>
          Recently added clients
        </Typography>
      </Grid>
      <Grid>
        <Paper className={styles.tableGrid}>
          <MaterialTable
            columns={column}
            data={newData}
            actions={[
              // RAsubscription
              //   ? {
              //     icon: () => <AssessmentIcon />,
              //     tooltip: "Risk Assessment",
              //     onClick: (event: any, rowData: any, oldData: any) => {
              //       onRowClick(event, rowData, oldData, "RA");
              //     },
              //   }
              //   : null,
              // {
              //   icon: () => <VisibilityIcon />,
              //   tooltip: "View",
              //   onClick: (event: any, rowData: any, oldData: any) => {
              //     onRowClick(event, rowData, oldData, 'View');
              //   },
              // },
              {
                icon: () => <EditIcon />,
                tooltip: "Edit",
                onClick: (event: any, rowData: any, oldData: any) => {
                  onRowClick(event, rowData, oldData, 'Edit');
                },
              },
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
                backgroundColor: "#EFF6FD",
                color: "#002F60",
              },
              actionsColumnIndex: -1,
              paging: false,
              sorting: true,
              search: false,
              filter: true,
              draggable: false,
            }}
          />
        </Paper>
      </Grid>
    </div>
  );
};

export default Dashboard;
