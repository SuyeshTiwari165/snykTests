import React from "react";
import { Redirect } from "react-router-dom";
import styles from "./Header.module.css";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Button } from "../../Form/Button/Button";
import Logout from "../../../../containers/Auth/Logout/Logout";
import Cookies from "js-cookie";

export const Header: React.FC = () => {
  // const user =  JSON.parse(localStorage.getItem("user") || "{}");
  const user = Cookies.getJSON("ob_user")
    ? Cookies.getJSON("ob_user") || ""
    : Logout();
  let userRole: any;
  let userdata: any;
  let username: any;

  try {
    userdata = JSON.parse(user);
    username =
      userdata.data.getUserDetails.edges[0].node.firstName +
      " " +
      userdata.data.getUserDetails.edges[0].node.lastName;
  } catch (e) {
    userdata = user;
    username = user.getUserDetails.edges[0].node.username;
  }
  return (
    <div className={styles.Header} data-testid="Header">
      <Card className={styles.root}>
        <Grid container>
          <Grid item xs={12} className={styles.RALogoImg}>
            <div>
              <img
                src={process.env.PUBLIC_URL + "/OB360.png"}
                alt="user icon"
              />
            </div>
          </Grid>
          <Grid item xs={12} className={styles.userInfo}>
            <>
              <span className={styles.userNameLabel}>
                {username}
                &nbsp;&nbsp;|&nbsp;&nbsp;
              </span>
              <span className={styles.userNameLabel}>
                <a className={styles.logout}>Help</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
              </span>
              <span className={styles.userNameLabel}>
                <a className={styles.logout} onClick={Logout}>
                  Logout
                </a>
              </span>
            </>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default Header;
