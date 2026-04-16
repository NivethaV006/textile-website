import { useState, useEffect } from 'react';
import { T } from "../utils/styles";

export default function Navbar({ currentPage, onCartClick, cartItemCount, onAuthClick, user, onLogout, setPage }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navStyle = {
    position:"fixed", top:0, left:0, right:0, zIndex:900,
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding: scrolled ? "14px 48px" : "24px 48px",
    background: scrolled ? "rgba(245,240,232,0.94)" : "transparent",
    backdropFilter: scrolled ? "blur(14px)" : "none",
    borderBottom: scrolled ? `1px solid ${T.border}` : "none",
    transition:"all 0.4s cubic-bezier(0.4,0,0.2,1)",
  };

  const links = ["Home","Shop","About","Contact"];

  return (
    <nav style={navStyle}>
      <a href="#" onClick={()=>setPage("home")} style={{textDecoration:"none"}}>
        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,letterSpacing:"0.12em",color:T.deepBrown}}>
          SRI MURUGAN <span style={{color:T.rust}}>TEX</span>
        </span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.3em",color:T.muted,display:"block",marginTop:1}}>
          SRI MURUGAN TEXTILES
        </span>
      </a>

      {/* Desktop links */}
      <ul style={{display:"flex",gap:36,listStyle:"none",alignItems:"center"}}>
        {links.map(l => (
          <li key={l}>
            <button
              onClick={()=>setPage(l.toLowerCase())}
              style={{
                background:"none", border:"none", cursor:"pointer",
                fontFamily:"'DM Mono',monospace", fontSize:10,
                letterSpacing:"0.2em", textTransform:"uppercase",
                color: currentPage===l.toLowerCase() ? T.rust : T.deepBrown,
                position:"relative", paddingBottom:4,
              }}
            >
              {l}
              <span style={{
                position:"absolute", bottom:0, left:0,
                width: currentPage===l.toLowerCase() ? "100%" : "0",
                height:1, background:T.rust,
                transition:"width 0.3s ease",
              }}/>
            </button>
          </li>
        ))}
      </ul>

      <div style={{display:"flex",alignItems:"center",gap:16}}>
        {user ? (
          <>
            <button 
              onClick={() => setPage('profile')}
              style={{
                background:T.rust, 
                border:"none",
                cursor:"pointer",
                width:"40px",
                height:"40px",
                borderRadius:"8px",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                color:T.white,
                fontFamily:"'DM Mono',monospace",
                fontSize:"12px",
                fontWeight:500,
                transition:"all 0.2s",
                position:"relative"
              }}
              onMouseEnter={e=>{e.target.style.background=T.deepBrown;}}
              onMouseLeave={e=>{e.target.style.background=T.rust;}}
            >
              👤
            </button>
            <button onClick={onLogout} style={{
              background:"none", border:`1px solid ${T.rust}`,
              color:T.rust, cursor:"pointer",
              fontFamily:"'DM Mono',monospace", fontSize:9,
              letterSpacing:"0.1em", textTransform:"uppercase",
              padding:"8px 16px", transition:"all 0.2s",
            }}
              onMouseEnter={e=>{e.target.style.borderColor=T.deepBrown; e.target.style.color=T.deepBrown;}}
              onMouseLeave={e=>{e.target.style.borderColor=T.rust; e.target.style.color=T.rust;}}
            >
              Logout
            </button>
          </>
        ) : (
          <button onClick={onAuthClick} style={{
            background:"none", border:`1px solid ${T.rust}`,
            color:T.rust, cursor:"pointer",
            fontFamily:"'DM Mono',monospace", fontSize:9,
            letterSpacing:"0.1em", textTransform:"uppercase",
            padding:"8px 16px", transition:"all 0.2s",
          }}
            onMouseEnter={e=>{e.target.style.background=T.rust; e.target.style.color=T.white}}
            onMouseLeave={e=>{e.target.style.background="none"; e.target.style.color=T.rust}}
          >
            Sign In
          </button>
        )}
        <button onClick={onCartClick} style={{
          background:T.deepBrown, color:T.white, border:"none",
          fontFamily:"'DM Mono',monospace", fontSize:10,
          letterSpacing:"0.2em", textTransform:"uppercase",
          padding:"10px 20px", cursor:"pointer",
          transition:"background 0.2s",
          position:"relative",
        }}
          onMouseEnter={e=>e.target.style.background=T.rust}
          onMouseLeave={e=>e.target.style.background=T.deepBrown}
        >
          Cart {cartItemCount > 0 && (
            <span style={{
              position:"absolute", top:-8, right:-8,
              background:T.rust, color:T.white,
              borderRadius:"50%", width:18, height:18,
              fontSize:9, display:"flex", alignItems:"center", justifyContent:"center",
            }}>{cartItemCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}
