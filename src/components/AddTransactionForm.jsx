export default function AddTransactionForm({
  title, setTitle,
  category, setCategory,
  amount, setAmount,
  date, setDate,
  handleAddTransaction
}) {
  return (
    <div className="card shadow-lg border-0 mb-5"
      style={{ borderRadius: "20px", background: "#1e1e2f" }}>
      <div className="card-body">
        <h5 className="text-light text-center mb-4">➕ Pridať transakciu</h5>
        <form
          onSubmit={handleAddTransaction}
          className="d-flex gap-2 justify-content-center"
        >
          <input
            type="text"
            className="form-control w-25"
            placeholder="Názov"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="form-control w-25"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Vyber kategóriu</option>
            <option value="Príjem">Príjem</option>
            <option value="Jedlo">Jedlo</option>
            <option value="Zábava">Zábava</option>
            <option value="Doprava">Doprava</option>
            <option value="Ostatné">Ostatné</option>
          </select>
          <input
            type="number"
            className="form-control w-25"
            placeholder="Suma"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="date"
            className="form-control w-25"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button type="submit" className="btn btn-info text-white">
            Pridať
          </button>
        </form>
      </div>
    </div>
  );
}
