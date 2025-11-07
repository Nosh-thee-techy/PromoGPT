import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext.jsx';

const API_BASE = 'http://localhost:8000';

const CSVUpload = ({ businessSlug }) => {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);

  const upload = () => {
    if (!file) return alert('Select a CSV file first');
    const formData = new FormData();
    formData.append('file', file);

    axios
      .post(`${API_BASE}/business/${businessSlug}/product-upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        alert('Upload successful');
        setFile(null);
      })
      .catch(() => {
        alert('Upload failed');
      });
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Upload Products CSV</h3>
      <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload} style={{ marginTop: 8 }}>
        Upload
      </button>
    </div>
  );
};

export default CSVUpload;
