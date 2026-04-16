import { T } from "../utils/styles";

export default function MarqueeStrip() {
  const items = ["Silk","Cotton","Linen","Wool","Velvet","Brocade","Khadi","Tussar","Chanderi","Jamdani"];
  const doubled = [...items,...items];
  return (
    <div style={{
      background:T.deepBrown, overflow:"hidden",
      padding:"14px 0", borderTop:`1px solid rgba(255,255,255,0.08)`,
    }}>
      <div style={{
        display:"flex", gap:40,
        animation:"marquee 22s linear infinite",
        width:"max-content",
      }}>
        {doubled.map((t,i)=>(
          <span key={i} style={{
            fontFamily:"'DM Mono',monospace", fontSize:11,
            letterSpacing:"0.35em", textTransform:"uppercase",
            color: i%2===0 ? T.sand : T.rust,
            whiteSpace:"nowrap",
          }}>
            {t} <span style={{color:T.gold,margin:"0 6px"}}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
