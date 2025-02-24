import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";


const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Disable browser back button after logout
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h2 className="nav-title"><center>Summarization</center></h2>
        <button onClick={handleLogout} className="logout-btn">Log out</button>
      </nav>

      {/* Summarization Type Selection */}
      <div className="content">
        <h1 className="home-title">Choose Summarization Type</h1>
        <div className="home-buttons">
          <button onClick={() => navigate("/Summarization")} className="summarization-btn">Summarization</button>
          <button onClick={() => navigate("/points")} className="summarization-btn">Summarization as Points</button>
        </div>
      </div>

      {/* Importance of Summarization (Scrollable) */}
      <div className="importance-section">
        <h2 className="importance-title">Why is Summarization Important?</h2>
        <div className="importance-text">
          Summarization is a crucial skill that allows individuals to extract key points from vast amounts of information efficiently. It improves comprehension and retention by focusing on the most relevant details. By reducing lengthy content, summarization saves time, making it invaluable for students, researchers, and professionals who need to process large datasets. Summarization aids in structured learning by breaking down complex topics into easily digestible parts. It helps in academic writing, where concise representation of ideas is necessary. Effective summarization ensures that critical information is not lost while filtering out unnecessary details. It enhances note-taking by allowing learners to focus on essential concepts without distractions. In business settings, summarization is useful for extracting insights from reports and presentations. News articles often use summarization to provide quick highlights of major events. The ability to summarize effectively enhances analytical skills and critical thinking. It allows professionals to communicate key ideas succinctly without losing context. In today's digital world, where information overload is common, summarization helps in managing content efficiently. Automated summarization tools assist in processing and organizing information faster. Summarization is integral to artificial intelligence, where machine learning models rely on extracting key elements from large text corpora. A well-summarized document improves readability and engagement. Search engines utilize summarization techniques to display relevant content in search results. Legal professionals use summarization to review case files and legal documents efficiently. Medical research papers often require summarization for quick analysis of key findings. Summarization reduces cognitive load, making information processing easier. It plays a critical role in data-driven decision-making by filtering out redundant details. Academic summaries enable students to grasp main ideas without extensive reading. Effective summarization techniques improve writing clarity and coherence. In journalism, summarization is used to create concise news reports. Government policies and regulations often require summarization for public understanding. Summarization improves time management by presenting key insights in a short format. It enhances productivity by reducing the effort needed to comprehend complex information. The ability to summarize helps in better organization of thoughts and ideas. Summarization supports effective communication by conveying the main message efficiently. In scientific research, summarization is used to distill essential discoveries. Social media platforms rely on summarization to generate highlights and trending topics. Summarization tools enhance user experience by providing quick previews of content. Students benefit from summarization techniques when preparing for exams. Digital libraries use summarization to generate abstracts for research articles. The demand for summarization continues to grow with the increasing availability of digital content...
        </div>
      </div>
    </div>
  );
};


export default Home;
