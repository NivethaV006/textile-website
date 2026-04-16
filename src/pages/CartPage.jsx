import { useState, useEffect } from 'react';
import { T } from '../utils/styles';
import { fmt } from '../utils/constants';

export default function CartPage({ cart, onUpdateQuantity, onRemove, onCheckout, setPage }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    doorNumber: '',
    street: '',
    area: '',
    city: '',
    pincode: ''
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingPincode, setLoadingPincode] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Load saved addresses from localStorage
  useEffect(() => {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      const parsed = JSON.parse(savedAddresses);
      setAddresses(parsed);
      if (parsed.length > 0 && !selectedAddress) {
        setSelectedAddress(parsed[0]);
      }
    }
  }, []);

  // Save addresses to localStorage
  const saveAddresses = (newAddresses) => {
    setAddresses(newAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(newAddresses));
  };

  // Fetch location from browser geolocation
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding using OpenStreetMap Nominatim
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            setNewAddress(prev => ({
              ...prev,
              street: addr.road || addr.suburb || '',
              area: addr.suburb || addr.neighbourhood || addr.locality || '',
              city: addr.city || addr.town || addr.district || '',
              pincode: addr.postcode || ''
            }));
          }
        } catch (error) {
          console.error('Error fetching location:', error);
          alert('Could not fetch location details. Please enter manually.');
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        setLoadingLocation(false);
        alert('Location access denied. Please enable location access or enter address manually.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Fetch address details from pincode using India Post API
  const fetchAddressByPincode = async (pincode) => {
    if (pincode.length !== 6) return;
    
    setLoadingPincode(true);
    try {
      // Using India Post Pincode API
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const office = data[0].PostOffice[0];
        setNewAddress(prev => ({
          ...prev,
          city: office.District || office.Block || '',
          area: office.Name || office.BranchType || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching pincode details:', error);
    } finally {
      setLoadingPincode(false);
    }
  };

  // Handle pincode change with auto-fetch
  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    setNewAddress(prev => ({ ...prev, pincode }));
    
    if (pincode.length === 6) {
      fetchAddressByPincode(pincode);
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const address = {
      id: Date.now(),
      ...newAddress,
      fullAddress: `${newAddress.doorNumber}, ${newAddress.street}, ${newAddress.area}, ${newAddress.city} - ${newAddress.pincode}`
    };
    const updatedAddresses = [...addresses, address];
    saveAddresses(updatedAddresses);
    setSelectedAddress(address);
    setShowAddAddress(false);
    setNewAddress({ doorNumber: '', street: '', area: '', city: '', pincode: '' });
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(addr => addr.id !== id);
    saveAddresses(updated);
    if (selectedAddress?.id === id) {
      setSelectedAddress(updated.length > 0 ? updated[0] : null);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: T.cream, paddingTop: '90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: T.deepBrown, marginBottom: '16px' }}>
            Your Cart is Empty
          </h2>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: T.muted, marginBottom: '30px' }}>
            Add some beautiful fabrics to get started
          </p>
          <button
            onClick={() => setPage('shop')}
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
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: T.deepBrown, marginBottom: '8px' }}>
            Shopping Cart
          </h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: T.muted }}>
            {itemCount} item{itemCount !== 1 ? 's' : ''} • {cart.length} product{cart.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
          {/* Left Column - Cart Items */}
          <div>
            {/* Cart Items List */}
            <div style={{ background: T.white, borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
              {cart.map((item) => (
                <div key={item._id} style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '20px 0',
                  borderBottom: `1px solid ${T.border}`,
                  ':last-child': { borderBottom: 'none' }
                }}>
                  {/* Product Image - Fixed to use item.image */}
                  <div style={{
                    width: '100px',
                    height: '100px',
                    background: item.image ? `url(${item.image})` : '#E8E8E8',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px',
                    flexShrink: 0
                  }}/>

                  {/* Product Details */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: T.deepBrown, marginBottom: '8px' }}>
                      {item.name}
                    </h3>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: T.muted, marginBottom: '12px' }}>
                      {item.category} • {item.fabricType || 'Standard Fabric'}
                    </p>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: T.rust, fontWeight: 600 }}>
                      {fmt(item.price)} / {item.unit}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <button
                        onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: `1px solid ${T.border}`,
                          background: T.white,
                          cursor: 'pointer',
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      >
                        −
                      </button>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', minWidth: '30px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: `1px solid ${T.border}`,
                          background: T.white,
                          cursor: 'pointer',
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: T.deepBrown, fontWeight: 600, marginBottom: '8px' }}>
                      {fmt(item.price * item.quantity)}
                    </div>
                    <button
                      onClick={() => onRemove(item._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: T.rust,
                        cursor: 'pointer',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <button
              onClick={() => setPage('shop')}
              style={{
                background: 'none',
                border: `1px solid ${T.rust}`,
                color: T.rust,
                padding: '12px 24px',
                borderRadius: '4px',
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              ← Continue Shopping
            </button>
          </div>

          {/* Right Column - Address & Summary */}
          <div>
            {/* Delivery Address Section */}
            <div style={{ background: T.white, borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', color: T.deepBrown }}>
                  📍 Delivery Address
                </h3>
                {addresses.length > 0 && (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: T.rust,
                      cursor: 'pointer',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '11px'
                    }}
                  >
                    + Add New
                  </button>
                )}
              </div>

              {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: T.muted, marginBottom: '16px' }}>
                    No delivery address found
                  </p>
                  <button
                    onClick={() => setShowAddAddress(true)}
                    style={{
                      background: T.rust,
                      color: T.white,
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '4px',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '11px',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div>
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      style={{
                        padding: '16px',
                        border: `2px solid ${selectedAddress?.id === addr.id ? T.rust : T.border}`,
                        borderRadius: '8px',
                        marginBottom: '12px',
                        cursor: 'pointer',
                        background: selectedAddress?.id === addr.id ? '#FFF8F5' : T.white
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.deepBrown, lineHeight: '1.5' }}>
                            {addr.fullAddress}
                          </p>
                          {selectedAddress?.id === addr.id && (
                            <span style={{
                              display: 'inline-block',
                              marginTop: '8px',
                              padding: '4px 12px',
                              background: T.rust,
                              color: T.white,
                              borderRadius: '4px',
                              fontFamily: "'DM Mono', monospace",
                              fontSize: '10px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em'
                            }}>
                              Selected
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: T.muted,
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: '4px'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div style={{ background: T.white, borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', color: T.deepBrown, marginBottom: '20px' }}>
                Order Summary
              </h3>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.muted }}>
                    Subtotal ({itemCount} items)
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.deepBrown }}>
                    {fmt(total)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.muted }}>
                    Shipping
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.deepBrown }}>
                    Free
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.muted }}>
                    Taxes
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: T.deepBrown }}>
                    Calculated at checkout
                  </span>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', color: T.deepBrown, fontWeight: 600 }}>
                    Total
                  </span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: T.rust, fontWeight: 600 }}>
                    {fmt(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => onCheckout(selectedAddress)}
              disabled={!selectedAddress}
              style={{
                width: '100%',
                background: selectedAddress ? T.rust : T.muted,
                color: T.white,
                border: 'none',
                padding: '16px',
                borderRadius: '8px',
                fontFamily: "'DM Mono', monospace",
                fontSize: '13px',
                fontWeight: 600,
                cursor: selectedAddress ? 'pointer' : 'not-allowed',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                transition: 'background 0.3s'
              }}
            >
              {selectedAddress ? 'Proceed to Checkout' : 'Add Address to Continue'}
            </button>

            {!selectedAddress && (
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: T.rust, textAlign: 'center', marginTop: '12px' }}>
                Please select or add a delivery address
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddAddress && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: T.white,
            padding: '32px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', color: T.deepBrown }}>
                Add Delivery Address
              </h3>
              <button
                onClick={() => setShowAddAddress(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: T.muted }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress}>
              {/* Use Current Location Button */}
              <button
                type="button"
                onClick={detectCurrentLocation}
                disabled={loadingLocation}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '20px',
                  border: `1px solid ${T.rust}`,
                  background: T.white,
                  color: T.rust,
                  borderRadius: '6px',
                  cursor: loadingLocation ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => { if (!loadingLocation) { e.target.style.background = T.rust; e.target.style.color = T.white; }}}
                onMouseLeave={e => { if (!loadingLocation) { e.target.style.background = T.white; e.target.style.color = T.rust; }}}
              >
                {loadingLocation ? '⏳ Detecting Location...' : '📍 Use Current Location'}
              </button>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: T.muted, marginBottom: '6px', textTransform: 'uppercase' }}>
                  Door / Flat Number
                </label>
                <input
                  type="text"
                  value={newAddress.doorNumber}
                  onChange={(e) => setNewAddress({...newAddress, doorNumber: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', border: `1px solid ${T.border}`, borderRadius: '6px', fontFamily: "'DM Mono', monospace" }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: T.muted, marginBottom: '6px', textTransform: 'uppercase' }}>
                  Street
                </label>
                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', border: `1px solid ${T.border}`, borderRadius: '6px', fontFamily: "'DM Mono', monospace" }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: T.muted, marginBottom: '6px', textTransform: 'uppercase' }}>
                  Area / Locality
                </label>
                <input
                  type="text"
                  value={newAddress.area}
                  onChange={(e) => setNewAddress({...newAddress, area: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', border: `1px solid ${T.border}`, borderRadius: '6px', fontFamily: "'DM Mono', monospace" }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: T.muted, marginBottom: '6px', textTransform: 'uppercase' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    required
                    style={{ width: '100%', padding: '12px', border: `1px solid ${T.border}`, borderRadius: '6px', fontFamily: "'DM Mono', monospace" }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: T.muted, marginBottom: '6px', textTransform: 'uppercase' }}>
                    Pincode {loadingPincode && '⏳'}
                  </label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={handlePincodeChange}
                    required
                    pattern="[0-9]{6}"
                    maxLength="6"
                    placeholder="600001"
                    style={{ width: '100%', padding: '12px', border: `1px solid ${T.border}`, borderRadius: '6px', fontFamily: "'DM Mono', monospace" }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: `1px solid ${T.border}`,
                    background: T.white,
                    color: T.deepBrown,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: "'DM Mono', monospace"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: 'none',
                    background: T.rust,
                    color: T.white,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 600
                  }}
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
