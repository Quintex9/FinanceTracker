import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mt-4">
                {!isLoggedIn ? (
                  <h3>
                    Tento projekt nepoužíva žiadne dummy data preto je potrebné
                    sa prihlásiť/registrovať
                  </h3>
                ) : (
                  <h2>Welcome to your Finance Dashboard 💰</h2>
                )}
              </div>
            }
          />
          <Route
          path="/login"
          element={<Login/>}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
