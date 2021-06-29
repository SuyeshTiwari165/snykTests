import React from "react";
import { Button as ButtonElement } from "@material-ui/core";
import styles from "./Button.module.css";
import classNames from "classnames";

export interface ButtonProps {
  "data-testid"?: string;
  children: any;
  variant?: "text" | "outlined" | "contained" | undefined;
  color?: "inherit" | "primary" | "secondary" | "default" | undefined;
  onClick?: any;
  className?: any;
  disabled?: boolean;
  to?: any;
  type?: any;
  onKeyDown?: any;
  id?: any;
}

export const Button: React.SFC<ButtonProps> = (props) => {
  const btnClasses = classNames({
    [props.className]: true,
    [styles.Button]: !props.disabled,
    [styles.ButtonDisabled]: props.disabled,
  });
  return (
    <ButtonElement
      id = {props.id}
      variant={props.variant}
      color={props.color}
      onClick={props.onClick}
      data-testid={props["data-testid"]}
      className={btnClasses}
      // className={`${styles.Button} ${props.className}`}
      disabled={props.disabled}
      to={props.to}
      type={props.type}
      onKeyDown={props.onKeyDown}
      {...props}
    >
      {props.children}
    </ButtonElement>
  );
};
