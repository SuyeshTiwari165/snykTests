import React, { useState, useEffect } from "react";
import styles from "./VpnStatus.module.css";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import { Button } from "../../../components/UI/Form/Button/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Input from "../../../components/UI/Form/Input/Input";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "../../../components/UI/Table/MaterialTable";
import Loading from "../../../components/UI/Layout/Loading/Loading";
import { useQuery, useLazyQuery } from "@apollo/client";
import AutoCompleteDropDown from "../../../components/UI/Form/Autocomplete/Autocomplete";
import logout from "../../Auth/Logout/Logout";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import BlurOffIcon from '@material-ui/icons/BlurOff';
import CancelIcon from '@material-ui/icons/Cancel';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import DesktopAccessDisabledIcon from '@material-ui/icons/DesktopAccessDisabled';
import { GET_VPN_CONNECTED_CLIENTS } from "../../../graphql/queries/Target";
export const VpnStatus: React.FC = (props: any) => {
  const title = "Listing of VPN Connected ";
  const columns = [
    {
      title: "Client Name",
      field: "clientname",
    },
    {
      title: "Status",
      field: "status",
    },
  ];
  const [newData, setNewData] = useState([]);

  const [getVpnConnectedClients, {
    data: dataVpnConnectedClients,
    loading: loadingVpnConnectedClients,
  }] = useLazyQuery(GET_VPN_CONNECTED_CLIENTS,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      onCompleted: data => {
        createTableDataObject(data);
      },
      onError: error => {
        // logout()
      }
    }
    );
    
    useEffect(() => {
      getVpnConnectedClients({
        variables: {
          vpnConnectFlag : 'Connected'
        }
      })
    }, []);

    const createTableDataObject = (data: any) => {
      console.log("DATA",data);
      let arr: any = [];
      data.map((element: any) => {
        let obj: any = {};
        obj["clientname"] = !element.node ? "-" : element.node.client.clientName;
        obj["status"] = element.node.vpnConnectFlag;
        obj["clientId"] = element.node.client.id;
        obj["targetName"] = element.node.targetName
        arr.push(obj);
      });
      setNewData(arr);
    };

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        VPN Connection Status
      </Typography>
      <Paper className={styles.paper}>
        <MaterialTable
          title={title}
          data = {newData}
          columns={columns}
          actions={[
              // {
              //   icon: () => <BlurOffIcon className={styles.CircleIcon} />,
              //   tooltip: "Disconnect",
              //   onClick: (event: any, rowData: any) => {
              //   //   handleClickClient(rowData);
              //   },
              // },
              // {
              //   icon: () => <CloudOffIcon className={styles.CircleIcon} />,
              //   tooltip: "Disconnect",
              //   onClick: (event: any, rowData: any) => {
              //   //   handleClickClient(rowData);
              //   },
              // },
              {
                icon: () => <DesktopAccessDisabledIcon className={styles.CircleIcon} />,
                tooltip: "Disconnect",
                onClick: (event: any, rowData: any) => {
                //   handleClickClient(rowData);
                },
              },
          ]}
          //   data={newData}
          options={{
            thirdSortClick: false,
            actionsColumnIndex: -1,
            paging: true,
            sorting: true,
            search: false,
            filter: true,
            pageSize: 25,
            draggable: false,
            pageSizeOptions: [25, 50, 75, 100],
          }}
        />
      </Paper>
    </React.Fragment>
  );
};

export default VpnStatus;
