import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

const Summarization = () => {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [summary, setSummary] = useState("");
  const navigate = useNavigate();

  const handleSummarize = async () => {
    try {
      const response = await API.post("summarize/", { text, min_length: parseInt(wordCount) });
      setSummary(response.data.summary);
    } catch (err) {
      alert("Error generating summary. Please check input.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div>
      <h2>Text Summarization</h2>
      <textarea placeholder="Enter text..." value={text} onChange={(e) => setText(e.target.value)} />
      <input type="number" placeholder="Word count" value={wordCount} onChange={(e) => setWordCount(e.target.value)} />
      <button onClick={handleSummarize}>Summarize</button>
      <button onClick={handleLogout}>Sign Out</button>
      {summary && <p><strong>Summary:</strong> {summary}</p>}
    </div>
  );
};

export default Summarization;
