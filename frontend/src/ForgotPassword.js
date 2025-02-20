import React, { useState } from "react";
import API from "./api";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/send_reset_email/", { email });
      setMessage(response.data.message || "Check your email for a password reset link!");
      setTimeout(() => setShowResend(true), 50); // Show resend option after 50ms
     
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset email. Check if the email is correct.");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          
          {loading ? "Sending..." : showResend ? "Resend Reset Link" : "Send Reset Link"}
        </button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
    </div>
  );
}

export default ForgotPassword;
