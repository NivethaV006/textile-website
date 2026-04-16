import { T } from "../utils/styles";

export default function Hero({ setPage }) {
  return (
    <section style={{
      minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr",
      position:"relative", overflow:"hidden",
    }}>
      {/* Left */}
      <div style={{
        display:"flex", flexDirection:"column", justifyContent:"center",
        padding:"120px 60px 80px",
        animation:"fadeUp 0.9s ease both",
      }}>
        <div style={{
          fontFamily:"'DM Mono',monospace", fontSize:10,
          letterSpacing:"0.35em", textTransform:"uppercase",
          color:T.rust, marginBottom:28,
          display:"flex", alignItems:"center", gap:14,
        }}>
          <span style={{width:40,height:1,background:T.rust,display:"inline-block"}}/>
          Since 1987 · Coimbatore
        </div>

        <h1 style={{
          fontFamily:"'Cormorant Garamond',serif", fontWeight:300,
          fontSize:"clamp(52px,6vw,88px)", lineHeight:1.0,
          color:T.deepBrown, marginBottom:28,
        }}>
          Fabric<br/>
          <em style={{fontStyle:"italic", color:T.rust}}>Woven</em><br/>
          With Soul
        </h1>

        <p style={{
          fontFamily:"'DM Mono',monospace", fontSize:12,
          lineHeight:1.9, color:T.muted,
          maxWidth:380, marginBottom:48, letterSpacing:"0.04em",
        }}>
          From handloom silk to organic cotton — every metre at AMMD carries the
          tradition of Indian craftsmanship, delivered to your doorstep.
        </p>

        <div style={{display:"flex",gap:16}}>
          <button onClick={()=>setPage("shop")} style={{
            background:T.deepBrown, color:T.white, border:"none",
            fontFamily:"'DM Mono',monospace", fontSize:11,
            letterSpacing:"0.2em", textTransform:"uppercase",
            padding:"16px 36px", cursor:"pointer",
            transition:"all 0.25s",
          }}
            onMouseEnter={e=>{e.target.style.background=T.rust;e.target.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.target.style.background=T.deepBrown;e.target.style.transform="translateY(0)";}}
          >
            Explore Fabrics
          </button>
          <button onClick={()=>setPage("about")} style={{
            background:"transparent", color:T.deepBrown,
            border:`1px solid ${T.deepBrown}`,
            fontFamily:"'DM Mono',monospace", fontSize:11,
            letterSpacing:"0.2em", textTransform:"uppercase",
            padding:"16px 36px", cursor:"pointer",
            transition:"all 0.25s",
          }}
            onMouseEnter={e=>{e.target.style.background=T.sand;}}
            onMouseLeave={e=>{e.target.style.background="transparent";}}
          >
            Our Story
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display:"flex", gap:40, marginTop:64,
          paddingTop:32, borderTop:`1px solid ${T.border}`,
        }}>
          {[["500+","Fabric Types"],["37","Years Legacy"],["12k+","Happy Clients"]].map(([n,l])=>(
            <div key={l}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:T.rust}}>{n}</div>
              <div style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:T.muted,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Fabric mosaic */}
      <div style={{
        position:"relative", overflow:"hidden",
        animation:"fadeIn 1.2s ease both 0.3s",
      }}>
        <div style={{
          position:"absolute", inset:0,
          background:`linear-gradient(135deg, ${T.sand} 0%, #D4B896 35%, #C8963E33 70%, ${T.cream} 100%)`,
        }}/>
        {/* Decorative fabric swatches */}
        {[
          {top:"12%",left:"10%",w:180,h:220,bg:"#D4A8C7",rot:-6},
          {top:"8%",left:"42%",w:140,h:170,bg:"#C89850",rot:4},
          {top:"38%",left:"5%",w:120,h:150,bg:"#A8B8A0",rot:8},
          {top:"35%",left:"35%",w:220,h:260,bg:"#E8CFA0",rot:-3},
          {top:"62%",left:"12%",w:160,h:120,bg:"#8A6BB0",rot:5},
          {top:"65%",left:"48%",w:130,h:160,bg:"#D4B896",rot:-7},
        ].map((s,i)=>(
          <div key={i} style={{
            position:"absolute", top:s.top, left:s.left,
            width:s.w, height:s.h,
            background:s.bg,
            transform:`rotate(${s.rot}deg)`,
            opacity:0.75,
            boxShadow:"0 20px 60px rgba(0,0,0,0.12)",
            animation:`fadeIn 0.8s ease both ${0.4+i*0.12}s`,
          }}>
            {/* Texture lines */}
            <div style={{
              position:"absolute", inset:0,
              backgroundImage:`repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 9px)`,
            }}/>
          </div>
        ))}

        {/* Label badge */}
        <div style={{
          position:"absolute", bottom:60, right:40,
          background:T.white, padding:"20px 28px",
          boxShadow:"0 24px 60px rgba(0,0,0,0.12)",
          animation:"fadeUp 0.9s ease both 0.8s",
        }}>
          <div style={{fontSize:9,letterSpacing:"0.3em",textTransform:"uppercase",color:T.muted}}>New Collection</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:400,color:T.deepBrown,marginTop:4}}>
            Winter Weaves '26
          </div>
          <div style={{
            marginTop:12, display:"inline-block",
            fontFamily:"'DM Mono',monospace", fontSize:10,
            letterSpacing:"0.15em", color:T.rust, textTransform:"uppercase",
          }}>
            View lookbook →
          </div>
        </div>
      </div>
    </section>
  );
}
