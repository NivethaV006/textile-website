import { useState } from "react";
import { T } from "../utils/styles";
import { fmt } from "../utils/constants";

export default function ProductCard({ product, onAdd, onView }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  
  // Get first color option or default
  const primaryColor = product.colorOptions?.[0]?.colorLabel || "Default";
  const stock = product.stock || 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (stock > 0) {
      onAdd(product);
      setAdded(true);
      setTimeout(()=>setAdded(false), 1500);
    }
  };

  return (
    <div
      onClick={()=>onView(product)}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{
        background:T.white,
        cursor:"pointer",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 32px 64px rgba(0,0,0,0.12)" : "0 4px 20px rgba(0,0,0,0.06)",
        transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)",
        overflow:"hidden",
      }}
    >
      {/* Swatch */}
      <div style={{
        height:240, 
        background: product.image ? `url(${product.image})` : (product.images?.[0] ? `url(${product.images[0]})` : '#E8E8E8'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position:"relative", overflow:"hidden",
      }}>
        {/* Stock badge */}
        {stock <= 10 && (
          <div style={{
            position:"absolute", top:16, right:16,
            background: stock === 0 ? '#D32F2F' : '#FF9800', color:T.white,
            fontFamily:"'DM Mono',monospace", fontSize:9,
            letterSpacing:"0.15em", textTransform:"uppercase",
            padding:"4px 8px",
          }}>
            {stock === 0 ? 'Out of Stock' : `Only ${stock} left`}
          </div>
        )}
        
        {/* Fabric texture overlay */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:`
            repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 11px),
            repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 11px)
          `,
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition:"transform 0.5s ease",
        }}/>

        {/* Tag */}
        <div style={{
          position:"absolute", top:16, left:16,
          background:T.deepBrown, color:T.sand,
          fontFamily:"'DM Mono',monospace", fontSize:9,
          letterSpacing:"0.25em", textTransform:"uppercase",
          padding:"5px 12px",
        }}>
          {product.fabricType || product.category}
        </div>

        {/* Quick add overlay */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          background:stock === 0 ? "rgba(211,47,47,0.9)" : "rgba(61,43,31,0.9)",
          padding:"16px",
          transform: hovered ? "translateY(0)" : "translateY(100%)",
          transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          display:"flex", gap:8,
        }}>
          <button
            onClick={handleAdd}
            disabled={stock === 0}
            style={{
              flex:1, background: added ? T.sage : (stock === 0 ? "#666" : T.rust),
              color:T.white, border:"none",
              fontFamily:"'DM Mono',monospace", fontSize:10,
              letterSpacing:"0.2em", textTransform:"uppercase",
              padding:"10px", cursor: stock === 0 ? "not-allowed" : "pointer",
              transition:"background 0.2s",
            }}
          >
            {stock === 0 ? "Out of Stock" : (added ? "Added ✓" : "Add to Cart")}
          </button>
          <button
            onClick={(e)=>{e.stopPropagation();onView(product);}}
            style={{
              background:"transparent", color:T.sand,
              border:`1px solid rgba(255,255,255,0.3)`,
              fontFamily:"'DM Mono',monospace", fontSize:10,
              letterSpacing:"0.15em", padding:"10px 16px",
              cursor:"pointer",
            }}
          >
            View
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{padding:"20px 22px"}}>
        <div style={{
          fontFamily:"'DM Mono',monospace", fontSize:9,
          letterSpacing:"0.25em", textTransform:"uppercase",
          color:T.muted, marginBottom:6,
        }}>
          {product.category}
        </div>
        <div style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:20, fontWeight:400, color:T.deepBrown,
        }}>
          {product.name}
        </div>
        <div style={{
          display:"flex", justifyContent:"space-between",
          alignItems:"center", marginTop:12,
        }}>
          <span style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:22, fontWeight:600, color:T.rust,
          }}>
            {fmt(product.price)}
          </span>
          <div style={{textAlign:"right"}}>
            <span style={{
              fontFamily:"'DM Mono',monospace", fontSize:9,
              letterSpacing:"0.15em", color:T.muted,
            }}>
              {product.unit}
            </span>
            <div style={{
              fontFamily:"'DM Mono',monospace", fontSize:8,
              color: stock <= 10 ? T.rust : T.muted,
              marginTop:2,
            }}>
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
