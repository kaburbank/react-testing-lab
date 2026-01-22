import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountContainer from "../../components/AccountContainer";
import React from "react";
import { vi } from "vitest";

const mockTransactions = [
  {
    id: 1,
    date: "2026-01-01",
    description: "Latte",
    category: "Food",
    amount: "3.50",
  },
  {
    id: 2,
    date: "2026-01-02",
    description: "Groceries",
    category: "Food",
    amount: "42.00",
  },
  {
    id: 3,
    date: "2026-01-03",
    description: "Books",
    category: "Education",
    amount: "15.00",
  },
];

describe("Search and Sort Transactions", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockTransactions),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("filters transactions on search input", async () => {
    render(<AccountContainer />);

    await waitFor(() => {
      expect(screen.getByText("Latte")).toBeInTheDocument();
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search your Recent Transactions"),
      { target: { value: "book" } }
    );

    await waitFor(() => {
      expect(screen.getByText("Books")).toBeInTheDocument();
      expect(screen.queryByText("Latte")).not.toBeInTheDocument();
      expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
    });
  });

  it("responds to sort dropdown change", async () => {
    render(<AccountContainer />);
    const dropdown = screen.getByRole("combobox");

    fireEvent.change(dropdown, { target: { value: "category" } });

    await waitFor(() => {
      expect(dropdown.value).toBe("category");
    });
  });

  it("sorts transactions by category when dropdown is changed", async () => {
    render(<AccountContainer />);

    const dropdown = screen.getByRole("combobox");

    fireEvent.change(dropdown, { target: { value: "category" } });

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      const firstDataRow = rows[1].textContent;
      const secondDataRow = rows[2].textContent;

      expect(firstDataRow).toContain("Books"); 
      expect(secondDataRow).toContain("Latte"); 
    });
  });
});