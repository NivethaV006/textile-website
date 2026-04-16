import { useState, useEffect } from 'react';
import { T } from '../utils/styles';

export default function ProfilePage({ user, onLogout, setPage }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Calculate loyalty points: 5 points for every order > ₹1000
  // 1 point = ₹20 discount
  const calculateLoyaltyPoints = () => {
    const qualifyingOrders = orders.filter(order => (order.totalAmount || 0) > 1000);
    const points = qualifyingOrders.length * 5;
    const discountValue = points * 20; // 1 point = ₹20
    return { points, discountValue, qualifyingOrders: qualifyingOrders.length };
  };

  const { points, discountValue, qualifyingOrders } = calculateLoyaltyPoints();

  useEffect(() => {
    // Load user orders when component mounts
    const loadOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/orders');
        if (response.ok) {
          const userOrders = await response.json();
          setOrders(userOrders);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
      }
    };
    loadOrders();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle case where user might be null/undefined
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: T.cream, paddingTop: '90px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: T.deepBrown, marginBottom: '20px' }}>
            Please Log In
          </h2>
          <p style={{ fontFamily: "'DM Mono', monospace", color: T.muted, marginBottom: '30px' }}>
            You need to be logged in to view your profile.
          </p>
          <button
            onClick={() => setPage('home')}
            style={{
              background: T.rust,
              color: T.white,
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'DM Mono', monospace"
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: T.cream, paddingTop: '90px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Profile Header */}
        <div style={{
          background: T.white,
          borderRadius: '12px',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '30px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: T.rust,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: T.white,
              fontSize: '32px',
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '36px',
                fontWeight: 300,
                color: T.deepBrown,
                marginBottom: '8px'
              }}>
                {user.name}
              </h1>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '14px',
                color: T.muted,
                marginBottom: '4px'
              }}>
                {user.email}
              </p>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px',
                color: T.rust,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Premium Customer
              </p>
            </div>
          </div>

          {/* Account Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            borderTop: `1px solid ${T.border}`,
            paddingTop: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 600,
                color: T.rust,
                fontFamily: "'Cormorant Garamond', serif",
                marginBottom: '8px'
              }}>
                {orders.length}
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '12px',
                color: T.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Total Orders
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 600,
                color: T.rust,
                fontFamily: "'Cormorant Garamond', serif",
                marginBottom: '8px'
              }}>
                {new Date().getFullYear() - 2023}
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '12px',
                color: T.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Years Active
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 600,
                color: T.rust,
                fontFamily: "'Cormorant Garamond', serif",
                marginBottom: '8px'
              }}>
                ₹{(orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)).toLocaleString()}
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '12px',
                color: T.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Total Spent
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 600,
                color: T.rust,
                fontFamily: "'Cormorant Garamond', serif",
                marginBottom: '8px'
              }}>
                {points}
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '12px',
                color: T.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Loyalty Points
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '10px',
                color: T.rust,
                marginTop: '4px'
              }}>
                ₹{discountValue} value
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Program Info */}
        <div style={{
          background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
          borderRadius: '12px',
          padding: '25px 30px',
          marginBottom: '30px',
          color: T.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              marginBottom: '8px',
              letterSpacing: '0.05em'
            }}>
              🎁 Loyalty Rewards Program
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px',
              opacity: 0.9,
              maxWidth: '500px',
              lineHeight: '1.6'
            }}>
              Earn 5 points for every order above ₹1,000 • 1 Point = ₹20 discount • 
              You have {qualifyingOrders} qualifying order{qualifyingOrders !== 1 ? 's' : ''}
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '15px 25px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '28px',
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              ₹{discountValue}
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '10px',
              opacity: 0.9,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Available Discount
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          background: T.white,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${T.border}`
          }}>
            {['orders', 'details', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '20px',
                  background: activeTab === tab ? T.rust : 'transparent',
                  color: activeTab === tab ? T.white : T.deepBrown,
                  border: 'none',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {tab === 'orders' ? 'Order History' : tab === 'details' ? 'Account Details' : 'Settings'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '30px' }}>
            {activeTab === 'orders' && (
              <div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '24px',
                  fontWeight: 300,
                  color: T.deepBrown,
                  marginBottom: '20px'
                }}>
                  Order History
                </h3>
                {orders.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: T.muted,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '14px'
                  }}>
                    No orders yet. Start shopping to see your order history here.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {orders.map((order, index) => (
                      <div key={index} style={{
                        border: `1px solid ${T.border}`,
                        borderRadius: '8px',
                        padding: '20px',
                        background: T.white
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '10px'
                        }}>
                          <div>
                            <div style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: '12px',
                              color: T.muted,
                              marginBottom: '4px'
                            }}>
                              Order #{index + 1}
                            </div>
                            <div style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: '18px',
                              fontWeight: 600,
                              color: T.deepBrown
                            }}>
                              ₹{(order.totalAmount || 0).toLocaleString()}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: '11px',
                              color: T.muted,
                              marginBottom: '4px'
                            }}>
                              {formatDate(order.orderDate)}
                            </div>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '10px',
                              fontWeight: 500,
                              background: order.status === 'pending' ? '#fff3cd' : 
                                           order.status === 'completed' ? '#d4edda' : '#f8d7da',
                              color: order.status === 'pending' ? '#856404' : 
                                     order.status === 'completed' ? '#155724' : '#721c24'
                            }}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '24px',
                  fontWeight: 300,
                  color: T.deepBrown,
                  marginBottom: '30px'
                }}>
                  Account Details
                </h3>
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
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
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${T.border}`,
                        borderRadius: '4px',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '14px',
                        background: '#f8f9fa'
                      }}
                    />
                  </div>
                  <div>
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
                      value={user.email}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${T.border}`,
                        borderRadius: '4px',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '14px',
                        background: '#f8f9fa'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '24px',
                  fontWeight: 300,
                  color: T.deepBrown,
                  marginBottom: '30px'
                }}>
                  Account Settings
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <button
                    onClick={onLogout}
                    style={{
                      background: 'none',
                      border: `1px solid ${T.rust}`,
                      color: T.rust,
                      padding: '12px 24px',
                      borderRadius: '4px',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '11px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      alignSelf: 'flex-start'
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
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Shopping */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => setPage('shop')}
            style={{
              background: T.deepBrown,
              color: T.white,
              border: 'none',
              padding: '14px 32px',
              borderRadius: '4px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={e => e.target.style.background = T.rust}
            onMouseLeave={e => e.target.style.background = T.deepBrown}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
