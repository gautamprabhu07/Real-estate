import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Card from "./Card";

vi.mock("../../lib/loaders", () => ({
  savePost: vi.fn().mockResolvedValue({}),
}));

const item = {
  id: "post1",
  title: "Modern Downtown Loft",
  price: 2400,
  address: "120 Congress Ave",
  city: "Austin",
  bedroom: 2,
  bathroom: 2,
  sqft: 900,
  type: "rent",
  images: ["https://example.com/photo.jpg"],
  createdAt: new Date().toISOString(),
};

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <Card item={item} {...props} />
    </MemoryRouter>
  );
}

describe("Card", () => {
  it("renders the listing title, price, and address", () => {
    renderCard();

    expect(screen.getByText("Modern Downtown Loft")).toBeInTheDocument();
    expect(screen.getByText("$2,400")).toBeInTheDocument();
    expect(screen.getByText("120 Congress Ave")).toBeInTheDocument();
  });

  it("shows a /month suffix for rentals", () => {
    renderCard();

    expect(screen.getByText("/month")).toBeInTheDocument();
  });

  it("toggles the saved state when the save button is clicked", () => {
    renderCard({ isSavedInitial: false });

    const saveButton = screen.getByLabelText("Save property");
    expect(saveButton).not.toHaveClass("active");

    fireEvent.click(saveButton);

    expect(saveButton).toHaveClass("active");
  });
});
