import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Used for navigation
import API from "./api"; // Import Axios instance

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Redirect function

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form reload

    try {
      const response = await API.post("/login/", {
        username: username,
        password: password,
      });

      localStorage.setItem("access_token", response.data.access); // Store JWT
      localStorage.setItem("refresh_token", response.data.refresh);

      API.defaults.headers["Authorization"] = `Bearer ${response.data.access}`;

      navigate("/Summarization"); // Redirect to Home page
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/SignUp")}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}

export default Login;
