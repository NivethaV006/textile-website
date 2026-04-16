import { T } from "../utils/styles";
import { TESTIMONIALS } from "../utils/constants";

export default function Testimonials() {
  return (
    <section style={{
      background:T.sand, padding:"100px 60px",
    }}>
      <div style={{
        fontFamily:"'DM Mono',monospace", fontSize:10,
        letterSpacing:"0.35em", textTransform:"uppercase",
        color:T.rust, marginBottom:12,
        display:"flex", alignItems:"center", gap:12,
      }}>
        <span style={{width:30,height:1,background:T.rust,display:"inline-block"}}/>
        What clients say
      </div>
      <h2 style={{
        fontFamily:"'Cormorant Garamond',serif",
        fontSize:42, fontWeight:300, color:T.deepBrown,
        marginBottom:56,
      }}>
        Trusted by <em style={{fontStyle:"italic",color:T.rust}}>Artisans</em> & Designers
      </h2>
      <div style={{
        display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2,
        background:T.border,
      }}>
        {TESTIMONIALS.map((t,i)=>(
          <div key={i} style={{
            background:T.white, padding:"40px 36px",
          }}>
            <div style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:48, color:T.rust, lineHeight:1,
              marginBottom:16,
            }}>
              "
            </div>
            <p style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:18, fontWeight:300, lineHeight:1.7,
              color:T.deepBrown, marginBottom:28, fontStyle:"italic",
            }}>
              {t.text}
            </p>
            <div style={{
              borderTop:`1px solid ${T.border}`, paddingTop:20,
            }}>
              <div style={{
                fontFamily:"'Syne',sans-serif", fontWeight:700,
                fontSize:13, color:T.deepBrown,
              }}>
                {t.name}
              </div>
              <div style={{
                fontFamily:"'DM Mono',monospace", fontSize:10,
                color:T.muted, marginTop:3,
              }}>
                {t.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
