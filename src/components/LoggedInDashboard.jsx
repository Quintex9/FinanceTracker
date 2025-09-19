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
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

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

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!title || !amount || !date)
      return alert("Vyplň všetky polia! Názov, sumu a dátum!");

    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          title,
          amount: parseFloat(amount),
          created_at: date,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTransactions([data.transaction, ...transactions]);
        setTitle("");
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
      // odstránime transakciu aj zo state
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

  const balance = transactions.reduce((acc, t) => acc + parseFloat(t.amount), 0);

  // priprava dát pre graf
  const chartData = transactions.map((t) => ({
    name: new Date(t.created_at).toLocaleDateString("sk-SK"),
    amount: parseFloat(t.amount),
  }));

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4">Zostatok na účte: {balance.toFixed(2)} €</h4>

      <form
        onSubmit={handleAddTransaction}
        className="d-flex gap-2 mb-4 justify-content-center"
      >
        <input
         type="text"
         className="form-control w-25"
         placeholder="Názov transakcie"
         value={title}
         onChange={(e) => setTitle(e.target.value)}
        />
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
         placeholder="Názov transakcie"
         value={date}
         onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Pridať</button>
      </form>

      {/* Tabuľka */}
      <div className="table-responsive mb-5">
        <table className="table table-striped table-hover align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Názov</th>
              <th>Dátum</th>
              <th>Suma</th>
              <th>Vymazať</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td className="fw-bold">{t.title}</td>
                <td className="text-muted">
                  {new Date(t.created_at).toLocaleDateString("sk-SK")}
                </td>
                <td
                  className="fw-bold"
                  style={{ color: t.amount < 0 ? "#d9534f" : "#28a745" }}
                >
                  {t.amount} €
                </td>
                <td>
                    <button className="btn btn-danger" onClick={() => handleDeleteTransaction(t.id)}>X</button>
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
