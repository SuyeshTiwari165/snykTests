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
// import { CREATE_CONTACT } from "../../../graphql/mutations/Contacts";
// import { CREATE_ORG } from "../../../graphql/mutations/Organization";
// import { GET_ORGANIZATION } from "../../../graphql/queries/Organization";
// import { GET_CONTACT_INFO } from "../../../graphql/queries/Contact";
// import {
//   GET_INDIVIDUAL,
//   GET_INDIVIDUAL_COUNT
// } from "../../../graphql/queries/Individual";
// import { GET_PARTNER_SUBSCRIPTION } from "../../../graphql/queries/PartnerSubscription";
// import { GET_ROLE_BASED_USER } from "../../../graphql/queries/User";
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
  // Fetch Partner Data
  // const { data: Org,error: iError, loading: loadOrg } = useQuery(GET_ORGANIZATION, {
  //   variables: {
  //     where: { subtype: "Partner" },
  //     sort: "created_at:desc"
  //   },
  //   onCompleted: (data: any) => {
  //     createTableDataObject(data.organizations);
  //     let contact_id_array = data.organizations.map(
  //       (val: any) => val.contact_id.id
  //     );
  //     getPartnerSubs({
  //       variables: {
  //         where: { contact_id_in: contact_id_array }
  //       }
  //     });
  //   },
  //   fetchPolicy: "cache-and-network"
  // });

  // const [getPartnerSubs, { data: dataSubs, loading: loadSubs }] = useLazyQuery(
  //   GET_PARTNER_SUBSCRIPTION,
  //   {
  //     onCompleted: (data: any) => {},
  //     fetchPolicy: "cache-and-network"
  //   }
  // );

  // Fetch all Partner user Count
  // const { data: allPartnerCount } = useQuery(GET_ROLE_BASED_USER, {
  //   variables: {
  //     where: { role: { name: CompanyUser } }
  //   },
  //   onCompleted: data => {
  //     console.log("All Partner User Based on Role ID", allPartnerCount);
  //     setPartnerUserCount(allPartnerCount.users.length);
  //   }
  // });
  // Fetch Partners
  // const {
  //   data: partnerData,
  //   error: errorOrg1,
  //   loading: loadingOrg1
  // } = useQuery(GET_ORGANIZATION, {
  //   fetchPolicy: "cache-and-network",
  //   variables: {
  //     where: { subtype: "Partner" }
  //   },
  //   onCompleted: () => {
  //     setPartnerCount(partnerData.organizations.length);
  //   }
  // });
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
      // obj["clientId"] = element.contact_id.id;
      // obj["partner"] = element.contact_id.name;
      // obj["id"] = element.contact_id.id;
      obj["partner"] = element.node.partnerName;
      obj["email"] = element.node.emailId;
      obj["phone"] = element.node.mobileNumber;
      obj["address"] = element.node.address;
      obj["partnerOrgId"] = element.node.id;
      // obj["createdon"] = moment(element.contact_id.created_at).format(
      //   "MM/DD/YYYY hh:mm a"
      // );
      arr.push(obj);
    });
    setNewData(arr.slice(0, 5));
  };
  // const createTableDataObject = (data: any) => {
  //   let arr: any = [];
  //   data.map((element: any, index: any) => {
  //     let obj: any = {};
  //     obj["partner_id"] = element.node.id;
  //     obj["name"] = element.node.partnerName;
  //     obj["email"] = element.node.emailId;
  //     obj["phone"] = element.node.mobileNumber;
  //     obj["address"] = element.node.address;
  //     arr.push(obj);
  //   });
  //   setNewData(arr);
  // };


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
            {/* <Typography variant="h1" component="div">
              Partners
            </Typography>
            <Typography variant="h1" component="div">
              {partnerCount}
            </Typography> */}
          </Grid>

          <Grid item xs={6} className={styles.FilterAddWrap}>
            {/* <Typography variant="h1" component="div">
              Partner User
            </Typography>
            <Typography variant="h1" component="div">
              {partnerUserCount}
            </Typography> */}
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
              {/* <AddCircleIcon /> */}
              &nbsp; Partner
            </Button>
          </div>
        </Grid>
        {/* </Container> */}
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
