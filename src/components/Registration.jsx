import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Registration successful ✅");
        navigate("/login"); // presmerovanie na login
      }
      if (res.status === 500 && data.message.includes("User exists")) {
        alert("Tento email je už zaregistrovaný ❌");
      } else {
        alert(data.message || "Registration failed ❌");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error ❌");
    }
  };

  return (
    <div
      className="card p-4 shadow-sm mt-4"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h3 className="mb-3">Registration</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p>
          Máš účet?{" "}
          <button type="button" className="btn btn-light" onClick={handleLogin}>
            Prihlás sa
          </button>
        </p>
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}
