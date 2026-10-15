import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Filter from "./Filter";

function renderFilter() {
  return render(
    <MemoryRouter>
      <Filter />
    </MemoryRouter>
  );
}

describe("Filter", () => {
  it("renders the location input with no clear button initially", () => {
    renderFilter();

    expect(screen.getByPlaceholderText(/enter city, neighborhood/i)).toBeInTheDocument();
    expect(screen.queryByLabelText("Clear location")).not.toBeInTheDocument();
  });

  it("updates the location input as the user types and shows a clear button", () => {
    renderFilter();

    const cityInput = screen.getByPlaceholderText(/enter city, neighborhood/i);
    fireEvent.change(cityInput, { target: { value: "Austin" } });

    expect(cityInput).toHaveValue("Austin");
    expect(screen.getByLabelText("Clear location")).toBeInTheDocument();
  });

  it("clears the location input when the clear button is clicked", () => {
    renderFilter();

    const cityInput = screen.getByPlaceholderText(/enter city, neighborhood/i);
    fireEvent.change(cityInput, { target: { value: "Austin" } });
    fireEvent.click(screen.getByLabelText("Clear location"));

    expect(cityInput).toHaveValue("");
  });
});
