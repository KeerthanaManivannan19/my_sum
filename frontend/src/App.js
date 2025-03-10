import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./sign"; // Updated path
import SignUp from "./SignUp"; // Updated path
import Summarization from "./Summarization"; // Updated path
import React from "react";
import ForgotPassword from "./ForgotPassword"; // Import the new component
import ResetPassword from "./ResetPassword";
import Points from "./points"
import Home from "./Home";
import FileUpload from './FileUpload';
import Chatbot from './Chatbot';



const PrivateRoute = ({ children }) => {
  return localStorage.getItem("access_token") ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Summarization" element={<PrivateRoute><Summarization /></PrivateRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/ResetPassword/:uidb64/:token/" element={<ResetPassword />} />
        <Route path="/points" element={<PrivateRoute><Points /></PrivateRoute>} />
        <Route path="/FileUpload" element={<PrivateRoute><FileUpload /></PrivateRoute>} />
        <Route path="/Chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;