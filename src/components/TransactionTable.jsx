export default function TransactionTable({ transactions, handleDeleteTransaction }) {
  return (
    <div className="card shadow-lg border-0 mb-5"
      style={{ borderRadius: "20px", background: "#1e1e2f" }}>
      <div className="card-body">
        <h4 className="card-title text-center text-light mb-4">
          📑 História transakcií
        </h4>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle text-center mb-0">
            <thead>
              <tr style={{ background: "#2a2a3d" }}>
                <th>Názov</th>
                <th>Kategória</th>
                <th>Dátum</th>
                <th>Suma</th>
                <th>Vymazať</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="fw-bold">{t.title}</td>
                  <td className="fw-bold">{t.category}</td>
                  <td className="text-muted">
                    {new Date(t.created_at).toLocaleDateString("sk-SK")}
                  </td>
                  <td
                    className="fw-bold"
                    style={{ color: t.amount < 0 ? "#ff6b6b" : "#4cd964" }}
                  >
                    {t.amount} €
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteTransaction(t.id)}
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
