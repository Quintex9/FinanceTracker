import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegistration = () => navigate("/registration");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tu by si pripojil backend overenie
    if (email && password) {
      setIsLoggedIn(true);
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", margin: "auto"}}>
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
        <p>Nemáš účet ? <button type="button" className="btn btn-light" onClick={handleRegistration}>Registruj sa</button></p>
        <button type="submit" className="btn btn-primary w-100">
          Log in
        </button>
      </form>
    </div>
  );
}
