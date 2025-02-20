import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./api"; // Import your API service




function ResetPassword() {
  const { uidb64, token } = useParams(); // Get the values from the URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  console.log("UID:", uidb64);
  console.log("Token:", token);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("Password must be at least 8 characters long and include at least one number, one uppercase letter, and one special character.");
      return;
    }

    try {
      const response = await API.post(`/reset-password-confirm/${uidb64}/${token}/`, {
        new_password: newPassword,
      });

      setMessage(response.data.message ||"Password reset successful! You can now log in.");
      setError("");
      setTimeout(() => navigate("/"), 2000); // Redirect after success
    } catch (err) {
        setError(err.response?.data?.error || "Invalid or expired link. Try resetting your password again.");
        setMessage("");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default ResetPassword;
