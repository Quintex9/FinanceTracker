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

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/transactions/${userId}`, {
      credentials: "include", // dôležité, ak používaš cookies
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

  const balanceData = transactions.map((t, index) => ({
    name: new Date(t.createdAt).toLocaleDateString("sk-SK"),
    balance: transactions
      .slice(0, index + 1)
      .reduce((acc, tr) => acc + tr.amount, 0),
  }));

  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);

  // priprava dát pre graf
  const chartData = transactions.map((t) => ({
    name: new Date(t.createdAt).toLocaleDateString("sk-SK"),
    amount: t.amount,
  }));

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4">Zostatok na účte: {balance} €</h4>

      {/* Tabuľka */}
      <div className="table-responsive mb-5">
        <table className="table table-striped table-hover align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Názov</th>
              <th>Dátum</th>
              <th>Suma</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td className="fw-bold">{t.title}</td>
                <td className="text-muted">
                  {new Date(t.createdAt).toLocaleDateString("sk-SK")}
                </td>
                <td
                  className="fw-bold"
                  style={{ color: t.amount < 0 ? "#d9534f" : "#28a745" }}
                >
                  {t.amount} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Graf */}
      <h4 className="text-center mb-3">📊 Prehľad transakcií</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={balanceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="name" tick={{ fill: "#ddd" }} />
          <YAxis tick={{ fill: "#ddd" }} />
          <Tooltip formatter={(v) => `${v} €`} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#0d6efd"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
