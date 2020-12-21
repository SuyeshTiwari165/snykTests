import React from "react";
import { TextField } from "@material-ui/core";
import styles from "./Input.module.css";

const Input = (props: any) => {
  const { required, autoFocus, variant, error, ...rest } = props;

  return (
    <TextField
      InputLabelProps={{
        style: { color: "#a6a6a6" }
      }}
      required={required ? required : false}
      autoFocus={autoFocus ? autoFocus : false}
      variant="outlined"
      fullWidth
      error={error ? error : false}
      {...rest}
      className={styles.ReactInput}
    />
  );
};

export default Input;
