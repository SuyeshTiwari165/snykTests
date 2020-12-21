import React from 'react';
import styles from './Checkbox.module.css';
import { Checkbox as CheckboxElement } from '@material-ui/core';

export interface CheckboxProps {
  type?: any;
  field?: any;
  checked?: boolean;
  onChange?: any;
  name: string;
  value: string;
  label?: string;
  form?: any;
}

export const Checkbox: React.SFC<CheckboxProps> = (props) => {
  return (
    <div className={styles.Checkbox}>
      <label className={styles.Label}>{props.label}</label>
      <CheckboxElement
        checked={props.checked}
        onChange={props.onChange}
        name={props.name}
        value={props.value}
        className={styles.ReactCheckboxElement}
      />
    </div>
  );
};
