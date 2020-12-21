import React from "react";
import MaterialTable, { Column } from "material-table";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { getThemeProps } from "@material-ui/styles";
import { Paper } from '@material-ui/core';

export default function Table(props: any) {
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      ></link>
      <MaterialTable
        components={{
          Container: props => <Paper {...props} elevation={0}/>,
          Toolbar: (props) => (<div></div>),
        }}
        localization={{
          header: {
            actions: "",
          },
        }}
        title={props.title ? props.title : null}
        columns={props.columns}
        data={props.data}
        actions={props.actions}
        editable={props.editable}
        options={props.options}
        onOrderChange={props.onOrderChange}
        {...props}
      />
    </div>
  );
}
