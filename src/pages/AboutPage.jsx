import { T } from "../utils/styles";

export default function AboutPage() {
  return (
    <div style={{paddingTop:90}}>
      {/* Hero */}
      <div style={{
        background:T.deepBrown,
        padding:"100px 60px",
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:80,
        alignItems:"center",
      }}>
        <div>
          <div style={{
            fontFamily:"'DM Mono',monospace", fontSize:10,
            letterSpacing:"0.35em", textTransform:"uppercase",
            color:T.gold, marginBottom:16,
            display:"flex", alignItems:"center", gap:12,
          }}>
            <span style={{width:30,height:1,background:T.gold,display:"inline-block"}}/>
            Our Story
          </div>
          <h1 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:52, fontWeight:300, lineHeight:1.1,
            color:T.sand, marginBottom:28,
          }}>
            Weaving <em style={{fontStyle:"italic",color:T.gold}}>Heritage</em><br/>Since 1987
          </h1>
          <p style={{
            fontFamily:"'DM Mono',monospace", fontSize:11,
            lineHeight:2, color:"rgba(232,221,208,0.7)", maxWidth:420,
          }}>
            AMMD Textiles was founded in Coimbatore with a single mission — to bring the
            finest handcrafted Indian fabrics to designers, boutiques, and fabric lovers
            across the country. Three generations of expertise, one unwavering commitment
            to quality.
          </p>
        </div>
        <div style={{
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:2,
          background:"rgba(255,255,255,0.08)",
        }}>
          {[
            {n:"500+",l:"Fabric Varieties"},
            {n:"37",l:"Years in Business"},
            {n:"12,000+",l:"Happy Clients"},
            {n:"48",l:"Artisan Partners"},
          ].map(({n,l})=>(
            <div key={l} style={{
              padding:"36px 28px",
              background:"rgba(245,240,232,0.05)",
            }}>
              <div style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:40, fontWeight:600, color:T.gold,
              }}>{n}</div>
              <div style={{
                fontFamily:"'DM Mono',monospace", fontSize:10,
                letterSpacing:"0.2em", textTransform:"uppercase",
                color:"rgba(232,221,208,0.5)", marginTop:6,
              }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div style={{padding:"80px 60px", background:T.cream}}>
        <div style={{
          fontFamily:"'DM Mono',monospace", fontSize:10,
          letterSpacing:"0.35em", textTransform:"uppercase",
          color:T.rust, marginBottom:12,
          display:"flex", alignItems:"center", gap:12,
        }}>
          <span style={{width:30,height:1,background:T.rust,display:"inline-block"}}/>
          What We Stand For
        </div>
        <h2 style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:40, fontWeight:300, color:T.deepBrown,
          marginBottom:48,
        }}>
          Our <em style={{fontStyle:"italic",color:T.rust}}>Values</em>
        </h2>
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2,
          background:T.border,
        }}>
          {[
            {t:"Authenticity",d:"We source directly from weavers and looms — no middlemen, no shortcuts. Every fabric tells a true story of craft."},
            {t:"Sustainability",d:"From organic dyes to eco-packaging, we work to minimise our footprint on the planet we love."},
            {t:"Artisan Support",d:"Fair trade partnerships with 48+ weaving communities ensure every purchase uplifts a craftsperson."},
          ].map(({t,d})=>(
            <div key={t} style={{background:T.white,padding:"40px 36px"}}>
              <div style={{
                width:36,height:3,background:T.rust,marginBottom:24,
              }}/>
              <div style={{
                fontFamily:"'Syne',sans-serif", fontWeight:700,
                fontSize:18, color:T.deepBrown, marginBottom:14,
              }}>{t}</div>
              <p style={{
                fontFamily:"'DM Mono',monospace",fontSize:11,
                lineHeight:1.9, color:T.muted,
              }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
