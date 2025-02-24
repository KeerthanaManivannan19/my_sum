import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import "./Signup1.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters long and include at least one number, one uppercase letter, and one special character.");
      return;
    }
    
    try {
      await API.post("register/", formData);
      navigate("/"); // Redirect to login after successful signup
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
      <h2 className="signup-title">Sign Up</h2>
      {error && <p className="signup-error">{error}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <input type="text" name="username" placeholder="Username" onChange={handleChange} className="signup-input" required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="signup-input" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="signup-input" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="signup-input" required />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      </div>
    </div>

  );
};

export default SignUp;
