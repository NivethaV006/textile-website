import { useState } from 'react';
import { T } from '../utils/styles';

export default function RazorpayPayment({ amount, customerInfo, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => {
    setLoading(true);
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      try {
        const options = {
          key: 'rzp_test_SVWpwsciYYhx2O', // Your test key
          amount: amount * 100, // Amount in paise (₹500 = 50000 paise)
          currency: 'INR',
          name: 'SRI MURUGAN TEX',
          description: 'Purchase of premium fabrics',
          image: '',
          handler: function (response) {
            // Payment successful
            if (response.razorpay_payment_id) {
              onSuccess({
                razorpay_payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature
              });
            } else {
              throw new Error('Payment failed');
            }
            setLoading(false);
          },
          prefill: {
            name: customerInfo.name,
            email: customerInfo.email || '',
            contact: customerInfo.phone
          },
          notes: {
            address: customerInfo.address,
            city: customerInfo.city,
            pincode: customerInfo.pin
          },
          theme: {
            color: T.rust,
            backdrop_color: T.charcoal
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              onClose();
            },
            escape: function() {
              setLoading(false);
              onClose();
            },
            confirmclose: true,
            handleback: true
          }
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          throw new Error('Razorpay SDK not loaded');
        }
      } catch (error) {
        console.error('Razorpay initialization error:', error);
        setLoading(false);
        alert('Payment initialization failed. Please try again.');
      }
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      setLoading(false);
      alert('Payment service unavailable. Please try again later.');
    };

    document.body.appendChild(script);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <button
        onClick={loadRazorpay}
        disabled={loading}
        style={{
          background: loading ? T.muted : T.rust,
          color: T.white,
          border: 'none',
          fontFamily: "'DM Mono', monospace",
          fontSize: '12px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '16px 32px',
          cursor: loading ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
          transition: 'all 0.3s ease',
          minWidth: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
        onMouseEnter={e => !loading && (e.target.style.background = T.deepBrown)}
        onMouseLeave={e => !loading && (e.target.style.background = T.rust)}
      >
        {loading ? (
          <>
            <div style={{
              width: '16px',
              height: '16px',
              border: `2px solid ${T.white}`,
              borderRadius: '50%',
              borderTop: 'transparent',
              animation: 'spin 1s linear infinite'
            }} />
            Processing...
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 20c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-9 7l-3 3.86L4.83 12H4v2h2.83l3.17-1.86L11 18V11z"/>
            </svg>
            Pay with Razorpay
          </>
        )}
      </button>
      
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '10px',
        color: T.muted,
        marginTop: '12px',
        textAlign: 'center'
      }}>
        <p>Secure payment powered by Razorpay</p>
        <p style={{ marginTop: '4px' }}>Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
}
