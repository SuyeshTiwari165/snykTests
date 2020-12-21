import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Input from "../Input/Input"
import styles from "./Autocomplete.module.css";

const AutoCompleteDropDown = (props: any) => {
  return (
    <Autocomplete
      id={props.id}
      className = {styles.ReactAutoComplete}
      disabled={props.disabled}
      value={props.value ? props.value : []}
      renderInput={(params: any) =>
        <Input
          {...params}
          className = {styles.ReactAutoCompleteInput}
          required={props.required}
          id={props.id}
          error={props.error}
          label={props.label}
          style={{margin:'0px',}}
        />
      }
      {...props}
      
    />
  );
};

export default AutoCompleteDropDown;