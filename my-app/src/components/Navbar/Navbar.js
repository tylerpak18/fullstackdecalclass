
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import "./Navbar.css";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className={theme === "dark" ? "navbar navbar-dark" : "navbar navbar-light"}>
      <Link className="nav-link" to="/home">Home</Link>
      <Link className="nav-link" to="/counter">Counter</Link>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </nav>
  );
}

export default Navbar;
