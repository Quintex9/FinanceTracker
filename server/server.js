import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// DB pripojenie
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "financetracer"
});

db.connect(err => {
    if (err) console.error("DB error:", err);
    else console.log("✅ MySQL connected");
});

// ---------------- AUTH ----------------

// Register
app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashed],
        (err) => {
            if (err) {
                console.error("Register DB error:", err);
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ message: "Tento email je už zaregistrovaný ❌" });
                }
                return res.status(500).json({ message: "DB error", error: err });
            }

            res.json({ success: true, message: "User registered" });
        }
    );
});

// Login
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email=?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "DB error" });
        if (!results.length) return res.status(401).json({ message: "Invalid credentials" });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        res.json({ success: true, message: "Login successful", userId: user.id });
    });
});

// ---------------- TRANSACTIONS ----------------

// Add
app.post("/api/transactions", (req, res) => {
    const { userId, title, amount } = req.body;
    db.query(
        "INSERT INTO transactions (user_id, title, amount) VALUES (?, ?, ?)",
        [userId, title, amount],
        (err) => {
            if (err) return res.status(500).json({ message: "DB error" });
            res.json({ success: true, message: "Transaction added" });
        }
    );
});

// List
app.get("/api/transactions/:userId", (req, res) => {
    db.query(
        "SELECT * FROM transactions WHERE user_id=? ORDER BY created_at DESC",
        [req.params.userId],
        (err, results) => {
            if (err) return res.status(500).json({ message: "DB error" });
            res.json(results);
        }
    );
});

// Balance
app.get("/api/balance/:userId", (req, res) => {
    db.query(
        "SELECT SUM(amount) as balance FROM transactions WHERE user_id=?",
        [req.params.userId],
        (err, results) => {
            if (err) return res.status(500).json({ message: "DB error" });
            res.json({ balance: results[0].balance || 0 });
        }
    );
});

// ---------------- START ----------------
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
