import React from 'react';

export default function MinimalApp() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#F5F0E8',
      minHeight: '100vh',
      color: '#3D2B1F'
    }}>
      <h1>SRI MURUGAN TEX</h1>
      <p>Website is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
      <p>Backend API: <a href="http://localhost:3001/api/products" target="_blank">http://localhost:3001/api/products</a></p>
    </div>
  );
}
