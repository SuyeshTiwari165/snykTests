import { colors } from "@material-ui/core";

const white = "#FFFFFF";
const black = "#000000";

export default {
  black,
  white,
  primary: {
    contrastText: white,
    // dark: "#f06601",
    main: "#F06601"
    // light: "#03b053"
  },
  secondary: {
    contrastText: '#F06601',
    dark: white,
    main: white,
    light: white
  },
  success: {
    contrastText: white,
    dark: colors.green[900],
    main: colors.green[600],
    light: colors.green[400]
  },
  info: {
    contrastText: white,
    dark: colors.blue[900],
    main: colors.blue[600],
    light: colors.blue[400]
  },
  warning: {
    contrastText: white,
    dark: colors.orange[900],
    main: colors.orange[600],
    light: colors.orange[400]
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  text: {
    primary: "#F06601",
    secondary: "#707070",
    link: colors.blue[600]
  },
  background: {
    default: "#F4F6F8",
    paper: white
  },
  icon: colors.blueGrey[600],
  divider: colors.grey[200]
};
