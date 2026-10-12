
import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

function Home() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "#222222" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#333333",
        padding: "20px"
      }}
    >
      <h1>Welcome to My React App!</h1>
      <p>This is the Home page.</p>
    </div>
  );
}

export default Home;
