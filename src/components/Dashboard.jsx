import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {

  const [transactions] = useState([
    { id: 1, title: "Výplata", amount: 1200, createdAt: "2025-09-01" },
    { id: 2, title: "Nákup potravín", amount: -80, createdAt: "2025-08-01" },
    { id: 3, title: "Kino", amount: -15, createdAt: "2025-09-05" },
    { id: 4, title: "Tankovanie", amount: -140, createdAt: "2025-09-11" },
    { id: 5, title: "Zábava", amount: -54, createdAt: "2025-09-15" },
    { id: 6, title: "Nové tenisky", amount: -55, createdAt: "2025-09-20" },
    { id: 7, title: "Pokuta", amount: -100, createdAt: "2025-09-26" },
  ]);

  const balanceData = transactions.map((t, index) => ({
  name: new Date(t.createdAt).toLocaleDateString("sk-SK"),
  balance: transactions.slice(0, index + 1).reduce((acc, tr) => acc + tr.amount, 0),
}));

  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);

  // priprava dát pre graf
  const chartData = transactions.map((t) => ({
    name: new Date(t.createdAt).toLocaleDateString("sk-SK"),
    amount: t.amount,
  }));

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Finance Dashboard 💰</h2>
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
    <Line type="monotone" dataKey="balance" stroke="#0d6efd" strokeWidth={3} dot={{ r: 5 }} />
  </LineChart>
</ResponsiveContainer>

    </div>
  );
}
