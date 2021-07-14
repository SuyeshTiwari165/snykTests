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

import rarerunStepperList from "../../common/raRerunStepperList.json"
import { getActiveFormStep } from "../../../../services/Data";

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
  // var stepperObject = stepper;
  const nextValue = useQuery(RA_STEPPER);
  const [propsData, setPropsData] = useState<any>();
  const history = useHistory();
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState<any>(0);
  const [step, setStep] = useState<number>(0);

  const allSteps2: any = [
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
  const rerun: any = [
    {
      title: "Target",
      path: routeConstants.TARGET,
    },
    {
      title: "Windows Network",
      path: routeConstants.WINDOWS_NETWORK,
    },
    {
      title: "Linux Network",
      path: routeConstants.LINUX_NETWORK,
    },
    {
      title: "Task",
      path: routeConstants.TASK_DETAILS,
    },

  ];
  // let RerunStepperObject = rarerunStepperList;

  function getSteps() {
    let stepArray: any = [];
    try {
    if (nextValue.data && nextValue.data!=undefined && nextValue.data.propsData != undefined && nextValue.data.propsData.targetName != undefined && nextValue.data.propsData.targetName.includes('windows')) {
      stepArray = rerun
    }
    else {

      stepArray = allSteps2
    }
  }
  catch {
    stepArray = allSteps2
  }
    for (var i = 0; i < stepArray.length; i++) {
      if (stepArray[i].title === "Dashboard" || stepArray[i].title === "Logout") {
        stepArray.splice(i, 1);
      }
    }
    // if (CSetUserToken === undefined) {
    //   stepArray = topStepperMenu;
    // } else {
    //   if(param != undefined && param.hasOwnProperty("flowType") && param.flowType.type === "Standard") {
    //     stepArray = csetStandardTopStepperMenu;
    //   }else {
    //   stepArray = csetTopStepperMenu;
    //   }
    // }

    // for (var i = 0; i < stepArray.length; i++) {
    //   if (stepArray[i].title === "Dashboard" || stepArray[i].title === "Logout") {
    //     stepArray.splice(i, 1);
    //   }
    // }
    return stepArray;
  }

  useEffect(() => {
    if (nextValue.data) {
      if (nextValue.data.propsData.reRun && nextValue.data.propsData.targetName.includes('windows')) {
        if (activeStep !== nextValue.data.activeStep) {
          // if (nextValue.data.raStep  === stepperObject.Target.name) {
          //   setActiveStep(nextValue.data.activeStep);
          //   setStep(nextValue.data.activeStep);
          // } if (nextValue.data.raStep  === stepperObject.WindowsNetwork.name) {
          //   setActiveStep(nextValue.data.activeStep);
          //   setStep(nextValue.data.activeStep);
          // } if (nextValue.data.raStep  === stepperObject.LinuxNetwork.name) {
          //   setActiveStep(nextValue.data.activeStep);
          //   setStep(nextValue.data.activeStep);
          // } if (nextValue.data.raStep  === stepperObject.Task.name) {
          //   setActiveStep(nextValue.data.activeStep);
          //   setStep(nextValue.data.activeStep);
          // }
          for (let index in rerun) {
            if (nextValue.data.raStep === rerun[index].title) {
              setActiveStep(nextValue.data.activeStep);

              setStep(nextValue.data.activeStep);
              setPropsData(nextValue.data.propsData)
            }
          }
        }
      } else {
        if (activeStep !== nextValue.data.activeStep) {
          for (let index in allSteps) {
            if (nextValue.data.raStep === allSteps[index].title) {
              setActiveStep(nextValue.data.activeStep);
              setStep(nextValue.data.activeStep);
              setPropsData(nextValue.data.propsData)
            }
          }
          // if (nextValue.data.raStep  === RerunStepperObject.Target.name) {
          //   setActiveStep(nextValue.data.activeStep);
          //   setStep(nextValue.data.activeStep);
          // } if (nextValue.data.raStep  === RerunStepperObject.WindowsNetwork.name) {
          //   setActiveStep(nextValue.data.activeStep);
          //   setStep(nextValue.data.activeStep);
          // } if (nextValue.data.raStep  === RerunStepperObject.LinuxNetwork.name) {
          //   setActiveStep(nextValue.data.activeStep);
          //   setStep(nextValue.data.activeStep);
          // } if (nextValue.data.raStep  === RerunStepperObject.Task.name) {
          //   setActiveStep(nextValue.data.activeStep);
          //   setStep(nextValue.data.activeStep);
          // }
        }
      }
    }
  }, [nextValue.data]);
  const allSteps = getSteps();

  const handleTab = (e: any, i: number, label: any) => {
    setActiveStep(i);
    console.log("i---------", i)
    setStep(i);
    e.preventDefault();
    history.push(label.path, propsData);
  };
  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        className={styles.ReactStepper}
        // activeStep={parseInt(activeStep) > getActiveFormStep() ? activeStep : getActiveFormStep()}
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {/* {nextValue.data != undefined && nextValue.data.propsData.reRun && nextValue.data.propsData.targetName.includes('windows') ?
          <> */}
        {/* {rerun.map((label: any, i: number) => (
              <Step className={styles.ReactStep}>
                <Button
                  color={Number(step) === i ? "primary" : "secondary"}
                  variant="contained"
                  onClick={(e: any) => handleTab(e, i, label)}
                >
                  {label.title}
                </Button>
              </Step>
            ))} */}
        {/* </>
          : <> */}
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
        {/* </>} */}

      </Stepper>
    </div>
  );
}
