import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div className="container home-container">
      <h1>Choose Summarization Type</h1>
      <div className="home-buttons">
        <button onClick={() => navigate("/Summarization")}>Summarization</button>
        <button onClick={() => navigate("/points")}>Importent</button>
      </div>
      <button onClick={handleLogout} className="logout-btn">Sign Out</button>
    </div>
  );
};

export default Home;
