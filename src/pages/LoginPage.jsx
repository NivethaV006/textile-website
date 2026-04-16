import { useState } from 'react';
import { T } from '../utils/styles';

export default function LoginPage({ onLogin, onSwitchToSignup }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call - replace with actual API
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        onLogin(result.user);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: T.cream,
      padding: '20px'
    }}>
      <div style={{
        background: T.white,
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '32px',
            fontWeight: 300,
            color: T.deepBrown,
            marginBottom: '8px'
          }}>
            Welcome Back
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '12px',
            color: T.muted
          }}>
            Sign in to your SRI MURUGAN TEX account
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '12px',
            borderRadius: '4px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontFamily: "'DM Mono', monospace",
              fontSize: '10px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: T.muted,
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${T.border}`,
                borderRadius: '4px',
                fontFamily: "'DM Mono', monospace",
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = T.rust}
              onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              fontFamily: "'DM Mono', monospace",
              fontSize: '10px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: T.muted,
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${T.border}`,
                borderRadius: '4px',
                fontFamily: "'DM Mono', monospace",
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = T.rust}
              onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? T.muted : T.rust,
              color: T.white,
              border: 'none',
              padding: '14px',
              borderRadius: '4px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              marginBottom: '20px'
            }}
            onMouseEnter={e => !loading && (e.target.style.background = T.deepBrown)}
            onMouseLeave={e => !loading && (e.target.style.background = T.rust)}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          borderTop: `1px solid ${T.border}`,
          paddingTop: '20px'
        }}>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: T.muted,
            marginBottom: '12px'
          }}>
            Don't have an account?
          </p>
          <button
            onClick={onSwitchToSignup}
            style={{
              background: 'none',
              border: `1px solid ${T.rust}`,
              color: T.rust,
              padding: '10px 20px',
              borderRadius: '4px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              e.target.style.background = T.rust;
              e.target.style.color = T.white;
            }}
            onMouseLeave={e => {
              e.target.style.background = 'none';
              e.target.style.color = T.rust;
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
