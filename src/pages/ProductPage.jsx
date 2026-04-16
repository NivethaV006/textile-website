import { useState } from "react";
import { T } from "../utils/styles";
import { fmt } from "../utils/constants";

export default function ProductPage({ product, onAdd, setPage, user }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  
  // Virtual Try-On states
  const [userPhoto, setUserPhoto] = useState(null);
  const [tryOnResult, setTryOnResult] = useState(null);
  const [tryOnLoading, setTryOnLoading] = useState(false);
  const [tryOnError, setTryOnError] = useState(null);
  const fabricScale = 0.5;

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: T.cream, paddingTop: '90px', textAlign: 'center', padding: '40px' }}>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>Product not found</p>
        <button 
          onClick={() => setPage('shop')}
          style={{ background: T.rust, color: T.white, border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer' }}
        >Back to Shop</button>
      </div>
    );
  }

  const stock = product.stock || 0;
  const availableColors = product.colorOptions || [];
  const maxQty = availableColors[selectedColor]?.quantity || stock;

  const handleAdd = () => {
    if (maxQty >= qty && qty > 0) {
      onAdd(product, qty, availableColors[selectedColor]?.colorLabel);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserPhoto(file);
      setTryOnResult(null);
      setTryOnError(null);
    }
  };

  const processVirtualTryOn = async () => {
    if (!userPhoto) {
      setTryOnError('Please upload your photo first');
      return;
    }

    setTryOnLoading(true);
    setTryOnError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', userPhoto);
      
      const imageUrl = product.image || product.images?.[0];
      if (imageUrl) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const fabricFile = new File([blob], 'fabric.jpg', { type: 'image/jpeg' });
        formData.append('pattern', fabricFile);
      }
      
      formData.append('scale', fabricScale.toString());

      const result = await fetch('http://127.0.0.1:5001/process', {
        method: 'POST',
        body: formData,
      });

      // Check if response is HTML (error page) instead of JSON
      const contentType = result.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await result.text();
        if (text.trim().startsWith('<')) {
          throw new Error('Avatar.ai server returned HTML instead of JSON. Server may not be running properly on port 5001.');
        }
        throw new Error('Invalid response from server: ' + text.substring(0, 100));
      }

      if (!result.ok) {
        throw new Error(`Server error: ${result.status} ${result.statusText}`);
      }

      const data = await result.json();

      if (data.success && data.variations && data.variations.length > 0) {
        setTryOnResult(data.variations[1]?.image || data.variations[0]?.image);
      } else {
        setTryOnError(data.error || 'Failed to process image. Please try again.');
      }
    } catch (error) {
      console.error('Virtual try-on error:', error);
      setTryOnError('Avatar.ai server not running. Please start the server at localhost:5001');
    } finally {
      setTryOnLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.cream }}>
      {/* Breadcrumb Bar */}
      <div style={{ paddingTop: '80px', background: T.white, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Mono',monospace", fontSize: '11px', color: T.muted }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setPage('home')}>Home</span>
            <span>/</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setPage('shop')}>Shop</span>
            <span>/</span>
            <span style={{ color: T.deepBrown }}>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '60px',
          background: T.white,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
        }}>
          {/* Left - Product Image */}
          <div style={{ position: 'relative', background: '#F8F8F8' }}>
            <div style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              background: T.deepBrown,
              color: T.sand,
              padding: '8px 16px',
              borderRadius: '20px',
              fontFamily: "'DM Mono',monospace",
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              zIndex: 10
            }}>
              {product.fabricType || product.category}
            </div>
            
            {stock <= 10 && stock > 0 && (
              <div style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: '#FF9800',
                color: T.white,
                padding: '8px 16px',
                borderRadius: '20px',
                fontFamily: "'DM Mono',monospace",
                fontSize: '10px',
                fontWeight: 600,
                zIndex: 10
              }}>
                Only {stock} left
              </div>
            )}

            <div style={{
              height: '600px',
              background: product.image ? `url(${product.image})` : '#E8E8E8',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />
          </div>

          {/* Right - Product Details */}
          <div style={{ padding: '48px', display: 'flex', flexDirection: 'column' }}>
            {/* Category & Title */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ 
                fontFamily: "'DM Mono',monospace", 
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: T.rust,
                marginBottom: '12px'
              }}>
                {product.category}
              </p>
              <h1 style={{ 
                fontFamily: "'Cormorant Garamond',serif", 
                fontSize: '42px',
                fontWeight: 400,
                color: T.deepBrown,
                lineHeight: 1.2,
                margin: 0
              }}>
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: `1px solid ${T.border}` }}>
              <span style={{ 
                fontFamily: "'Cormorant Garamond',serif", 
                fontSize: '36px',
                fontWeight: 600,
                color: T.rust
              }}>
                {fmt(product.price)}
              </span>
              <span style={{ 
                fontFamily: "'DM Mono',monospace", 
                fontSize: '14px',
                color: T.muted,
                marginLeft: '8px'
              }}>
                per {product.unit}
              </span>
            </div>

            {/* Description */}
            <p style={{ 
              fontFamily: "'DM Mono',monospace", 
              fontSize: '13px',
              lineHeight: 1.8,
              color: T.muted,
              marginBottom: '32px'
            }}>
              Premium {product.fabricType || product.category} fabric, carefully crafted for elegance and durability. 
              Perfect for traditional and contemporary designs.
            </p>

            {/* Specifications Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '16px',
              marginBottom: '32px',
              padding: '20px',
              background: T.cream,
              borderRadius: '12px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: T.muted, marginBottom: '4px' }}>WIDTH</p>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '14px', color: T.deepBrown, fontWeight: 600 }}>{product.width || 44}"</p>
              </div>
              <div style={{ textAlign: 'center', borderLeft: `1px solid ${T.border}`, borderRight: `1px solid ${T.border}` }}>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: T.muted, marginBottom: '4px' }}>WEIGHT</p>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '14px', color: T.deepBrown, fontWeight: 600 }}>{product.gsm || 120} GSM</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: T.muted, marginBottom: '4px' }}>STOCK</p>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '14px', color: stock < 10 ? '#FF9800' : T.deepBrown, fontWeight: 600 }}>{stock}m</p>
              </div>
            </div>

            {/* Color Options */}
            {availableColors.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ 
                  fontFamily: "'DM Mono',monospace", 
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: T.deepBrown,
                  marginBottom: '12px'
                }}>
                  Select Color
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {availableColors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedColor(index);
                        setQty(1);
                      }}
                      style={{
                        padding: '12px 20px',
                        border: selectedColor === index ? `2px solid ${T.rust}` : `1px solid ${T.border}`,
                        background: selectedColor === index ? '#FFF8F5' : T.white,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontFamily: "'DM Mono',monospace",
                        fontSize: '12px',
                        color: T.deepBrown,
                        transition: 'all 0.2s'
                      }}
                    >
                      {color.colorLabel}
                      <span style={{ color: T.muted, marginLeft: '6px' }}>({color.quantity}m)</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ 
                fontFamily: "'DM Mono',monospace", 
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: T.deepBrown,
                marginBottom: '12px'
              }}>
                Quantity (Metres)
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${T.border}`,
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    disabled={maxQty === 0}
                    style={{
                      width: '44px',
                      height: '44px',
                      background: 'none',
                      border: 'none',
                      cursor: maxQty === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '18px',
                      color: T.deepBrown
                    }}
                  >
                    −
                  </button>
                  <span style={{
                    width: '60px',
                    textAlign: 'center',
                    fontFamily: "'DM Mono',monospace",
                    fontSize: '16px',
                    color: T.deepBrown,
                    fontWeight: 600
                  }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                    disabled={maxQty === 0 || qty >= maxQty}
                    style={{
                      width: '44px',
                      height: '44px',
                      background: 'none',
                      border: 'none',
                      cursor: maxQty === 0 || qty >= maxQty ? 'not-allowed' : 'pointer',
                      fontSize: '18px',
                      color: T.deepBrown
                    }}
                  >
                    +
                  </button>
                </div>
                <span style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: '24px',
                  color: T.rust,
                  fontWeight: 600
                }}>
                  = {fmt(product.price * qty)}
                </span>
              </div>
              {maxQty < qty && maxQty > 0 && (
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '12px', color: '#FF9800', marginTop: '8px' }}>
                  Only {maxQty} metres available
                </p>
              )}
            </div>

            {/* Add to Cart */}
            {!user ? (
              <div style={{
                padding: '20px',
                background: '#FFF8F5',
                border: `1px solid ${T.border}`,
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '13px', color: T.deepBrown, marginBottom: '12px' }}>
                  Please sign in to add items to your cart
                </p>
                <button
                  onClick={() => setPage('home')}
                  style={{
                    background: T.rust,
                    color: T.white,
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: "'DM Mono',monospace",
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                >
                  Sign In
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                disabled={maxQty === 0 || maxQty < qty}
                style={{
                  background: added ? '#4A7C59' : (maxQty === 0 || maxQty < qty ? '#999' : T.rust),
                  color: T.white,
                  border: 'none',
                  padding: '18px 40px',
                  borderRadius: '8px',
                  cursor: maxQty === 0 || maxQty < qty ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Mono',monospace",
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  transition: 'all 0.3s',
                  width: '100%'
                }}
              >
                {maxQty === 0 ? 'Out of Stock' : (maxQty < qty ? 'Insufficient Stock' : (added ? '✓ Added to Cart' : 'Add to Cart'))}
              </button>
            )}

            {/* SKU */}
            {product.sku && (
              <p style={{ 
                fontFamily: "'DM Mono',monospace", 
                fontSize: '11px',
                color: T.muted,
                marginTop: '16px',
                textAlign: 'center'
              }}>
                SKU: {product.sku}
              </p>
            )}
          </div>
        </div>

        {/* Virtual Try-On Section */}
        <div style={{ marginTop: '60px' }}>
          <div style={{
            background: T.white,
            borderRadius: '16px',
            padding: '48px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: '32px',
                color: T.deepBrown,
                marginBottom: '12px'
              }}>
                Virtual Try-On
              </h2>
              <p style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: '14px',
                color: T.muted,
                maxWidth: '500px',
                margin: '0 auto',
                lineHeight: 1.6
              }}>
                Upload your photo and see how this fabric looks on you with our AI technology
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              {/* Upload Section */}
              <div style={{
                padding: '32px',
                background: T.cream,
                borderRadius: '12px',
                border: `2px dashed ${T.border}`
              }}>
                <h3 style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: '16px',
                  color: T.deepBrown,
                  marginBottom: '20px'
                }}>
                  Step 1: Upload Your Photo
                </h3>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  id="tryon-upload"
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="tryon-upload"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '40px 20px',
                    background: T.white,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ fontSize: '48px' }}>📷</div>
                  <span style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: '14px',
                    color: T.deepBrown,
                    fontWeight: 600
                  }}>
                    {userPhoto ? 'Change Photo' : 'Click to Upload Photo'}
                  </span>
                  <span style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: '11px',
                    color: T.muted
                  }}>
                    Supports JPG, PNG
                  </span>
                </label>

                {userPhoto && (
                  <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: T.white,
                    borderRadius: '8px'
                  }}>
                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '13px', color: T.deepBrown }}>
                      ✓ {userPhoto.name}
                    </p>
                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', color: T.muted, marginTop: '4px' }}>
                      Scale: 0.5x
                    </p>
                  </div>
                )}

                {userPhoto && (
                  <button
                    onClick={processVirtualTryOn}
                    disabled={tryOnLoading}
                    style={{
                      width: '100%',
                      marginTop: '20px',
                      background: tryOnLoading ? T.muted : T.deepBrown,
                      color: T.white,
                      border: 'none',
                      padding: '16px',
                      borderRadius: '8px',
                      cursor: tryOnLoading ? 'not-allowed' : 'pointer',
                      fontFamily: "'DM Mono',monospace",
                      fontSize: '14px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}
                  >
                    {tryOnLoading ? '⏳ Processing...' : '✨ Generate Preview'}
                  </button>
                )}

                {tryOnError && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: '#FFEBEE',
                    borderRadius: '8px',
                    color: '#C62828',
                    fontFamily: "'DM Mono',monospace",
                    fontSize: '12px'
                  }}>
                    {tryOnError}
                  </div>
                )}
              </div>

              {/* Result Section */}
              <div style={{
                padding: '32px',
                background: T.cream,
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px'
              }}>
                <h3 style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: '16px',
                  color: T.deepBrown,
                  marginBottom: '20px'
                }}>
                  Step 2: View Result
                </h3>

                {tryOnResult ? (
                  <div style={{ width: '100%' }}>
                    <img
                      src={tryOnResult}
                      alt="Virtual Try-On"
                      style={{
                        width: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <p style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: '12px',
                      color: T.muted,
                      textAlign: 'center',
                      marginTop: '12px'
                    }}>
                      AI-generated preview
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>👕</div>
                    <p style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: '13px',
                      color: T.muted
                    }}>
                      Your virtual try-on result will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
