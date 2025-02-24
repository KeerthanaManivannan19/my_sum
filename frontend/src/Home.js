import React from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

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
        <button onClick={() => navigate("/points")}>Summarization as Points</button>
        

      </div>
      <button onClick={handleLogout} className="logout-btn">Sign Out</button>
    </div>
  );
};

export default Home;
