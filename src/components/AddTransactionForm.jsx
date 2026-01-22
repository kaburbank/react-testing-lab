import React from "react";

function AddTransactionForm({ postTransaction }) {
  function submitForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTransaction = {
      date: formData.get("date"),
      description: formData.get("description"),
      category: formData.get("category"),
      amount: formData.get("amount"),
    };
    postTransaction(newTransaction);
  }

  return (
    <div className="ui segment">
      <form className="ui form" onSubmit={(e) => submitForm(e)}>
        <div className="inline fields">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" name="date" />

          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            name="description"
            placeholder="Description"
          />

          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            name="category"
            placeholder="Category"
          />

          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            name="amount"
            placeholder="Amount"
            step="0.01"
          />
        </div>
        <button className="ui button" type="submit">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;