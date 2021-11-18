import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Input from "../Input/Input";
import styles from "./Autocomplete.module.css";
import { Button, Tooltip } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import * as msgConstant from "../../../../common/MessageConstants";

const AutoCompleteDropDown = (props: any) => {
  return (
    props.id === 'policyValue' ? (
    <Autocomplete
      id={props.id}
      className={styles.ReactAutoComplete}
      disabled={props.disabled}
      value={props.value ? props.value : []}
      options={props.options}
      //disableCloseOnSelect
      getOptionLabel={(option:any) => option.title}
      renderOption={(option :any, { selected }) => (
        option.policyType ? 
        <React.Fragment>
           {option.policyType === "Low Policy" ? (
           <Tooltip title={msgConstant.LOW} placement="right">
             <div>

          {option.policyType.slice(0, 4)}
          <Info className={styles.CircleIcon2}/>

          </div>
          </Tooltip>
          ):null}
           {option.policyType === "Medium Policy" ? (
           <Tooltip title={msgConstant.MEDIUM} placement="right">
             <div>
          {option.policyType.slice(0, 6)}
          <Info className={styles.CircleIcon2}/>

          </div>
          </Tooltip>
          ):null}
           {option.policyType === "High Policy" ? (
           <Tooltip title={msgConstant.HIGH} placement="right">
             <div>
          {option.policyType.slice(0, 5)}
          <Info className={styles.CircleIcon2}/>
          </div>
          </Tooltip>
          ):null}
          </React.Fragment> : null
      )}
      renderInput={(params: any) => (
        <Input
          {...params}
          className={styles.ReactAutoCompleteInput}
          required={props.required}
          id={props.id}
          error={props.error}
          label={props.label}
          style={{ margin: "0px" }}
        />
      )}
      {...props}
    />
    ) :  <Autocomplete
    id={props.id}
    className={styles.ReactAutoComplete}
    disabled={props.disabled}
    value={props.value ? props.value : []}
    renderInput={(params: any) => (
      <Input
        {...params}
        className={styles.ReactAutoCompleteInput}
        required={props.required}
        id={props.id}
        error={props.error}
        label={props.label}
        style={{ margin: "0px" }}
      />
    )}
    {...props}
  />
  );
};

export default AutoCompleteDropDown;
