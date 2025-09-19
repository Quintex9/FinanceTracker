import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import Dashboard from "./components/Dashboard";
import LoggedInDashboard from "./components/LoggedInDashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/check-auth", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(data.loggedIn);
        if (data.loggedIn && data.user) {
          setUserId(data.user.id);
        }
      });
  }, []);

  return (
    <>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mt-4">
                {isLoggedIn === null ? (
                  <p className="text-center">Overujem prihlásenie...</p>
                ) : isLoggedIn ? (
                  <LoggedInDashboard userId={userId} />
                ) : (
                  <Dashboard />
                )}
              </div>
            }
          />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/registration" element={<Registration />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
