import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function LoggedInDashboard({ userId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/transactions/${userId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Chyba pri načítaní transakcií:", err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <p className="text-center mt-4">Načítavam transakcie...</p>;
  }

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!title || !category || !amount || !date)
      return alert("Vyplň všetky polia! Názov, sumu a dátum!");

    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          title,
          category,
          amount: parseFloat(amount),
          created_at: date,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTransactions([data.transaction, ...transactions]);
        setTitle("");
        setCategory("");
        setAmount("");
        setDate("");
      } else {
        alert(data.message || "Nepodarilo sa pridať transakciu!");
      }
    } catch (err) {
      console.error("Chyba pri pridávaní transakcie: ", err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Naozaj chceš zmazať túto transakciu?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTransactions(transactions.filter((t) => t.id !== id));
      } else {
        alert(data.message || "Nepodarilo sa zmazať transakciu!");
      }
    } catch (err) {
      console.error("Chyba pri mazaní transakcie:", err);
    }
  };

  const balanceData = transactions.map((t, index) => ({
    name: new Date(t.created_at).toLocaleDateString("sk-SK"),
    balance: transactions
      .slice(0, index + 1)
      .reduce((acc, tr) => acc + tr.amount, 0),
  }));

  const balance = transactions.reduce(
    (acc, t) => acc + parseFloat(t.amount),
    0
  );

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold" style={{ color: "#00d4ff" }}>
          💳 Tvoje transakcie
        </h2>
        <h3
          className="fw-bold mt-3"
          style={{
            color: balance >= 0 ? "#28a745" : "#dc3545",
            fontSize: "1.8rem",
          }}
        >
          Zostatok na účte: {balance.toFixed(2)} €
        </h3>
      </div>

      {/* Form Card */}
      <div
        className="card shadow-lg border-0 mb-5"
        style={{ borderRadius: "20px", background: "#1e1e2f" }}
      >
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

      {/* Transactions Card */}
      <div
        className="card shadow-lg border-0 mb-5"
        style={{ borderRadius: "20px", background: "#1e1e2f" }}
      >
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

      {/* Chart Card */}
      <div
        className="card shadow-lg border-0"
        style={{ borderRadius: "20px", background: "#1e1e2f" }}
      >
        <div className="card-body">
          <h4 className="text-center text-light mb-4">📊 Prehľad zostatku</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" tick={{ fill: "#aaa" }} />
              <YAxis tick={{ fill: "#aaa" }} />
              <Tooltip
                formatter={(v) => `${v} €`}
                contentStyle={{ background: "#2a2a3d", border: "none" }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#00d4ff"
                strokeWidth={3}
                dot={{ r: 5, fill: "#00d4ff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
