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
        setIsLoggedIn(true);
        navigate("/");
        window.location.reload(); // reflesh, inak by to bolo manualne
      } else {
        alert(data.message || "Login failed ❌");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="p-5 shadow-lg"
        style={{
          background: "#1e1e2f",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "#00d4ff" }}>
          Prihlásenie
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-light">Email</label>
            <input
              type="email"
              className="form-control"
              style={{ background: "#2a2a3d", border: "none", color: "#fff" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label text-light">Heslo</label>
            <input
              type="password"
              className="form-control"
              style={{ background: "#2a2a3d", border: "none", color: "#fff" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Register link */}
          <p className="text-center text-muted">
            Nemáš účet?{" "}
            <span
              onClick={handleRegistration}
              style={{
                color: "#00d4ff",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Registruj sa
            </span>
          </p>

          {/* Submit */}
          <button
            type="submit"
            className="btn w-100"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,212,255,1) 0%, rgba(13,110,253,1) 100%)",
              border: "none",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "12px",
              padding: "10px",
              fontSize: "1rem",
            }}
          >
            Prihlásiť sa
          </button>
        </form>
      </div>
    </div>
  );
}
