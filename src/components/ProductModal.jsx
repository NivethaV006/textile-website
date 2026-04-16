import { useState } from "react";
import { T } from "../utils/styles";
import { fmt } from "../utils/constants";

export default function ProductModal({ product, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  
  // Virtual Try-On states
  const [showTryOn, setShowTryOn] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [tryOnResult, setTryOnResult] = useState(null);
  const [tryOnLoading, setTryOnLoading] = useState(false);
  const [tryOnError, setTryOnError] = useState(null);
  
  if (!product) return null;
  
  const stock = product.stock || 0;
  const availableColors = product.colorOptions || [];
  const maxQty = availableColors[selectedColor]?.quantity || stock;

  const handleAdd = () => {
    if (maxQty >= qty && qty > 0) {
      for(let i=0;i<qty;i++) onAdd(product);
      setAdded(true);
      setTimeout(()=>setAdded(false),2000);
    }
  };

  // Handle photo upload for virtual try-on
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserPhoto(file);
      setTryOnResult(null);
      setTryOnError(null);
    }
  };

  // Call Avatar.ai API for virtual try-on
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
      
      // Fetch the product image and convert to file
      const imageUrl = product.image || product.images?.[0];
      if (imageUrl) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const fabricFile = new File([blob], 'fabric.jpg', { type: 'image/jpeg' });
        formData.append('pattern', fabricFile);
      }
      
      formData.append('scale', '1.0');

      // Call Avatar.ai Flask server
      const result = await fetch('http://localhost:5001/process', {
        method: 'POST',
        body: formData,
      });

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
    <div style={{
      position:"fixed", inset:0, zIndex:800,
      background:"rgba(42,37,32,0.7)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:20,
      animation:"fadeIn 0.2s ease",
      backdropFilter:"blur(4px)",
    }} onClick={onClose}>
      <div style={{
        background:T.white, maxWidth:860,
        width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr",
        animation:"fadeUp 0.35s ease",
        maxHeight:"90vh", overflow:"auto",
      }} onClick={e=>e.stopPropagation()}>
        {/* Image */}
        <div style={{
          background: product.image ? `url(${product.image})` : (product.images?.[0] ? `url(${product.images[0]})` : '#E8E8E8'),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight:460,
          position:"relative", overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", inset:0,
            backgroundImage:`
              repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(0,0,0,0.05) 12px, rgba(0,0,0,0.05) 13px),
              repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(0,0,0,0.03) 12px, rgba(0,0,0,0.03) 13px)
            `,
          }}/>
          <div style={{
            position:"absolute", top:20, left:20,
            background:T.deepBrown, color:T.sand,
            fontFamily:"'DM Mono',monospace", fontSize:9,
            letterSpacing:"0.25em", textTransform:"uppercase",
            padding:"5px 12px",
          }}>
            {product.fabricType || product.category}
          </div>
          {stock <= 10 && (
            <div style={{
              position:"absolute", top:20, right:20,
              background: stock === 0 ? '#D32F2F' : '#FF9800', color:T.white,
              fontFamily:"'DM Mono',monospace", fontSize:9,
              letterSpacing:"0.15em", textTransform:"uppercase",
              padding:"4px 8px",
            }}>
              {stock === 0 ? 'Out of Stock' : `Only ${stock} left`}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{padding:"40px 36px", display:"flex", flexDirection:"column", gap:20}}>
          <button onClick={onClose} style={{
            alignSelf:"flex-end", background:"none", border:"none",
            fontSize:20, cursor:"pointer", color:T.muted, lineHeight:1,
          }}>✕</button>

          <div>
            <div style={{
              fontFamily:"'DM Mono',monospace", fontSize:9,
              letterSpacing:"0.3em", textTransform:"uppercase",
              color:T.rust, marginBottom:8,
            }}>
              {product.category}
            </div>
            <h2 style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:34, fontWeight:300, color:T.deepBrown, lineHeight:1.1,
            }}>
              {product.name}
            </h2>
          </div>

          <div style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:28, fontWeight:600, color:T.rust,
          }}>
            {fmt(product.price)} <span style={{fontSize:13,fontFamily:"'DM Mono',monospace",color:T.muted,fontWeight:400}}>/ {product.unit}</span>
          </div>

          <p style={{
            fontFamily:"'DM Mono',monospace", fontSize:11,
            lineHeight:1.9, color:T.muted,
          }}>
            Premium {product.fabricType || product.category} fabric. {product.sku && `SKU: ${product.sku}`}
          </p>

          <div style={{borderTop:`1px solid ${T.border}`, paddingTop:16}}>
            <div style={{
              fontFamily:"'DM Mono',monospace", fontSize:9,
              letterSpacing:"0.25em", textTransform:"uppercase",
              color:T.deepBrown, marginBottom:10,
            }}>
              Specifications
            </div>
            <div style={{
              display:"flex", gap:8, alignItems:"center",
              fontFamily:"'DM Mono',monospace", fontSize:11,
              color:T.muted, marginBottom:6,
            }}>
              <span style={{color:T.rust}}>—</span> Width: {product.width || 44} inches
            </div>
            <div style={{
              display:"flex", gap:8, alignItems:"center",
              fontFamily:"'DM Mono',monospace", fontSize:11,
              color:T.muted, marginBottom:6,
            }}>
              <span style={{color:T.rust}}>—</span> Weight: {product.gsm || 120} GSM
            </div>
            <div style={{
              display:"flex", gap:8, alignItems:"center",
              fontFamily:"'DM Mono',monospace", fontSize:11,
              color:T.muted, marginBottom:6,
            }}>
              <span style={{color:T.rust}}>—</span> Stock: {stock} metres available
            </div>
            {product.sku && (
              <div style={{
                display:"flex", gap:8, alignItems:"center",
                fontFamily:"'DM Mono',monospace", fontSize:11,
                color:T.muted, marginBottom:6,
              }}>
                <span style={{color:T.rust}}>—</span> SKU: {product.sku}
              </div>
            )}
          </div>
          
          {/* Color Options */}
          {availableColors.length > 0 && (
            <div style={{borderTop:`1px solid ${T.border}`, paddingTop:16}}>
              <div style={{
                fontFamily:"'DM Mono',monospace", fontSize:9,
                letterSpacing:"0.25em", textTransform:"uppercase",
                color:T.deepBrown, marginBottom:10,
              }}>
                Available Colors
              </div>
              <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
                {availableColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedColor(index);
                      setQty(1);
                    }}
                    style={{
                      padding:"8px 16px",
                      border: selectedColor === index ? `2px solid ${T.rust}` : `1px solid ${T.border}`,
                      background: selectedColor === index ? T.cream : T.white,
                      fontFamily:"'DM Mono',monospace", fontSize:10,
                      cursor:"pointer",
                      transition:"all 0.2s",
                    }}
                  >
                    {color.colorLabel} ({color.quantity}m)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <div style={{
              fontFamily:"'DM Mono',monospace", fontSize:9,
              letterSpacing:"0.2em", textTransform:"uppercase",
              color:T.muted, width:60,
            }}>
              Metres
            </div>
            <div style={{
              display:"flex", alignItems:"center", gap:0,
              border:`1px solid ${T.border}`,
            }}>
              <button 
                onClick={()=>setQty(q=>Math.max(1,q-1))} 
                disabled={maxQty === 0}
                style={{
                  width:36,height:36,background:"none",border:"none",
                  cursor:maxQty === 0 ? "not-allowed" : "pointer",fontSize:16,color:T.deepBrown,
                }}
              >
                −
              </button>
              <span style={{
                width:44, textAlign:"center",
                fontFamily:"'DM Mono',monospace", fontSize:13,
                color:T.deepBrown,
              }}>
                {qty}
              </span>
              <button 
                onClick={()=>setQty(q=>Math.min(maxQty, q+1))} 
                disabled={maxQty === 0 || qty >= maxQty}
                style={{
                  width:36,height:36,background:"none",border:"none",
                  cursor:maxQty === 0 || qty >= maxQty ? "not-allowed" : "pointer",fontSize:16,color:T.deepBrown,
                }}
              >
                +
              </button>
            </div>
            <span style={{
              fontFamily:"'DM Mono',monospace", fontSize:11,
              color:T.rust, fontWeight:500,
            }}>
              = {fmt(product.price * qty)}
            </span>
          </div>
          
          {maxQty < qty && maxQty > 0 && (
            <div style={{
              fontFamily:"'DM Mono',monospace", fontSize:10,
              color:"#D32F2F", marginTop:4,
            }}>
              Only {maxQty} metres available in this color
            </div>
          )}

          <button 
            onClick={handleAdd} 
            disabled={maxQty === 0 || maxQty < qty}
            style={{
              background: added ? T.sage : (maxQty === 0 || maxQty < qty ? "#666" : T.deepBrown),
              color:T.white, border:"none",
              fontFamily:"'DM Mono',monospace", fontSize:11,
              letterSpacing:"0.2em", textTransform:"uppercase",
              padding:"16px", cursor: maxQty === 0 || maxQty < qty ? "not-allowed" : "pointer",
              transition:"background 0.3s",
              marginTop:4,
            }}
          >
            {maxQty === 0 ? "Out of Stock" : (maxQty < qty ? "Insufficient Stock" : (added ? "Added to Cart ✓" : "Add to Cart"))}
          </button>

          {/* Virtual Try-On Section */}
          <div style={{borderTop:`1px solid ${T.border}`, paddingTop:20, marginTop:20}}>
            <button
              onClick={() => setShowTryOn(!showTryOn)}
              style={{
                width:"100%",
                background:T.white,
                border:`1px solid ${T.rust}`,
                color:T.rust,
                fontFamily:"'DM Mono',monospace", fontSize:11,
                letterSpacing:"0.15em", textTransform:"uppercase",
                padding:"12px", cursor:"pointer",
                transition:"all 0.3s",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}
              onMouseEnter={e=>{e.target.style.background=T.rust; e.target.style.color=T.white;}}
              onMouseLeave={e=>{e.target.style.background=T.white; e.target.style.color=T.rust;}}
            >
              {showTryOn ? '👁️ Hide Virtual Try-On' : '👁️ Try It On - Virtual Preview'}
            </button>

            {showTryOn && (
              <div style={{marginTop:20, padding:20, background:T.cream, borderRadius:8}}>
                <h4 style={{fontFamily:"'Syne',sans-serif", fontSize:14, color:T.deepBrown, marginBottom:16}}>
                  AI Virtual Try-On
                </h4>
                <p style={{fontFamily:"'DM Mono',monospace", fontSize:10, color:T.muted, marginBottom:16, lineHeight:1.6}}>
                  Upload your photo to see how this fabric looks on you! Our AI will replace your clothing with this fabric pattern.
                </p>

                {/* Upload Photo */}
                <div style={{marginBottom:16}}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    id="tryon-upload"
                    style={{display:'none'}}
                  />
                  <label
                    htmlFor="tryon-upload"
                    style={{
                      display:'inline-block',
                      padding:'10px 20px',
                      background:T.rust,
                      color:T.white,
                      borderRadius:6,
                      cursor:'pointer',
                      fontFamily:"'DM Mono',monospace",
                      fontSize:12,
                      transition:'all 0.3s',
                    }}
                    onMouseEnter={e=>e.target.style.background=T.deepBrown}
                    onMouseLeave={e=>e.target.style.background=T.rust}
                  >
                    {userPhoto ? '📷 Change Photo' : '📷 Upload Your Photo'}
                  </label>
                  {userPhoto && (
                    <span style={{marginLeft:12, fontFamily:"'DM Mono',monospace", fontSize:11, color:T.deepBrown}}>
                      {userPhoto.name}
                    </span>
                  )}
                </div>

                {/* Process Button */}
                {userPhoto && (
                  <button
                    onClick={processVirtualTryOn}
                    disabled={tryOnLoading}
                    style={{
                      width:"100%",
                      background:tryOnLoading ? T.muted : T.deepBrown,
                      color:T.white,
                      border:'none',
                      padding:'14px',
                      borderRadius:6,
                      cursor:tryOnLoading ? 'not-allowed' : 'pointer',
                      fontFamily:"'DM Mono',monospace",
                      fontSize:12,
                      letterSpacing:"0.1em",
                      textTransform:"uppercase",
                      marginBottom:16,
                    }}
                  >
                    {tryOnLoading ? '⏳ Processing with AI...' : '✨ Generate Virtual Try-On'}
                  </button>
                )}

                {/* Error Message */}
                {tryOnError && (
                  <div style={{
                    padding:12,
                    background:'#fee',
                    border:'1px solid #fcc',
                    borderRadius:6,
                    color:'#c33',
                    fontFamily:"'DM Mono',monospace",
                    fontSize:11,
                    marginBottom:16,
                  }}>
                    ⚠️ {tryOnError}
                  </div>
                )}

                {/* Result Image */}
                {tryOnResult && (
                  <div style={{marginTop:16}}>
                    <h5 style={{fontFamily:"'DM Mono',monospace", fontSize:10, color:T.muted, marginBottom:8, textTransform:'uppercase'}}>
                      Your Virtual Try-On Result
                    </h5>
                    <img
                      src={tryOnResult}
                      alt="Virtual Try-On Result"
                      style={{
                        width:'100%',
                        borderRadius:8,
                        border:`2px solid ${T.border}`,
                      }}
                    />
                    <p style={{fontFamily:"'DM Mono',monospace", fontSize:10, color:T.muted, marginTop:8, textAlign:'center'}}>
                      🤖 AI-generated preview with {product.name} fabric
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
