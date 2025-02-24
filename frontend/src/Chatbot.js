// Chatbot.js
import React, { useState } from 'react';

const Chatbot = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAskQuestion = async () => {
    const response = await fetch('http://localhost:8000/qa/ask_question/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();
    setAnswer(data.answer);
  };

  return (
    <div className="chatbot">
      <textarea
        value={question}
        onChange={handleQuestionChange}
        placeholder="Ask a question about the uploaded PDF..."
      />
      <button onClick={handleAskQuestion}>Ask</button>
      {answer && (
        <div className="answer">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
