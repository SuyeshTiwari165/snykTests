import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
  Collapse,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import clsx from "clsx";
import { CompanyUser } from "../../../../../common/Roles";
import * as routeConstants from '../../../../../common/RouteConstants';
import {
  sideDrawerMenus,
  sideDrawerAdminMenus,
} from "../../../../../config/menu";
import ListIcon from "../../../ListIcon/ListIcon";
import styles from "./SideMenus.module.css";

export interface SideMenusProps {
  opened: boolean;
}

const SideMenus: React.SFC<SideMenusProps> = (props) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [open, setOpen] = useState<any>(false);
  const [openSub, setOpenSub] = useState<any>(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  let userRole: any;
  if (user.user) {
    userRole = user.user.role.name || undefined;
  }

  const menuList = sideDrawerMenus.map((menu, i) => {
    let currUrl = window.location.pathname;
    let pathName = currUrl.split("/")[1];
    let isSelected = menu.pathList.includes("/".concat(pathName));
    return (
      <ListItem
        button
        disableRipple={true}
        selected={isSelected}
        className={clsx({
          [styles.OpenItem]: props.opened,
          [styles.ClosedItem]: !props.opened,
        })}
        classes={{
          root: styles.IconItem,
          selected: styles.SelectedItem,
        }}
        key={menu.icon}
        component={NavLink}
        to={menu.path}
      >
        <div className={styles.ListItemIcon}>
          <img
            src={
              process.env.PUBLIC_URL + "/icons/svg-icon/" + menu.icon + ".svg"
            }
            alt="user icon"
          />
        </div>
        {props.opened ? (
          <ListItemText
            disableTypography
            className={clsx(styles.Text, {
              [styles.SelectedText]: isSelected,
              [styles.UnselectedText]: !isSelected,
            })}
            primary={menu.title}
          />
        ) : null}
      </ListItem>
    );
  });

  const AdminmenuList = sideDrawerAdminMenus.map((menu, i) => {
    let currUrl = window.location.pathname;
    let pathName = currUrl.split("/")[1];
    let isSelected = menu.pathList.includes("/".concat(pathName));
    return (
      <List disablePadding>
           <ListItem
            button
            disableRipple={true}
            selected={isSelected}
            className={clsx({
              [styles.OpenItem]: props.opened,
              [styles.ClosedItem]: !props.opened,
            })}
            classes={{
              root: styles.IconItem,
              selected: styles.SelectedItem,
            }}
            key={menu.icon}
            component={NavLink}
            to={menu.path}
            onClick={() => {
              setOpen(false);
              setOpenSub(false);
              setSelectedItem(menu.path);
            }}
          >
            <div className={styles.ListItemIcon}>
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/icons/svg-icon/" +
                  menu.icon +
                  ".svg"
                }
                alt="user icon"
              />
            </div>
            {props.opened ? (
              <ListItemText
                disableTypography
                className={clsx(styles.Text, {
                  [styles.SelectedText]: isSelected,
                  [styles.UnselectedText]: !isSelected,
                })}
                primary={menu.title}
              />
            ) : null}
          </ListItem>
      </List>
    );
  });

  return (
    <List className={styles.List}>
      {userRole === CompanyUser ? menuList : AdminmenuList}
    </List>
  );
};

export default SideMenus;
