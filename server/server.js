import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors(
    {
        origin: "http://localhost:5173",  //FE
        credentials: true,                // Posielanie cookies
    }
));
app.use(express.json());
app.use(cookieParser());

// DB pripojenie
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
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

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });

        res.json({ success: true, message: "Login successful", userId: user.id });
    });
});

// Check-auth
app.get("/api/check-auth", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ loggedIn: false });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ loggedIn: true, user: decoded });
  } catch (err) {
    res.json({ loggedIn: false });
  }
});

// Logout
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
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
