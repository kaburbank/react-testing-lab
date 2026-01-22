import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountContainer from "../../components/AccountContainer";
import React from "react";
import { vi } from "vitest";

const mockTransactions = [];

describe("Add Transactions", () => {
  beforeEach(() => {
    global.fetch = vi.fn((url, options) => {
      if (options?.method === "POST") {
        return Promise.resolve({
          json: () => Promise.resolve({ id: 99, ...JSON.parse(options.body) }),
        });
      } else {
        return Promise.resolve({
          json: () => Promise.resolve(mockTransactions),
        });
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adds new transaction to the frontend after form submit", async () => {
    render(<AccountContainer />);

    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Test Desc" },
    });
    fireEvent.change(screen.getByPlaceholderText("Category"), {
      target: { value: "Test Cat" },
    });
    fireEvent.change(screen.getByPlaceholderText("Amount"), {
      target: { value: "10.00" },
    });
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2023-01-01" },
    });

    fireEvent.click(screen.getByText("Add Transaction"));

    await waitFor(() => {
      expect(screen.getByText("Test Desc")).toBeInTheDocument();
      expect(screen.getByText("10.00")).toBeInTheDocument();
    });
  });

  it("calls fetch with POST method", async () => {
    render(<AccountContainer />);

    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Check POST" },
    });
    fireEvent.change(screen.getByPlaceholderText("Category"), {
      target: { value: "Test POST" },
    });
    fireEvent.change(screen.getByPlaceholderText("Amount"), {
      target: { value: "15.00" },
    });
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2023-02-02" },
    });

    fireEvent.click(screen.getByText("Add Transaction"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:6001/transactions",
        expect.objectContaining({
          method: "POST",
        })
      );
    });
  });
});