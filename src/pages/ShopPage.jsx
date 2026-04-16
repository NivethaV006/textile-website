import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { T } from "../utils/styles";
import { fmt, CATEGORIES } from "../utils/constants";

export default function ShopPage({ onAdd, onView }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [active, setActive] = useState("All");
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
  
  // Apply sorting and filtering
  const filtered = products.filter(p => {
    const matchCat = active === "All" || p.category === active;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const sortedFiltered = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0; // default sort
  });

  return (
    <div style={{paddingTop:90}}>
      {/* Shop Header */}
      <div style={{
        padding:"60px 60px 40px",
        borderBottom:`1px solid ${T.border}`,
        display:"grid", gridTemplateColumns:"1fr auto",
        alignItems:"end", gap:24,
      }}>
        <div>
          <div style={{
            fontFamily:"'DM Mono',monospace", fontSize:10,
            letterSpacing:"0.35em", textTransform:"uppercase",
            color:T.rust, marginBottom:12,
            display:"flex", alignItems:"center", gap:12,
          }}>
            <span style={{width:30,height:1,background:T.rust,display:"inline-block"}}/>
            Our Collection
          </div>
          <h2 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:48, fontWeight:300, color:T.deepBrown,
          }}>
            Handpicked <em style={{fontStyle:"italic",color:T.rust}}>Fabrics</em>
          </h2>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search fabrics..."
            style={{
              background:T.white, border:`1px solid ${T.border}`,
              fontFamily:"'DM Mono',monospace", fontSize:11,
              padding:"10px 16px", outline:"none", width:200,
              color:T.deepBrown,
            }}
          />
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{
            background:T.white, border:`1px solid ${T.border}`,
            fontFamily:"'DM Mono',monospace", fontSize:11,
            padding:"10px 16px", outline:"none", color:T.deepBrown, cursor:"pointer",
          }}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{
        padding:"24px 60px",
        display:"flex", gap:8, flexWrap:"wrap",
        borderBottom:`1px solid ${T.border}`,
      }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={()=>setActive(c)} style={{
            background: active===c ? T.deepBrown : "transparent",
            color: active===c ? T.white : T.muted,
            border:`1px solid ${active===c ? T.deepBrown : T.border}`,
            fontFamily:"'DM Mono',monospace", fontSize:10,
            letterSpacing:"0.2em", textTransform:"uppercase",
            padding:"8px 20px", cursor:"pointer",
            transition:"all 0.2s",
          }}>
            {c}
          </button>
        ))}
        <span style={{
          marginLeft:"auto", fontFamily:"'DM Mono',monospace",
          fontSize:10, color:T.muted, alignSelf:"center",
        }}>
          {sortedFiltered.length} products
        </span>
      </div>

      {/* Grid */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
        gap:2, padding:"2px",
        margin:"2px 0",
        background:T.border,
      }}>
        {loading ? (
          <div style={{
            gridColumn:"1/-1", textAlign:"center",
            padding:"80px 20px",
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:24, color:T.muted,
          }}>
            Loading fabrics...
          </div>
        ) : sortedFiltered.map(p => (
          <ProductCard key={p._id} product={p} onAdd={onAdd} onView={onView}/>
        ))}
        {!loading && sortedFiltered.length===0 && (
          <div style={{
            gridColumn:"1/-1", textAlign:"center",
            padding:"80px 20px",
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:24, color:T.muted,
          }}>
            No fabrics found.
          </div>
        )}
      </div>
    </div>
  );
}
