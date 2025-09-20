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
    { id: 1, title: "Výplata",category: "príjem" , amount: 1200, createdAt: "2025-09-01" },
    { id: 2, title: "Nákup potravín", category: "jedlo", amount: -80, createdAt: "2025-08-01" },
    { id: 3, title: "Kino", amount: -15, category: "zábava", createdAt: "2025-09-05" },
    { id: 4, title: "Tankovanie", amount: -140, category: "doprava", createdAt: "2025-09-11" },
    { id: 5, title: "Zábava", amount: -54, createdAt: "2025-09-15" },
    { id: 6, title: "Nové tenisky", amount: -55, createdAt: "2025-09-20" },
    { id: 7, title: "Pokuta", amount: -100, createdAt: "2025-09-26" },
  ]);

  const balanceData = transactions.map((t, index) => ({
    name: new Date(t.createdAt).toLocaleDateString("sk-SK"),
    balance: transactions.slice(0, index + 1).reduce((acc, tr) => acc + tr.amount, 0),
  }));

  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold" style={{ color: "#00d4ff" }}>
          💳 Vizualizácia dummy dát
        </h2>
        <p className="text-secondary">
          Pre použitie stránky sa treba prihlásiť alebo registrovať
        </p>
        <h3
          className="fw-bold mt-3"
          style={{
            color: balance >= 0 ? "#28a745" : "#dc3545",
            fontSize: "1.8rem",
          }}
        >
          Zostatok na účte: {balance} €
        </h3>
      </div>

      {/* Transactions Card */}
      <div
        className="card shadow-lg border-0 mb-5"
        style={{ borderRadius: "20px", background: "#1e1e2f" }}
      >
        <div className="card-body">
          <h4 className="card-title text-center text-light mb-4">
            Posledné transakcie
          </h4>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle text-center mb-0">
              <thead>
                <tr style={{ background: "#2a2a3d" }}>
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
                      style={{ color: t.amount < 0 ? "#ff6b6b" : "#4cd964" }}
                    >
                      {t.amount} €
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
          <h4 className="text-center text-light mb-4">📊 Prehľad transakcií</h4>
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
