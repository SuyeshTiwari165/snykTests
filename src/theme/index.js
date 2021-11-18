import { createMuiTheme } from "@material-ui/core";

import palette from "./palette";
import typography from "./typography";
import overrides from "./overrides";

const theme = createMuiTheme({
  palette,
  typography,
  // overrides,
  zIndex: {
    appBar: 1200,
    drawer: 1100
  },
  overrides: {
    // MuiTooltip: {
    //   tooltip: {
    //     backgroundColor:"rgb(240, 102, 1, 0.8)",
    //     borderRadius : "12px",
    //     position: "relative",
    //   },
    //   tooltipPlacementRight: {
    //     "&:before" : {
    //       content: "' '",
    //       width: "0px",
    //       height: "0px",
    //       borderTop: "6px solid transparent",
    //       borderBottom: "6px solid transparent",
    //       borderRight:"6px solid rgba(240, 102, 1, 0.8)",
    //       zIndex: "9999",
    //     position:"absolute",
    //     left:"-6px",
    //     top:"45%",
    //     }
    //   }
    // }
    MuiTooltip: {
      tooltip: {
        backgroundColor:"rgb(240, 102, 1, 0.8)",
        borderRadius : "12px",
        position: "relative",
        "&:before" : {
        content: "' '",
        width: "0px",
        height: "0px",
        zIndex: 9999,
        position:"absolute",
        }
      },
      tooltipPlacementRight: {
        "&:before" : {
        borderTop: "6px solid transparent",
        borderBottom: "6px solid transparent",
        borderRight:"6px solid rgba(240, 102, 1, 0.8)",
        left:"-6px",
        top:"45%",
        }
      },
      tooltipPlacementLeft: {
        "&:before" : { 
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          borderLeft: "6px solid rgba(240, 102, 1, 0.8)", 
          right:"-6px",
          top:"45%",
        }
      },
      tooltipPlacementBottom: {
        "&:before" : { 
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: "6px solid rgba(240, 102, 1, 0.8)",
          left :"45%",
          top:"-6px",
        }
      },
      tooltipPlacementTop: {
        "&:before" : { 
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid rgba(240, 102, 1, 0.8)",
          left :"45%",
          bottom:"-6px",
        }
      }
    }
  }
});

export default theme;
