import React from "react";
import { render, screen } from "@testing-library/react";
import "../../../containers/AdminPanel/PiiData/node_modules/@testing-library/jest-dom/extend-expect";
import Table from "./MaterialTable";

describe("<Table />", () => {
  test("it should mount", () => {
    render(<Table />);

    const MaterialTable = screen.getByTestId("Table");

    expect(MaterialTable).toBeInTheDocument();
  });
});
