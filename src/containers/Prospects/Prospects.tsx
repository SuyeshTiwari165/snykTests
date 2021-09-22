import React, { useState, useEffect } from "react";
import styles from "./Prospects.module.css";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_TARGET_STATUS_BY_TYPE } from "../../graphql/queries/ReportListing";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "../../components/UI/Table/MaterialTable";
import { Typography } from "@material-ui/core";
import Cookies from 'js-cookie';
import { RA_REPORT_DOWNLOAD } from "../../config";
import GetAppIcon from "@material-ui/icons/GetApp";

export const Prospects: React.FC = (props: any) => {
    const [newData, setNewData] = useState([]);
    const column = [
        { title: "Prospect Name", field: "name" },
        { title: "Prospect Status", field: "status" },
      ];

  useEffect(() => {
      console.log("PROSPECTOS PROPS",props);
    getTarget({
        variables: {
        client_name: props.location.state ? props.location.state.clientInfo.prospectName : null,
          client_type: "Prospect",
          scan_type : props.location.state.type
        },
      });
}, []);
    const [getTarget, { data: ipData, loading: ipLoading }] = useLazyQuery(
        GET_TARGET_STATUS_BY_TYPE,
        {
          fetchPolicy: "cache-and-network",
          onCompleted: (data: any) => {
              createTableDataObject(data.getTarget.edges);
          },
          onError: (error) => {
            // logout()
          },
        }
      );
      const createTableDataObject = (data: any) => {
        let arr: any = [];
        data.map((element: any) => {
            let obj: any = {};
            obj["name"] = element.node.targetName;
            obj["clientId"] = element.node.client.id;
            obj["clientName"] = element.node.client.clientName;
            obj["status"] = element.node.targetStatus.name;
            obj["targetId"] = element.node.id;

            arr.push(obj);
        });
        setNewData(arr);
      };
      const handleDownload = (rowData: any) => {
        if (Cookies.getJSON("ob_session")) { 
        // setBackdrop(true)
        let intTargetId = parseInt(rowData.targetId);
        const DocUrl =
          RA_REPORT_DOWNLOAD + "?cid=" + rowData.clientId + "&tid=" + intTargetId;
        fetch(DocUrl, {
          method: "GET"
        }).then((response: any) => {
          response.blob().then((blobData: any) => {
            saveAs(blobData, rowData.target);
            // setBackdrop(false)
          });
        })
        .catch((err) => {
        //   setBackdrop(false);
          let error = err.message;
        //   setFormState((formState) => ({
        //     ...formState,
        //     isSuccess: false,
        //     isUpdate: false,
        //     isDelete: false,
        //     isFailed: true,
        //     errMessage: error,
        //   }));
        });
      } else {
        // logout();
      }
      };
    return (
        <React.Fragment>
        <Typography component="h5" variant="h1">
          {props.location.state.type} Prospects
        </Typography>
            <Paper className={styles.paper}>
          <div className={styles.ScrollTable}>
            {newData.length !== 0 ? (
              <MaterialTable
                columns={column}
                data={newData}
                actions={[
                    (rowData: any) =>
                    rowData.status == "Report Generated"
                    ? {
                        // disabled: rowData.status !== "Done",
                        icon: () => <GetAppIcon />,
                        tooltip: "Download",
                        onClick: (event: any, rowData: any) => {
                          handleDownload(rowData);
                        },
                      }
                    : null 
                ]}
                options={{
                  headerStyle: {
                    background: "linear-gradient(#fef9f5,#fef9f5)",
                    whiteSpace: "nowrap",
                  },

                  thirdSortClick: false,
                  actionsColumnIndex: -1,
                  paging: true,
                  sorting: true,
                  search: false,
                  filter: true,
                  draggable: false,
                  pageSize: 25,
                  pageSizeOptions: [25, 50, 75, 100], // rows selection options
                }}
              />
            ) : 
              <Typography component="h5" variant="h3">
                You don't have any Prospects
              </Typography>
            }
          </div>
        </Paper>
         </React.Fragment>
    );
};

export default Prospects;