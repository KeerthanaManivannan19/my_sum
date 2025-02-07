import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./sign"; // Updated path
import SignUp from "./SignUp"; // Updated path
import Summarization from "./Summarization"; // Updated path
import React from "react";

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("access_token") ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Summarization" element={<PrivateRoute><Summarization /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;