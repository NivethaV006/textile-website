import { useState } from 'react';
import { T } from '../utils/styles';
import { fmt } from '../utils/constants';
import RazorpayPayment from '../components/RazorpayPayment';

export default function PaymentPage({ cart, selectedAddress, onOrderComplete, setPage }) {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [showRazorpay, setShowRazorpay] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePayment = async () => {
    // For online payments (UPI/Card), show Razorpay
    if (paymentMethod === 'upi' || paymentMethod === 'card') {
      setShowRazorpay(true);
      return;
    }
    
    // For COD, simulate payment processing
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    completeOrder();
  };

  const completeOrder = (paymentDetails = null) => {
    // Create order
    const order = {
      id: Date.now(),
      items: cart,
      totalAmount: total,
      address: selectedAddress,
      paymentMethod: paymentMethod,
      status: 'confirmed',
      orderDate: new Date().toISOString(),
      paymentDetails: paymentDetails
    };
    
    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    setLoading(false);
    setOrderSuccess(true);
    
    // Clear cart after successful order
    onOrderComplete();
  };

  if (orderSuccess) {
    return (
      <div style={{ minHeight: '100vh', background: T.cream, paddingTop: '90px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: T.deepBrown, marginBottom: '16px' }}>
            Order Placed Successfully!
          </h2>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: T.muted, marginBottom: '30px' }}>
            Thank you for shopping with SRI MURUGAN TEX. Your order has been confirmed.
          </p>
          <div style={{ background: T.white, borderRadius: '12px', padding: '30px', marginBottom: '30px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: T.muted, marginBottom: '8px' }}>
              Order Total
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: T.rust, fontWeight: 600 }}>
              {fmt(total)}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: T.muted, marginTop: '8px' }}>
              Paid via {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI' : 'Card'}
            </div>
          </div>
          <button
            onClick={() => setPage('home')}
            style={{
              background: T.rust,
              color: T.white,
              border: 'none',
              padding: '14px 32px',
              borderRadius: '4px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: T.cream, paddingTop: '90px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: T.deepBrown, marginBottom: '30px' }}>
          Payment
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
          {/* Left Column - Payment Methods */}
          <div>
            <div style={{ background: T.white, borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', color: T.deepBrown, marginBottom: '20px' }}>
                Select Payment Method
              </h3>

              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                style={{
                  padding: '16px',
                  border: `2px solid ${paymentMethod === 'cod' ? T.rust : T.border}`,
                  borderRadius: '8px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  background: paymentMethod === 'cod' ? '#FFF8F5' : T.white,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '24px' }}>💵</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: T.deepBrown, fontWeight: 500 }}>
                    Cash on Delivery
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: T.muted }}>
                    Pay when you receive
                  </div>
                </div>
                {paymentMethod === 'cod' && <div style={{ color: T.rust, fontSize: '20px' }}>✓</div>}
              </div>

              {/* UPI Payment */}
              <div
                onClick={() => setPaymentMethod('upi')}
                style={{
                  padding: '16px',
                  border: `2px solid ${paymentMethod === 'upi' ? T.rust : T.border}`,
                  borderRadius: '8px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  background: paymentMethod === 'upi' ? '#FFF8F5' : T.white,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '24px' }}>📱</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: T.deepBrown, fontWeight: 500 }}>
                    UPI Payment
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: T.muted }}>
                    Google Pay, PhonePe, Paytm
                  </div>
                </div>
                {paymentMethod === 'upi' && <div style={{ color: T.rust, fontSize: '20px' }}>✓</div>}
              </div>

              {paymentMethod === 'upi' && (
                <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g., name@upi)"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${T.border}`,
                      borderRadius: '6px',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}

              {/* Card Payment */}
              <div
                onClick={() => setPaymentMethod('card')}
                style={{
                  padding: '16px',
                  border: `2px solid ${paymentMethod === 'card' ? T.rust : T.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: paymentMethod === 'card' ? '#FFF8F5' : T.white,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '24px' }}>💳</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: T.deepBrown, fontWeight: 500 }}>
                    Credit / Debit Card
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: T.muted }}>
                    Visa, Mastercard, RuPay
                  </div>
                </div>
                {paymentMethod === 'card' && <div style={{ color: T.rust, fontSize: '20px' }}>✓</div>}
              </div>

              {paymentMethod === 'card' && (
                <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    placeholder="Card Number"
                    maxLength="16"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${T.border}`,
                      borderRadius: '6px',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    placeholder="Card Holder Name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${T.border}`,
                      borderRadius: '6px',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '14px'
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      placeholder="MM/YY"
                      maxLength="5"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${T.border}`,
                        borderRadius: '6px',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '14px'
                      }}
                    />
                    <input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      placeholder="CVV"
                      maxLength="3"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${T.border}`,
                        borderRadius: '6px',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Razorpay Payment UI */}
              {showRazorpay && (paymentMethod === 'upi' || paymentMethod === 'card') && (
                <div style={{ marginTop: '24px', padding: '20px', background: T.cream, borderRadius: '8px', border: `1px solid ${T.border}` }}>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: '14px', color: T.deepBrown, marginBottom: '16px', textAlign: 'center' }}>
                    Complete Secure Payment
                  </h4>
                  <RazorpayPayment
                    amount={total}
                    customerInfo={{
                      name: selectedAddress?.fullAddress?.split(',')[0] || 'Customer',
                      phone: '',
                      address: selectedAddress?.fullAddress,
                      city: selectedAddress?.city,
                      pin: selectedAddress?.pincode
                    }}
                    onSuccess={(paymentDetails) => {
                      completeOrder(paymentDetails);
                    }}
                    onError={(error) => {
                      console.error('Payment failed:', error);
                      setShowRazorpay(false);
                    }}
                    onClose={() => setShowRazorpay(false)}
                  />
                </div>
              )}
            </div>

            {/* Back to Cart */}
            <button
              onClick={() => setPage('cart')}
              style={{
                background: 'none',
                border: 'none',
                color: T.rust,
                cursor: 'pointer',
                fontFamily: "'DM Mono', monospace",
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              ← Back to Cart
            </button>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div style={{ background: T.white, borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', color: T.deepBrown, marginBottom: '20px' }}>
                Order Summary
              </h3>
              
              {/* Items Summary */}
              <div style={{ marginBottom: '16px', maxHeight: '200px', overflow: 'auto' }}>
                {cart.map((item) => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>
                    <span style={{ color: T.muted }}>
                      {item.name} x {item.quantity}
                    </span>
                    <span style={{ color: T.deepBrown }}>
                      {fmt(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.muted }}>
                    Subtotal ({itemCount} items)
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.deepBrown }}>
                    {fmt(total)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.muted }}>
                    Shipping
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.deepBrown }}>
                    Free
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.muted }}>
                    Taxes
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.deepBrown }}>
                    Included
                  </span>
                </div>
              </div>

              <div style={{ borderTop: `2px solid ${T.border}`, paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', color: T.deepBrown, fontWeight: 600 }}>
                    Total
                  </span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: T.rust, fontWeight: 600 }}>
                    {fmt(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ background: T.white, borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: T.muted, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Deliver To
              </h4>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.deepBrown, lineHeight: '1.5' }}>
                {selectedAddress?.fullAddress}
              </p>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={loading || showRazorpay}
              style={{
                width: '100%',
                background: showRazorpay ? T.muted : T.rust,
                color: T.white,
                border: 'none',
                padding: '18px',
                borderRadius: '8px',
                fontFamily: "'DM Mono', monospace",
                fontSize: '14px',
                fontWeight: 600,
                cursor: (loading || showRazorpay) ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                opacity: (loading || showRazorpay) ? 0.7 : 1
              }}
            >
              {loading ? '⏳ Processing...' : showRazorpay ? 'Complete Payment Below' : `Pay ${fmt(total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
