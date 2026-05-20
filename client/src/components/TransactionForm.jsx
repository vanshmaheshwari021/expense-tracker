const categories = [
  "Salary",
  "Freelance",
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Education",
  "Investment",
  "General"
];

const TransactionForm = ({
  editingTitle,
  formData,
  formError,
  isEditing,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel
}) => {
  return (
    <section className="panel sticky-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{isEditing ? "Update Entry" : "New Entry"}</p>
          <h2>{isEditing ? "Edit transaction" : "Add transaction"}</h2>
        </div>
      </div>

      {isEditing ? (
        <div className="message edit-message">
          Editing <strong>{editingTitle}</strong>. Update the fields below and save
          your changes.
        </div>
      ) : null}

      <form className="transaction-form" onSubmit={onSubmit}>
        <label>
          <span>Title</span>
          <input
            autoFocus={isEditing}
            type="text"
            value={formData.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="Salary credited"
          />
        </label>

        <label>
          <span>Description</span>
          <textarea
            rows="4"
            value={formData.description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Add a quick note for context"
          />
        </label>

        <div className="form-split">
          <label>
            <span>Amount</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={(event) => onChange("amount", event.target.value)}
              placeholder="0.00"
            />
          </label>

          <label>
            <span>Type</span>
            <select
              value={formData.type}
              onChange={(event) => onChange("type", event.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
        </div>

        <div className="form-split">
          <label>
            <span>Date</span>
            <input
              type="date"
              value={formData.date}
              onChange={(event) => onChange("date", event.target.value)}
            />
          </label>

          <label>
            <span>Category</span>
            <input
              list="category-options"
              value={formData.category}
              onChange={(event) => onChange("category", event.target.value)}
              placeholder="General"
            />
            <datalist id="category-options">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>
        </div>

        {formError ? <p className="message error-message">{formError}</p> : null}

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
                ? "Save changes"
                : "Add transaction"}
          </button>

          {isEditing ? (
            <button
              type="button"
              className="ghost-button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
};

export default TransactionForm;
