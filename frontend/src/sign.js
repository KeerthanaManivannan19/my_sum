import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Used for navigation
import API from "./api"; // Import Axios instance


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Redirect function
  const [showPassword, setShowPassword] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form reload
    //setLoading(true); // Start loading
    setError(""); // Clear previous error messages

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

    //setLoading(false); 
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
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "40%",
              left:"60%",
              top: "33%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "blue"
            }}
          >
            {showPassword ? "👁️" : "🙈"}
          </span>
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
