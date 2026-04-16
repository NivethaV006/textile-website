import { useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

export default function AuthPage({ onAuthSuccess, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (user) => {
    // Store user in localStorage and update state
    localStorage.setItem('user', JSON.stringify(user));
    onAuthSuccess(user);
  };

  const handleSignup = (user) => {
    // Store user in localStorage and update state
    localStorage.setItem('user', JSON.stringify(user));
    onAuthSuccess(user);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            fontFamily: 'monospace'
          }}
        >
          ✕
        </button>
        
        {isLogin ? (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <SignupPage
            onSignup={handleSignup}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
}
