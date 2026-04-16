import { T } from "../utils/styles";

export default function Features() {
  const feats = [
    {icon:"🧵", title:"Handpicked Quality", desc:"Every fabric personally sourced from master weavers across India."},
    {icon:"📦", title:"Pan-India Delivery", desc:"Fast, careful shipping with full tracking on every order."},
    {icon:"🔄", title:"Easy Returns", desc:"7-day hassle-free returns on unused fabric with original packaging."},
    {icon:"✂️", title:"Custom Cuts", desc:"Order any length from 0.5m. We cut to your exact requirement."},
  ];
  return (
    <div style={{
      background:T.deepBrown,
      display:"grid", gridTemplateColumns:"repeat(4,1fr)",
    }}>
      {feats.map((f,i) => (
        <div key={i} style={{
          padding:"48px 40px",
          borderRight: i<3 ? `1px solid rgba(255,255,255,0.08)` : "none",
          transition:"background 0.25s",
        }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(181,82,42,0.15)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
        >
          <div style={{fontSize:28, marginBottom:16}}>{f.icon}</div>
          <div style={{
            fontFamily:"'Syne',sans-serif", fontWeight:700,
            fontSize:14, letterSpacing:"0.05em", color:T.sand,
            marginBottom:8,
          }}>
            {f.title}
          </div>
          <div style={{
            fontFamily:"'DM Mono',monospace", fontSize:11,
            lineHeight:1.8, color:"rgba(232,221,208,0.6)",
          }}>
            {f.desc}
          </div>
        </div>
      ))}
    </div>
  );
}
