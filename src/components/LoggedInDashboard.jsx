import { useEffect, useState } from "react";
import AddTransactionForm from "./AddTransactionForm";
import TransactionTable from "./TransactionTable";
import BalanceLineChart from "./BalanceLineChart";
import IncomePieChart from "./IncomePieChart";
import ExpensePieChart from "./ExpensePieChart";

// Farby podľa kategórií
const CATEGORY_COLORS = {
  Príjem: "#28a745", // zelená
  Jedlo: "#ff6b6b", // červená
  Zábava: "#ffa502", // oranžová
  Doprava: "#00d4ff", // modrá
  Ostatné: "#9b59b6", // fialová
};
const getCategoryColor = (cat) => CATEGORY_COLORS[cat] || "#6c757d";

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

  //Add transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!title || !category || !amount || !date)
      return alert("Vyplň všetky polia! Názov, kategóriu, sumu a dátum!");

    let num = parseFloat(amount);

    if (category === "Príjem" && num <= 0) {
      alert("Na príjem musíš zadať kladné číslo!");
      return;
    }
    if (category !== "Príjem" && num >= 0) {
      alert("Na príjem služí kategória príjem!");
      return;
    }

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

  //Delete transaction
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

  // Data pre grafy
  const balanceData = [...transactions]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((t, index, arr) => ({
      name: new Date(t.created_at).toLocaleDateString("sk-SK"),
      balance: arr
        .slice(0, index + 1)
        .reduce((acc, tr) => acc + parseFloat(tr.amount), 0),
    }));

  const balance = transactions.reduce(
    (acc, t) => acc + parseFloat(t.amount),
    0
  );

  // Rozdelenie podľa príjmov a výdavkov
  const incomeByCategory = {};
  const expenseByCategory = {};
  transactions.forEach((t) => {
    const amt = parseFloat(t.amount);
    const key = t.category || "Ostatné";
    if (amt >= 0) {
      incomeByCategory[key] = (incomeByCategory[key] || 0) + amt;
    } else {
      expenseByCategory[key] = (expenseByCategory[key] || 0) + Math.abs(amt);
    }
  });

  const incomePieData = Object.entries(incomeByCategory).map(
    ([name, value]) => ({ name, value })
  );
  const expensePieData = Object.entries(expenseByCategory).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold" style={{ color: "#00d4ff" }}>
          Tvoje transakcie 💳
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

      <AddTransactionForm
        title={title}
        setTitle={setTitle}
        category={category}
        setCategory={setCategory}
        amount={amount}
        setAmount={setAmount}
        date={date}
        setDate={setDate}
        handleAddTransaction={handleAddTransaction}
      />

      <TransactionTable
        transactions={transactions}
        handleDeleteTransaction={handleDeleteTransaction}
      />

      <BalanceLineChart balanceData={balanceData} />

      {expensePieData.length > 0 && (
        <div className="d-flex gap-4 justify-content-center flex-wrap">
          {expensePieData.length > 0 && (
            <div style={{ flex: "1 1 400px" }}>
              <ExpensePieChart
                data={expensePieData}
                getCategoryColor={getCategoryColor}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
