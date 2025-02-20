import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./sign"; // Updated path
import SignUp from "./new"; // Updated path
import Summarization from "./Summarization"; // Updated path
import React from "react";
import ForgotPassword from "./ForgotPassword"; // Import the new component
import ResetPassword from "./ResetPassword";
import "./App.css";
import Points from "./points"
import Home from "./Home";


const PrivateRoute = ({ children }) => {
  return localStorage.getItem("access_token") ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Summarization" element={<PrivateRoute><Summarization /></PrivateRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/ResetPassword/:uidb64/:token/" element={<ResetPassword />} />
        <Route path="/points" element={<PrivateRoute><Points /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;