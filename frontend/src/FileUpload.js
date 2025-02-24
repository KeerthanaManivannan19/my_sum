// FileUpload.js
import React, { useState } from 'react';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch('http://localhost:8000/qa/upload_pdf/', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    onUpload(data.message);
  };

  return (
    <div className="file-upload">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload PDF</button>
    </div>
  );
};

export default FileUpload;
