import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Used for navigation
import API from "./api"; // Import Axios instance
import "./Login.css"; // Import the new CSS file



function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Redirect function
  const [showPassword, setShowPassword] = useState(false); 

  // Clear username and password on page load/refresh
  useEffect(() => {
    document.title = "Login - Summarization App";
    setUsername("");
    setPassword("");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");
  }, []);
  

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form reload
    setLoading(true); // Start loading
    setError(""); // Clear previous error messages

    try {
      const response = await API.post("/login/", {
        username: username,
        password: password,
      });

      localStorage.setItem("access_token", response.data.access); // Store JWT
      localStorage.setItem("refresh_token", response.data.refresh);

      API.defaults.headers["Authorization"] = `Bearer ${response.data.access}`;

      navigate("/Home"); // Redirect to Home page
    } catch (error) {
      setError("Invalid username or password");
    }

    setLoading(false); 
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            autoComplete="off"
            required
          />
        </div>
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            autoComplete="off"
            required
          />
          
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            
          >
            {showPassword ? "👁️" : "🙈"}
          </span>
        </div>

        {error && <p className="login-error">{error}</p>}
        
        <button type="submit" className="login-button">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <span
          className="auth-link"
          onClick={() => navigate("/SignUp")}
        >
          Sign Up
        </span>
      </p>
      <p>
  <span
    className="auth-link"
    onClick={() => navigate("/forgot-password")}
  >
    Forgot Password?
  </span>
</p>

    </div>
  );
}

export default Login;
