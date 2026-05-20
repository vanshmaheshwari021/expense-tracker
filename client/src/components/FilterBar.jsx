const FilterBar = ({ filters, onChange, onClear, isPending }) => {
  return (
    <section className="panel filter-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Refine View</p>
          <h2>Search & Filter</h2>
        </div>
        <button type="button" className="ghost-button" onClick={onClear}>
          Clear
        </button>
      </div>

      <div className="filter-grid">
        <label>
          <span>Search</span>
          <input
            type="text"
            placeholder="Search by title or note"
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
          />
        </label>

        <label>
          <span>Type</span>
          <select
            value={filters.type}
            onChange={(event) => onChange("type", event.target.value)}
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label>
          <span>Category</span>
          <input
            type="text"
            placeholder="Food, Salary, Travel..."
            value={filters.category}
            onChange={(event) => onChange("category", event.target.value)}
          />
        </label>

        <label>
          <span>Start Date</span>
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => onChange("startDate", event.target.value)}
          />
        </label>

        <label>
          <span>End Date</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => onChange("endDate", event.target.value)}
          />
        </label>
      </div>

      {isPending ? <p className="subtle-text">Refreshing filtered results...</p> : null}
    </section>
  );
};

export default FilterBar;

