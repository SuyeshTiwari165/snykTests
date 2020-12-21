import React, { useState, useContext } from "react";
import {
  Hidden,
  Drawer,
  makeStyles,
  createStyles,
  Fade,
  Paper,
  Button,
  Theme,
  Divider,
  Toolbar,
  Typography,
  Popper
} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
// import axios from 'axios';
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SideMenus from "../SideMenus/SideMenus";
// import * as constants from '../../../../../common/constants';
// import { SessionContext } from "../../../../../context/session";
import UserIcon from "../../../../../assets/images/icons/User.png";
import styles from "./SideDrawer.module.css";

export interface SideDrawerProps {}

// const drawerWidth = constants.SIDE_DRAWER_WIDTH;

const theme = createMuiTheme({
  typography: {
    h6: {
      fontSize: 26,
      fontFamily: "Tenor Sans, sans-serif",
      color: "#ffffff"
    }
  }
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      // width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
      backgroundColor: "#fff",
      boxShadow: "7px 0 7px -6px #e4e4e4 !important"
    },
    navClose: {
      width: "72px",
      backgroundColor: "#fff",
      boxShadow: "7px 0 7px -6px #e4e4e4 !important",
      marginTop: "-57px;"
    },
    drawerOpen: {
      width: "246px",
      position: "relative",
      marginTop: "-57px;",
      backgroundColor: "transparent",
      borderRight: "0px",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      height: "100%"
    },
    drawerClose: {
      position: "relative",
      borderRight: "0px",
      width: "72px !important",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: "hidden",
      // width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1
      }
    },
    toolbar: {
      display: "flex"
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    drawerPaper: {
      border: "0px !imortant"
    },
    outerBox: {
      display: "flex",
      width: "100%",
      justifyContent: "flex-end",
      padding: "8px 0px",
    },
    anotherToolBar: {
      padding: "0px",
      height: "auto",
      minHeight: "56px",
      "& > button" :{
        marginTop : "8px !important",
      }
    },
    title: {
      alignSelf: "center",
      margin: "0 0 0 15px",
      fontSize: "16px"
    },
    iconButton: {
      margin: "0 10px 0 0",
      color: "#fff"
    },
    closedIcon: {
      margin: "12px 12px 12px 15px"
    },
    LogoutButton: {
      position: "absolute",
      bottom: "10px",
      left: "8px",
      width: "fit-content"
    }
  })
);

export const SideDrawer: React.SFC<SideDrawerProps> = props => {
  // const { setAuthenticated } = useContext(SessionContext);
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [fullOpen, setFullOpen] = React.useState(true);

  const drawer = (
    <div>
      <Toolbar className={classes.anotherToolBar}>
        {fullOpen ? (
          <div className={classes.outerBox}>
            <ThemeProvider theme={theme}>
              <Typography component="h6" variant="h6" className={classes.title}>
                Ra in a Box
              </Typography>
            </ThemeProvider>
            <IconButton
              className={classes.iconButton}
              onClick={() => setFullOpen(false)}
              data-testid="drawer-button"
            >
              <MenuIcon />
            </IconButton>
          </div>
        ) : (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            style={{ margin: "auto" }}
            onClick={() => setFullOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
      {/* <Divider /> */}
      <SideMenus opened={fullOpen} />
    </div>
  );

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  const popper = (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="right-end"
      transition
      className={styles.Popper}
    >
      {/* {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper elevation={3}>
            <Button color="primary">My Account</Button>
            <br />
            <Button
              className={styles.LogoutButton}
              color="primary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Paper>
        </Fade>
      )} */}
    </Popper>
  );

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const container =
    window !== undefined ? () => window.document.body : undefined;
  const session = localStorage.getItem("session");
  const accessToken = session ? session : null;

  return (
    <nav
      className={clsx({
        [classes.drawer]: fullOpen,
        [classes.navClose]: !fullOpen
      })}
      aria-label="navigation menus"
    >
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={() => setMobileOpen(!mobileOpen)}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      {/* Rendered */}
      <Hidden xsDown implementation="css">
        <Drawer
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: fullOpen,
            [classes.drawerClose]: !fullOpen
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: fullOpen,
              [classes.drawerClose]: !fullOpen
            })
          }}
          variant="permanent"
          // open
        >
          {drawer}
          <IconButton className={classes.LogoutButton} onClick={handleClick}>
            {/* <img src={UserIcon} className={styles.UserIcon} alt="user icon" /> */}
          </IconButton>
          {popper}
        </Drawer>
      </Hidden>
    </nav>
  );
};

export default SideDrawer;
