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
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
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
import { VPN_DISCONNECTION } from "../../../graphql/mutations/VPNConnection"
import Alert from "../../../components/UI/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import SimpleBackdrop from "../../../components/UI/Layout/Backdrop/Backdrop";
import {
  SUCCESS,
  UPDATE,
  DELETE,
  FAILED,
  ALERT_MESSAGE_TIMER,
} from "../../../common/MessageConstants";


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
  const [backdrop, setBackdrop] = useState<Boolean>(false);

  const [getVpnConnectedClients, {
    data: dataVpnConnectedClients,
    loading: loadingVpnConnectedClients,
  }] = useLazyQuery(GET_VPN_CONNECTED_CLIENTS,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      onCompleted: data => {
        createTableDataObject(dataVpnConnectedClients.getTarget.edges);
      },
      onError: error => {
        // logout()
      }
    }
    );
    const [testVpnConnection] = useMutation(VPN_DISCONNECTION);
    const [formState, setFormState] = useState({
      isSuccess: false,
      isUpdate: false,
      isFailed: false,
      isDelete: false,
      errMessage: ""
    });
    
    useEffect(() => {
      getVpnConnectedClients({
        variables: {
          vpnConnectFlag : 'Connected'
        }
      })
    }, []);
    const handleAlertClose = () => {
      setFormState(formState => ({
        ...formState,
        isSuccess: false,
        isUpdate: false,
        isDelete: false,
        isFailed: false,
        errMessage: ""
      }));
    };
  

    useEffect(() => {
      getVpnConnectedClients({
        variables: {
          vpnConnectFlag : 'Connected'
        }
      })
    }, []);

    useEffect(() => {
      getVpnConnectedClients({
        variables: {
          vpnConnectFlag : 'Connected'
        }
      })
    }, [backdrop]);

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

    const createTableDataObject = (data: any) => {
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
    const handleClickClient = (rowData: any) => {
      setBackdrop(true)
      testVpnConnection({
        variables: {
          "input": {
            "client": rowData.clientId,
            "targetName": rowData.targetName,
            "clientName": rowData.clientname
          }
        }
      }).then((response: any) => {
        console.log("RESPONSE",response)
        if (response.data.disconnectVpn.success == "VPN disconnected Successfully") {
          setFormState(formState => ({
            ...formState,
            isSuccess: true,
            isUpdate: false,
            isDelete: false,
            isFailed: false,
            errMessage: "VPN Disconnected Successfully !!"
          }));
          setBackdrop(false)
        } else {
          setFormState(formState => ({
            ...formState,
            isSuccess: false,
            isUpdate: false,
            isDelete: false,
            isFailed: true,
            errMessage: " VPN Disconnection Failed !!"
          }));
          setBackdrop(false)
        }
      }).catch(() => {
        console.log("ERROR");
        setFormState(formState => ({
          ...formState,
          isSuccess: false,
          isUpdate: false,
          isDelete: false,
          isFailed: true,
          errMessage: "VPN Disconnection Failed !!"
        }));
        setBackdrop(false)
      })
    };
    if (loadingVpnConnectedClients || backdrop) return <SimpleBackdrop />;

  return (
    <React.Fragment>
      <CssBaseline />
      <Typography component="h5" variant="h1">
        VPN Connection Status
      </Typography>
      <Grid>
        <Grid item xs={12}>
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
              <strong>{formState.errMessage}</strong>
              {/* {SUCCESS} */}
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
              {formState.errMessage}
            </Alert>
          ) : null}
        </Grid>
        </Grid>
      <Paper className={styles.paper}>
        <MaterialTable
          title={title}
          data = {newData}
          columns={columns}
          actions={[
              {
                icon: () => <DesktopAccessDisabledIcon className={styles.CircleIcon} />,
                tooltip: "Disconnect",
                onClick: (event: any, rowData: any) => {
                  handleClickClient(rowData);
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
