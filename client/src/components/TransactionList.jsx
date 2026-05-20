const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value || 0);

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));

const TransactionList = ({
  activeId,
  transactions,
  loading,
  error,
  onEdit,
  onDelete
}) => {
  return (
    <section className="panel list-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Records</p>
          <h2>Transaction history</h2>
        </div>
      </div>

      {loading ? <div className="state-card">Loading transactions...</div> : null}

      {!loading && error ? <div className="state-card error-card">{error}</div> : null}

      {!loading && !error && !transactions.length ? (
        <div className="state-card">
          No transactions match the current filters. Try clearing them or add a new entry.
        </div>
      ) : null}

      {!loading && !error && transactions.length ? (
        <div className="transaction-list">
          {transactions.map((transaction) => (
            <article
              key={transaction._id}
              className={`transaction-card ${
                activeId === transaction._id ? "is-editing" : ""
              }`}
            >
              <div className="transaction-main">
                <div className="transaction-topline">
                  <span className={`type-pill ${transaction.type}`}>
                    {transaction.type}
                  </span>
                  <span className="transaction-date">{formatDate(transaction.date)}</span>
                </div>

                <div className="transaction-title-row">
                  <h3>{transaction.title}</h3>
                  <strong className={transaction.type}>
                    {transaction.type === "expense" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </strong>
                </div>

                <p>{transaction.description || "No additional description added."}</p>

                <div className="transaction-footer">
                  <span>{transaction.category}</span>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => onEdit(transaction)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => onDelete(transaction._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default TransactionList;
