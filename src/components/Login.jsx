import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegistration = () => navigate("/registration");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Login successful ✅");
        setIsLoggedIn(true);
        navigate("/");
      } else {
        alert(data.message || "Login failed ❌");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error ❌");
    }
  };

  return (
    <div
      className="card p-4 shadow-sm"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h3 className="mb-3">Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p>
          Nemáš účet ?{" "}
          <button
            type="button"
            className="btn btn-light"
            onClick={handleRegistration}
          >
            Registruj sa
          </button>
        </p>
        <button type="submit" className="btn btn-primary w-100">
          Log in
        </button>
      </form>
    </div>
  );
}
