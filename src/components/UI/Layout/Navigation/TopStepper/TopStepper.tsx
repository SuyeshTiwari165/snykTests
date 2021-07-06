import React, { useState, useContext, useEffect } from "react";
import styles from "./TopStepper.module.css";
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import {
  sideDrawerMenus,
  sideDrawerAdminMenus,
} from "../../../../../config/menu";
import { topStepperMenu } from "../../../../../config/menu";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepConnector from "@material-ui/core/StepConnector";
import { Button } from "../../../Form/Button/Button";
import StepLabel from "@material-ui/core/StepLabel";
import { StepButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
// import {
//   useQuery,
//   useMutation,
//   ApolloError,
//   useLazyQuery,
// } from "../../../../../config/node_modules/@apollo/client";
// import { CLIENT_COMPLIANCESTEPPER } from "../../../../../graphql/mutations/ComplienceStepper";
import stepper from "../../../../../common/stepperMenu.json";

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage: "#121412",
    },
  },
  completed: {
    "& $line": {
      backgroundImage: "#121212",
    },
  },
  line: {
    height: 0,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

function getSteps() {
  let stepArray: any = [];
  stepArray = topStepperMenu;
  for (var i = 0; i < stepArray.length; i++) {
    if (stepArray[i].title === "Dashboard" || stepArray[i].title === "Logout") {
      stepArray.splice(i, 1);
    }
  }
  return stepArray;
}

export default function TopStepper(props: any) {
  var stepperObject = stepper;
  // const nextValue = useQuery(CLIENT_COMPLIANCESTEPPER);
  let nextValue: any;
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [step, setStep] = useState<number>(0);
  const allSteps = getSteps();
  if (nextValue.data) {
    if (activeStep !== nextValue.data.activeStep) {
      if (nextValue.data.complianceStep === stepperObject.companyProfile.name) {
        setActiveStep(nextValue.data.activeStep);
        setStep(nextValue.data.activeStep);
      } else if (
        nextValue.data.complianceStep === stepperObject.mainOffice.name
      ) {
        setActiveStep(nextValue.data.activeStep);
        setStep(nextValue.data.activeStep);
      } else if (
        nextValue.data.complianceStep === stepperObject.otherOffice.name
      ) {
        setActiveStep(nextValue.data.activeStep);
        setStep(nextValue.data.activeStep);
      } else if (
        nextValue.data.complianceStep === stepperObject.customer.name
      ) {
        setActiveStep(nextValue.data.activeStep);
        setStep(nextValue.data.activeStep);
      } else if (nextValue.data.complianceStep === stepperObject.review.name) {
        setActiveStep(nextValue.data.activeStep);
        setStep(nextValue.data.activeStep);
      } else if (
        nextValue.data.complianceStep === stepperObject.workplan.name
      ) {
        setActiveStep(nextValue.data.activeStep);
        setStep(nextValue.data.activeStep);
      }
    }
  }

  return (
    // <ApolloProvider client={client}>
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        className={styles.ReactStepper}
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {allSteps.map((label: any, i: number) => (
          <Step className={styles.ReactStep}>
            <Button
              color={Number(step) === i ? "primary" : "secondary"}
              variant="contained"
            //onClick={(e: any) => handleTab(e, i, label)}
            >
              {label.title}
            </Button>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
