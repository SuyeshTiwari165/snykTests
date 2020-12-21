import React from "react";
import { Switch as SwitchElement } from "@material-ui/core";
import styles from "./Switch.module.css";

export interface SwitchProps {
  checked?: boolean;
  onChange?: any;
  className?: any;
  disabled?: boolean;
  name?: any;
  value?: any;
  inputProps?: any;
  id?: any;
  Small?: any;
}
const Switch: React.FC<SwitchProps> = (props) => {
  return (
    <SwitchElement
      checked={props.checked}
      onChange={props.onChange}
      name={props.name}
      id={props.id}
      className={props.className}
      value={props.value}
      disabled={props.disabled}
      inputProps={props.inputProps}
      disableRipple
      {...props}
    ></SwitchElement>
  );
};
export default Switch;
