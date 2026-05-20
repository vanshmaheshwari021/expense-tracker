const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value || 0);

const Dashboard = ({ stats }) => {
  const cards = [
    {
      label: "Current Balance",
      value: formatCurrency(stats.balance),
      tone: stats.balance >= 0 ? "positive" : "negative"
    },
    {
      label: "Total Income",
      value: formatCurrency(stats.totalIncome),
      tone: "positive"
    },
    {
      label: "Total Expense",
      value: formatCurrency(stats.totalExpense),
      tone: "negative"
    },
    {
      label: "Transactions",
      value: `${stats.totalTransactions || 0}`,
      tone: "neutral"
    }
  ];

  return (
    <section className="dashboard">
      {cards.map((card) => (
        <article key={card.label} className={`stat-card ${card.tone}`}>
          <p>{card.label}</p>
          <h3>{card.value}</h3>
        </article>
      ))}
    </section>
  );
};

export default Dashboard;

