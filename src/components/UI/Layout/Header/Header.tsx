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
import { useHistory } from "react-router-dom";
import * as routeConstant from "../../../../common/RouteConstants";

export const Header: React.FC = () => {
  const history = useHistory();

  // const user =  JSON.parse(localStorage.getItem("user") || "{}");
  const user = Cookies.getJSON("ob_user")
    ? Cookies.getJSON("ob_user") || ""
    : Logout();
    const ob_partnerData = Cookies.getJSON("ob_partnerData")
    ? Cookies.getJSON("ob_partnerData") || ""
    : null;
  let userRole: any;
  let userdata: any;
  let username: any;

  const getHelpManual = () => {
    let ra_manual = process.env.PUBLIC_URL + "/user_manual/OB360_Manual.pdf"
    window.open(ra_manual, '_blank');
  }
  const getSettings = () => {
    history.push(routeConstant.SETTINGS)
    // let ra_manual = process.env.PUBLIC_URL + "/user_manual/OB360_Manual.pdf"
    // window.open(ra_manual, '_blank');
  }
  const getHome = () => {
    if(user.getUserDetails){
      history.push(routeConstant.ADMIN_DASHBOARD);
    } else {
      history.push(routeConstant.CLIENT);
      localStorage.clear();
    }
  }

  try {
    userdata = JSON.parse(user);
    username =
      userdata.data.getUserDetails.edges[0].node.firstName +
      " " +
      userdata.data.getUserDetails.edges[0].node.lastName;
  } catch (e) {
    userdata = user;
    if(user !== undefined) {
    username = user.getUserDetails.edges[0].node.username;
    }
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
                onClick={getHome}
              />
            </div>
          </Grid>
          <Grid item xs={12} className={styles.userInfo}>
            <>
              <span className={styles.userNameLabel}>
                {username}
                &nbsp;&nbsp;|&nbsp;&nbsp;
              </span>
              { ob_partnerData ? 
              <span className={styles.userNameLabel}>
                <a className={styles.logout}  onClick={getSettings} >Settings</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
              </span>
              : null }
              <span className={styles.userNameLabel}>
                <a className={styles.logout}  onClick={getHelpManual} >Help</a>
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
