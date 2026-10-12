
import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import CounterPage from "./pages/CounterPage/CounterPage";

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme === "dark" ? "#222222" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#333333"
      }}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/counter" element={<CounterPage />} />
      </Routes>
    </div>
  );
}

export default App;
