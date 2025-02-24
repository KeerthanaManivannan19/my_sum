import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

const Points = () => {
  const [text, setText] = useState("");
 
  const [summary_points, setSummary_points] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  

  const formatText = (inputText) => {
    return inputText
      .replace(/(\bI{1,3}|IV|V)\./g, "\n$1.") // Ensure Roman numerals start on a new line
      .replace(/\*/g, "\n*"); // Ensure bullet points are on a new line
  };

  

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) throw new Error("No refresh token available");

      const response = await API.post("token/refresh/", { refresh });
      const newAccessToken = response.data.access;

      // Store the new access token
      localStorage.setItem("access_token", newAccessToken);
      return newAccessToken;
    } catch (err) {
      console.error("Failed to refresh token", err);
      handleLogout(); // Log out if refresh fails
    }
  };

  /*const handleSummarize = async () => {
    setLoading(true);
    let token = localStorage.getItem("access_token");

    try {
      const minLength = Math.min(100, Math.max(20, parseFloat(wordCount) || 20));
      let endpoint = model === "deepseek" ? "summarize/" : "summarize1/";

      let response = await API.post(
        endpoint,
        { text, min_length: minLength },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSummary(response.data.summary);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Token expired → Try refreshing
        const newToken = await refreshToken();
        if (newToken) {
          try {
            let response = await API.post(
              model === "deepseek" ? "summarize/" : "summarize1/",
              { text, min_length: Math.min(100, Math.max(20, parseFloat(wordCount) || 20)) },
              { headers: { Authorization: `Bearer ${newToken}` } }
            );
            setSummary(response.data.summary);
          } catch (error) {
            alert("Error generating summary. Please check input.");
          }
        }
      } else {
        alert("Error generating summary. Please check input.");
      }
    }
    setLoading(false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setSummary("");
  };*/

  


  const handleSummarize = async () => {
    setLoading(true);
    let token = localStorage.getItem("access_token");

    try {
     

      let response = await API.post(
        "summarize_points/",  // Backend will now handle model selection
        { text},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const formattedSummary = formatText(response.data.summary_points);

      setSummary_points(formattedSummary);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Token expired → Refresh token
        const newToken = await refreshToken();
        if (newToken) {
          try {
            let response = await API.post(
              "summarize_points/",
              { text},
              { headers: { Authorization: `Bearer ${newToken}` } }
            );
            const formattedSummary = formatText(response.data.summary_points);
            setSummary_points(formattedSummary);
          } catch (error) {
            alert("Error generating summary. Please check input.");
          }
        }
      } else {
        alert("Error generating summary. Please check input.");
      }
    }
    setLoading(false);
  };

 
  const handleTextChange = (e) => {
    setText(e.target.value);
    setSummary_points(""); // Ensures summary is cleared on any text change
  }; 
    
   

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div>
      <h2>Text Summarization</h2>
      <textarea placeholder="Enter text..." value={text} onChange={handleTextChange} />
      
      
      <button onClick={handleSummarize} disabled={loading}> {loading ? "Summarizing..." : "Summarize"}</button>
      <button onClick={handleLogout}>Sign Out</button>
      {summary_points && (<pre style={{ whiteSpace: "pre-wrap" }}>
          <strong>Summary:</strong> {summary_points}
        </pre>)}
    </div>
  );
};

export default Points;
