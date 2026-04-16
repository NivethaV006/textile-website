import Hero from "../components/Hero";
import MarqueeStrip from "../components/MarqueeStrip";
import Features from "../components/Features";
import ProductCard from "../components/ProductCard";
import Testimonials from "../components/Testimonials";
import { T } from "../utils/styles";
import { TESTIMONIALS } from "../utils/constants";
import { useState, useEffect } from "react";

export default function HomePage({ onAdd, onView, setPage }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const featured = products.slice(0, 4);
  return (
    <>
      <Hero setPage={setPage}/>
      <MarqueeStrip/>
      <Features/>
      {/* Featured */}
      <section style={{padding:"100px 60px", background:T.cream}}>
        <div style={{
          display:"flex",justifyContent:"space-between",
          alignItems:"flex-end",marginBottom:48,
        }}>
          <div>
            <div style={{
              fontFamily:"'DM Mono',monospace",fontSize:10,
              letterSpacing:"0.35em",textTransform:"uppercase",
              color:T.rust,marginBottom:12,
              display:"flex",alignItems:"center",gap:12,
            }}>
              <span style={{width:30,height:1,background:T.rust,display:"inline-block"}}/>
              Featured
            </div>
            <h2 style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:42,fontWeight:300,color:T.deepBrown,
            }}>
              Editor's <em style={{fontStyle:"italic",color:T.rust}}>Picks</em>
            </h2>
          </div>
          <button onClick={()=>setPage("shop")} style={{
            background:"transparent",color:T.deepBrown,
            border:`1px solid ${T.deepBrown}`,
            fontFamily:"'DM Mono',monospace",fontSize:10,
            letterSpacing:"0.2em",textTransform:"uppercase",
            padding:"12px 28px",cursor:"pointer",
            transition:"all 0.2s",
          }}
            onMouseEnter={e=>{e.target.style.background=T.deepBrown;e.target.style.color=T.white;}}
            onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color=T.deepBrown;}}
          >
            View All →
          </button>
        </div>
        <div style={{
          display:"grid",gridTemplateColumns:"repeat(4,1fr)",
          gap:2,background:T.border,
        }}>
          {loading ? (
            <div style={{
              gridColumn:"1/-1", textAlign:"center",
              padding:"60px 20px",
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:24, color:T.muted,
            }}>
              Loading featured fabrics...
            </div>
          ) : featured.map(p=>(
            <ProductCard key={p._id} product={p} onAdd={onAdd} onView={onView}/>
          ))}
        </div>
      </section>
      <Testimonials/>
    </>
  );
}
