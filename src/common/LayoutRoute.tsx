import * as React from "react";
import { Route } from "react-router-dom";
import * as interfaces from "./Interfaces";
import Layout from "../components/UI/Layout/Layout";

const LayoutRoute = ({
  component: Component,
  ...otherProps
}: interfaces.IProps) => {
  return (
    <>
      <Route
        render={(otherProps) => (
          <>
            <Layout>
              <Component {...otherProps} />
            </Layout>
          </>
        )}
      />
    </>
  );
};
export default LayoutRoute;
