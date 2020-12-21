import * as React from "react";
import { Route } from "react-router-dom";
import TopStepper from "../components/UI/Layout/Navigation/TopStepper/TopStepper";
import { Redirect } from "react-router";
import * as routeConstants from "../common/RouteConstants";
import * as interfaces from "../common/Interfaces";
import Layout from "../components/UI/Layout/Layout";
/***
  * otherProps = {
  *       exact?: boolean;
          path: string;
          component: React.ComponentType<any>
  *       location : {
*                    state : {
*                            
*                             }
*                    }
  *        }
  */
const TopStepperRoute = ({
  component: Component,
  ...otherProps
}: interfaces.IProps) => {
  let location: any;
  let state: any;
  location = otherProps["location"];
  state = location["state"];

  return (
    <>
      {state ? (
        <Route
          render={(otherProps) => (
            <Layout>
              {/* <TopStepper /> */}
              <Component {...otherProps} />
            </Layout>
          )}
        />
      ) : (
        <Redirect to={routeConstants.CLIENT} />
      )}
    </>
  );
};
export default TopStepperRoute;
