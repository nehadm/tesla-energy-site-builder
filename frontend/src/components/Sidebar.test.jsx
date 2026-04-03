import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Sidebar from './Sidebar';

// Mock constants
jest.mock("../constants", () => ({
  DEVICES: {
    MEGAPACK_XL: { name: "Megapack XL", cost: 120000 },
    MEGAPACK_2: { name: "Megapack 2", cost: 80000 },
    MEGAPACK: { name: "Megapack", cost: 50000 },
    POWERPACK: { name: "PowerPack", cost: 10000 },
  },
}));

// Mock TeslaTextField so tests focus on Sidebar behavior, not MUI internals
jest.mock("./TeslaTextField", () => {
  return function MockTeslaTextField({
    label,
    value,
    onChange,
    helperText,
    type = "text",
  }) {
    return (
      <div>
        <label>
          {label}
          <input
            aria-label={label}
            type={type}
            value={value}
            onChange={onChange}
          />
        </label>
        {helperText ? <span>{helperText}</span> : null}
      </div>
    );
  };
});

describe("Sidebar", () => {
  const baseProps = {
    quantities: {
      MEGAPACK_XL: 1,
      MEGAPACK_2: 2,
      MEGAPACK: 3,
      POWERPACK: 4,
    },
    onChange: jest.fn(),
    onSave: jest.fn(),
    onReset: jest.fn(),
    isSaving: false,
    status: "Saved",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the section title", () => {
    render(<Sidebar {...baseProps} />);
    expect(screen.getByText("Configure Site")).toBeInTheDocument();
  });

  it("renders one field for each quantity key", () => {
    render(<Sidebar {...baseProps} />);

    expect(screen.getByLabelText("Megapack XL")).toBeInTheDocument();
    expect(screen.getByLabelText("Megapack 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Megapack")).toBeInTheDocument();
    expect(screen.getByLabelText("PowerPack")).toBeInTheDocument();
  });

  it("renders helper text with formatted device cost", () => {
    render(<Sidebar {...baseProps} />);

    expect(screen.getByText("$120,000")).toBeInTheDocument();
    expect(screen.getByText("$80,000")).toBeInTheDocument();
    expect(screen.getByText("$50,000")).toBeInTheDocument();
    expect(screen.getByText("$10,000")).toBeInTheDocument();
  });

  it("calls onChange with parsed numeric value when input changes", () => {
    render(<Sidebar {...baseProps} />);

    fireEvent.change(screen.getByLabelText("Megapack XL"), {
      target: { value: "7" },
    });

    expect(baseProps.onChange).toHaveBeenCalledWith("MEGAPACK_XL", 7);
  });

  it("clamps negative values to 0", () => {
    render(<Sidebar {...baseProps} />);

    fireEvent.change(screen.getByLabelText("Megapack 2"), {
      target: { value: "-5" },
    });

    expect(baseProps.onChange).toHaveBeenCalledWith("MEGAPACK_2", 0);
  });

  it("converts empty input to 0", () => {
    render(<Sidebar {...baseProps} />);

    fireEvent.change(screen.getByLabelText("Megapack"), {
      target: { value: "" },
    });

    expect(baseProps.onChange).toHaveBeenCalledWith("MEGAPACK", 0);
  });

  it("calls onSave when Save Session is clicked", () => {
    render(<Sidebar {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: /save session/i }));

    expect(baseProps.onSave).toHaveBeenCalledTimes(1);
  });

  it("calls onReset when Reset is clicked", () => {
    render(<Sidebar {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    expect(baseProps.onReset).toHaveBeenCalledTimes(1);
  });

  it("disables save button when isSaving is true", () => {
    render(<Sidebar {...baseProps} isSaving={true} />);

    const saveButton = screen.getByRole("button");
    expect(saveButton).toBeDisabled();
  });

  it("shows default status when status is not provided", () => {
    render(<Sidebar {...baseProps} status={undefined} />);

    expect(screen.getByText("Status: Ready")).toBeInTheDocument();
  });

  it("shows provided status text", () => {
    render(<Sidebar {...baseProps} status="Synced" />);

    expect(screen.getByText("Status: Synced")).toBeInTheDocument();
  });

  it("does not throw if onSave is missing", () => {
    render(<Sidebar {...baseProps} onSave={undefined} />);

    fireEvent.click(screen.getByRole("button", { name: /save session/i }));
  });

  it("does not throw if onReset is missing", () => {
    render(<Sidebar {...baseProps} onReset={undefined} />);

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
  });
});