import React, { useState, useContext, useEffect } from "react";
import styles from "./RaStepper.module.css";
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepConnector from "@material-ui/core/StepConnector";
import { Button } from "../../../../components/UI/Form/Button/Button";
import StepLabel from "@material-ui/core/StepLabel";
import { StepButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import {
  useQuery,
  useMutation,
  ApolloError,
  useLazyQuery,
} from "@apollo/client";
import { RA_STEPPER } from "../../../../graphql/mutations/RaStepper";
import stepper from "../../common/raStepperList.json";
import * as routeConstants from "../../../../common/RouteConstants";

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

export default function RaStepper(props: any) {
  var stepperObject = stepper;
  const nextValue = useQuery(RA_STEPPER);
  const [propsData, setPropsData] = useState<any>();
  const history = useHistory();
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [step, setStep] = useState<number>(0);
  const allSteps: any = [
    {
      title: "Target",
      path: routeConstants.TARGET,
    },
    {
      title: "Linux Network",
      path: routeConstants.LINUX_NETWORK,
    },
    {
      title: "Windows Network",
      path: routeConstants.WINDOWS_NETWORK,
    },
    {
      title: "Task",
      path: routeConstants.TASK_DETAILS,
    },

  ];
  if (nextValue.data) {
    if (activeStep !== nextValue.data.activeStep) {
      for (let index in allSteps) {
        if (nextValue.data.raStep === allSteps[index].title) {
          setActiveStep(nextValue.data.activeStep);
          console.log("nextValue.data.raStep",nextValue.data.raStep)
          console.log("setActiveStep---------",nextValue.data.activeStep)
          setStep(nextValue.data.activeStep);
          setPropsData(nextValue.data.propsData)
        }
      }
    }
  }
  const handleTab = (e: any, i: number, label: any) => {
    setActiveStep(i);
    console.log("i---------",i)
    setStep(i);
    e.preventDefault();
    history.push(label.path,propsData);
  };
  console.log("activeStep---------",activeStep)
  return (
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
              onClick={(e: any) => handleTab(e, i, label)}
            >
              {label.title}
            </Button>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
