import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders title", () => {
  render(<App />);
  const titleElement = screen.getByText(/SpaceX Capsules/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders filters", () => {
  render(<App />);
  const statusFilterElement = screen.getByLabelText(/status/i);
  expect(statusFilterElement).toBeInTheDocument();
  const launchFilterElement = screen.getByLabelText(/original launch/i);
  expect(launchFilterElement).toBeInTheDocument();
  const typeFilterElement = screen.getByLabelText(/type/i);
  expect(typeFilterElement).toBeInTheDocument();
  const pageSizeElement = screen.getByLabelText(/page size/i);
  expect(pageSizeElement).toBeInTheDocument();
});

test("renders capsule data", async () => {
  const fakeCapsules = [
    {
      capsule_serial: "C101",
      status: "active",
      type: "Dragon 1.1",
      original_launch: "2010-12-08",
      details: "First Falcon 9 launch, Dragon qualification unit",
    },
    {
      capsule_serial: "C102",
      status: "retired",
      type: "Dragon 1.1",
      original_launch: "2012-05-22",
      details: "First Dragon spacecraft",
    },
  ];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeCapsules),
    })
  );
  render(<App />);
  const capsule1 = await screen.findByText("C101");
  expect(capsule1).toBeInTheDocument();
  const capsule2 = await screen.findByText("C102");
  expect(capsule2).toBeInTheDocument();
});

test("applies filters correctly", async () => {
  const fakeCapsules = [
    {
      capsule_serial: "C101",
      status: "active",
      type: "Dragon 1.1",
      original_launch: "2010-12-08",
      details: "First Falcon 9 launch, Dragon qualification unit",
    },
    {
      capsule_serial: "C102",
      status: "retired",
      type: "Dragon 1.1",
      original_launch: "2012-05-22",
      details: "First Dragon spacecraft",
    },
    {
      capsule_serial: "C103",
      status: "destroyed",
      type: "Dragon 1.1",
      original_launch: "2013-03-01",
      details: "Unmanned cargo spacecraft, destroyed in flight",
    },
  ];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeCapsules),
    })
  );
  render(<App />);
  const statusFilterElement = screen.getByLabelText(/status/i);
  fireEvent.change(statusFilterElement, { target: { value: "active" } });
  const capsule1 = await screen.findByText("C101");
  expect(capsule1).toBeInTheDocument();
  const capsule2 = screen.queryByText("C102");
  expect(capsule2).not.toBeInTheDocument();
  const capsule3 = screen.queryByText("C103");
  expect(capsule3).not.toBeInTheDocument();
  const launchFilterElement = screen.getByLabelText(/original launch/i);
  fireEvent.change(launchFilterElement, { target: { value: "2012" } });
  const capsule4 = await screen.findByText("C102");
  expect(capsule4).toBeInTheDocument();
});