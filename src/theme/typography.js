import palette from "./palette";

export default {
  fontFamily: ["Roboto", "sans-serif"].join(","),
  h1: {
    color: palette.text.primary,
    fontWeight: 400,
    fontSize: "24px !important",
    paddingBottom : "10.5px",
    margin: "0px 0 23px",
  },

  h2: {
    color: palette.text.primary,
    fontWeight: 400,
    fontSize: "20px"
  },
  h3: {
    color: palette.text.primary,
    fontWeight: 400,
    fontSize: "16px"
  },
  h4: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: "14px"
  },
  h5: {
    color: palette.text.primary,
    fontWeight: 400,
    fontSize: "12px"
  },
  h6: {
    color: palette.text.primary,
    fontWeight: 400,
    fontSize: "10px"
  },
  button: {
    color: palette.text.secondary,
    FontSize: "50px",
    fontWeight: 400,
    bgcolor: "#f06601",
    paddingTop: "3px",
    paddingBottom: "3px",
    paddingRight: "14px",
    paddingLeft: "14px",
    borderWidth: "1px"
  }
};
