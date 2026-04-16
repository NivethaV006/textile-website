import React from 'react';

// MINIMAL TEST - Check if basic rendering works
export default function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#333',
      background: '#f5f0e8'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#8B4513', marginBottom: '20px' }}>SRI MURUGAN TEX</h1>
        <p>Website is loading...</p>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
          If you see this, the basic app is working.
        </p>
      </div>
    </div>
  );
}
