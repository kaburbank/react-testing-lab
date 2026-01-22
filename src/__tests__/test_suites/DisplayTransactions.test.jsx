import { render, screen, waitFor } from "@testing-library/react";
import AccountContainer from "../../components/AccountContainer";
import React from "react";
import { beforeEach } from "vitest";
import { vi } from "vitest";

const mockTransactions = [
  {
    id: 1,
    date: "2023-01-01",
    description: "Coffee",
    category: "Food",
    amount: "3.50",
  },
  {
    id: 2,
    date: "2023-01-02",
    description: "Groceries",
    category: "Food",
    amount: "42.00",
  },
];

describe("Display Transactions", () => {
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

  it("displays transactions on startup", async () => {
    render(<AccountContainer />);

    await waitFor(() => {
      expect(screen.getByText("Coffee")).toBeInTheDocument();
      expect(screen.getByText("Groceries")).toBeInTheDocument();
      expect(screen.getAllByText("Food")).toHaveLength(2);
      expect(screen.getByText("3.50")).toBeInTheDocument();
      expect(screen.getByText("42.00")).toBeInTheDocument();
    });
  });

  it("renders correct number of transaction rows", async () => {
    render(<AccountContainer />);
    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(3);
    });
  });
});