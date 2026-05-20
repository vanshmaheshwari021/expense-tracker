import { useDeferredValue, useEffect, useRef, useState, useTransition } from "react";
import Dashboard from "./components/Dashboard";
import FilterBar from "./components/FilterBar";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import {
  createTransaction,
  deleteTransaction,
  fetchStats,
  fetchTransactions,
  updateTransaction
} from "./services/api";

const getToday = () => new Date().toISOString().split("T")[0];

const emptyForm = {
  title: "",
  description: "",
  amount: "",
  type: "expense",
  date: getToday(),
  category: "General"
};

const initialFilters = {
  search: "",
  type: "",
  category: "",
  startDate: "",
  endDate: ""
};

function App() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalTransactions: 0
  });
  const [filters, setFilters] = useState(initialFilters);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(filters.search);
  const formSectionRef = useRef(null);

  useEffect(() => {
    const activeFilters = {
      ...filters,
      search: deferredSearch
    };

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const [transactionsData, statsData] = await Promise.all([
          fetchTransactions(activeFilters),
          fetchStats(activeFilters)
        ]);

        startTransition(() => {
          setTransactions(transactionsData);
          setStats(statsData);
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load data. Please check the API connection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    deferredSearch,
    filters.category,
    filters.endDate,
    filters.startDate,
    filters.type,
    startTransition
  ]);

  const validateForm = () => {
    const title = formData.title.trim();
    const amount = Number(formData.amount);

    if (!title) {
      return "Title is required.";
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return "Amount must be greater than zero.";
    }

    if (!formData.date) {
      return "Date is required.";
    }

    if (!formData.type) {
      return "Type is required.";
    }

    return "";
  };

  const reloadData = async () => {
    const activeFilters = {
      ...filters,
      search: deferredSearch
    };
    const [transactionsData, statsData] = await Promise.all([
      fetchTransactions(activeFilters),
      fetchStats(activeFilters)
    ]);
    setTransactions(transactionsData);
    setStats(statsData);
  };

  const handleFormChange = (field, value) => {
    setFormError("");
    setServerMessage("");
    setFormData((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleFilterChange = (field, value) => {
    setServerMessage("");
    startTransition(() => {
      setFilters((current) => ({
        ...current,
        [field]: value
      }));
    });
  };

  const resetForm = () => {
    setEditingId("");
    setEditingTitle("");
    setFormData(emptyForm);
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    setServerMessage("");

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim() || "General"
    };

    try {
      if (editingId) {
        await updateTransaction(editingId, payload);
        setServerMessage("Transaction updated successfully.");
      } else {
        await createTransaction(payload);
        setServerMessage("Transaction added successfully.");
      }

      resetForm();
      await reloadData();
    } catch (requestError) {
      setFormError(
        requestError.response?.data?.message ||
          "Unable to save the transaction right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setEditingTitle(transaction.title);
    setFormError("");
    setServerMessage("");
    setFormData({
      title: transaction.title,
      description: transaction.description || "",
      amount: transaction.amount,
      type: transaction.type,
      date: new Date(transaction.date).toISOString().split("T")[0],
      category: transaction.category
    });
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this transaction permanently?");

    if (!confirmed) {
      return;
    }

    setServerMessage("");

    try {
      await deleteTransaction(id);

      if (editingId === id) {
        resetForm();
      }

      setServerMessage("Transaction deleted successfully.");
      await reloadData();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to delete the transaction right now."
      );
    }
  };

  const clearFilters = () => {
    startTransition(() => {
      setFilters(initialFilters);
    });
  };

  return (
    <div className="app-shell">
      <div className="background-orb orb-left" />
      <div className="background-orb orb-right" />

      <main className="app-container">
        <section className="hero">
          <div>
            <p className="eyebrow">Personal Finance Snapshot</p>
          </div>
        </section>

        <Dashboard stats={stats} />

        {serverMessage ? <p className="message success-message">{serverMessage}</p> : null}

        <section className="workspace-grid">
          <div ref={formSectionRef}>
            <TransactionForm
              editingTitle={editingTitle}
              formData={formData}
              formError={formError}
              isEditing={Boolean(editingId)}
              isSubmitting={isSubmitting}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          </div>

          <div className="content-stack">
            <FilterBar
              filters={filters}
              onChange={handleFilterChange}
              onClear={clearFilters}
              isPending={isPending}
            />

            <TransactionList
              activeId={editingId}
              transactions={transactions}
              loading={loading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </section>

        <footer className="app-footer">
          <div className="footer-rotator">
            <p>
              Track income and expenses without losing the big picture. Add
              transactions, monitor cash flow, and filter records by type,
              keyword, category, or date range from one responsive dashboard.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
