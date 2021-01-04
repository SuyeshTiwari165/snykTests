// import React from "react";
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

export const Dashboard: React.FC = (props: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [partnerCount, setPartnerCount] = useState();
  const [partnerUserCount, setPartnerUserCount] = useState();
  const contact = JSON.parse(localStorage.getItem("contact") || "{}");
  const [newData, setNewData] = useState();

  console.log("---contact-", contact);
  const history = useHistory();

  const { data: Org, loading: loadOrg } = useQuery(
    GET_PARTNER,
    {
      onCompleted: (data: any) => {
        createTableDataObject(data.getPartner.edges);
        setPartnerCount(data.getPartner.edges.length);
      },
      fetchPolicy: "cache-and-network",
    }
  );
  const { data: partnerUsers, loading: loadPartnerUsers } = useQuery(
    GET_PARTNER_USERS,
    {
      onCompleted: (data: any) => {
        setPartnerUserCount(data.getPartnerUserDetails.edges.length);
      },
      fetchPolicy: "cache-and-network",
    }
  );

  //table
  const column = [
    { title: "Partner", field: "partner" },
    { title: "Created On", field: "createdon" }
  ];

  const createTableDataObject = (data: any) => {
    let arr: any = [];
    data.map((element: any, index: any) => {
      let obj: any = {};
      obj["partner"] = element.node.partnerName;
      obj["email"] = element.node.emailId;
      obj["phone"] = element.node.mobileNumber;
      obj["address"] = element.node.address;
      obj["partnerOrgId"] = element.node.id;
      arr.push(obj);
    });
    setNewData(arr.slice(0, 5));
  };

  const handleClickOpen = () => {
    let data: any = { showAddClient: true };
    history.push(routeConstant.CLIENT, data);
  };

  const partnerClickOpen = () => {
    let data: any = { "AddPartner": true };
    history.push(routeConstant.ADD_PARTNER, data);
  };

  const onRowClick = (event: any, rowData: any, oldData: any, param: any) => {
    let data: any = { clientInfo: rowData };
    if (param === "RA") {
      history.push(routeConstant.RA_REPORT_LISTING, data);
    }
    if (param === "View") {
    }
    if (param === "Edit") {
      history.push(routeConstant.ADD_PARTNER, rowData);
    }
    if (param === "Delete") {
    }
  };

  // if (loadOrg || loadingOrg1 || loadSubs) return <Loading />;
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
              <div className={styles.dash_head}>Partners</div>
              <div className={styles.dash_count}>{partnerCount}</div>
            </div>
          </Grid>
          <Grid item xs={6} className={styles.FilterAddWrap}>
            <div className={styles.dash_block}>
              <div className={styles.dash_head}>Partner User</div>
              <div className={styles.dash_count}>{partnerUserCount}</div>
            </div>
          </Grid>
          <div className={styles.partnerButton}>
            <Button
              className={styles.partnerinsideButton}
              color="primary"
              variant="contained"
              onClick={partnerClickOpen}
            >
              &nbsp; Partner
            </Button>
          </div>
        </Grid>
      </React.Fragment>
      <Grid className={styles.recentTypo} item xs={6}>
        <Typography component="h2" variant="h1" gutterBottom>
          Recently added Partners
        </Typography>
      </Grid>
      <Grid>
        <Paper className={styles.tableGrid}>
          <MaterialTable
            columns={column}
            data={newData}
            actions={[
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
                  onRowClick(event, rowData, oldData, "Edit");
                }
              }
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
