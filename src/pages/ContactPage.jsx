import { useState } from "react";
import { T } from "../utils/styles";

export default function ContactPage() {
  const [form, setForm] = useState({name:"",email:"",subject:"",message:""});
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if(!form.name||!form.email||!form.message) return;
    setSent(true);
    setForm({name:"",email:"",subject:"",message:""});
    setTimeout(()=>setSent(false),4000);
  };

  const field = (label,key,type="text",multi=false) => (
    <div style={{marginBottom:20}}>
      <label style={{
        display:"block",
        fontFamily:"'DM Mono',monospace",fontSize:9,
        letterSpacing:"0.25em",textTransform:"uppercase",
        color:T.muted,marginBottom:8,
      }}>{label}</label>
      {multi ? (
        <textarea
          rows={5}
          value={form[key]}
          onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
          style={{
            width:"100%",background:T.cream,
            border:`1px solid ${T.border}`,
            padding:"12px 14px",
            fontFamily:"'DM Mono',monospace",fontSize:11,
            color:T.deepBrown,outline:"none",resize:"vertical",
          }}
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
          style={{
            width:"100%",background:T.cream,
            border:`1px solid ${T.border}`,
            padding:"12px 14px",
            fontFamily:"'DM Mono',monospace",fontSize:11,
            color:T.deepBrown,outline:"none",
          }}
        />
      )}
    </div>
  );

  return (
    <div style={{paddingTop:90}}>
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 1fr",
        minHeight:"calc(100vh - 90px)",
      }}>
        {/* Left info */}
        <div style={{
          background:T.deepBrown, padding:"80px 60px",
          display:"flex", flexDirection:"column", justifyContent:"center",
        }}>
          <div style={{
            fontFamily:"'DM Mono',monospace",fontSize:10,
            letterSpacing:"0.35em",textTransform:"uppercase",
            color:T.gold,marginBottom:16,
            display:"flex",alignItems:"center",gap:12,
          }}>
            <span style={{width:30,height:1,background:T.gold,display:"inline-block"}}/>
            Get In Touch
          </div>
          <h1 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:50,fontWeight:300,lineHeight:1.1,
            color:T.sand,marginBottom:32,
          }}>
            Let's Talk <em style={{fontStyle:"italic",color:T.gold}}>Fabric</em>
          </h1>
          <p style={{
            fontFamily:"'DM Mono',monospace",fontSize:11,
            lineHeight:2,color:"rgba(232,221,208,0.65)",
            marginBottom:52,maxWidth:380,
          }}>
            Whether you have a bulk order, custom requirement, or just want to know
            more about our fabrics — our team is happy to help.
          </p>
          {[
            {icon:"📍",t:"Address",v:"42, Textile Hub, Peelamedu\nCoimbatore — 641 004, Tamil Nadu"},
            {icon:"📞",t:"Phone",v:"+91 422 123 4567"},
            {icon:"✉️",t:"Email",v:"hello@ammdtextiles.com"},
            {icon:"🕐",t:"Hours",v:"Mon–Sat: 9:00 AM – 6:00 PM IST"},
          ].map(({icon,t,v})=>(
            <div key={t} style={{
              display:"flex",gap:18,marginBottom:28,
              alignItems:"flex-start",
            }}>
              <span style={{fontSize:18,marginTop:2}}>{icon}</span>
              <div>
                <div style={{
                  fontFamily:"'DM Mono',monospace",fontSize:9,
                  letterSpacing:"0.25em",textTransform:"uppercase",
                  color:T.gold,marginBottom:4,
                }}>{t}</div>
                <div style={{
                  fontFamily:"'DM Mono',monospace",fontSize:11,
                  color:"rgba(232,221,208,0.75)",lineHeight:1.7,
                  whiteSpace:"pre-line",
                }}>{v}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{
          background:T.white,padding:"80px 60px",
          display:"flex",flexDirection:"column",justifyContent:"center",
        }}>
          <h2 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:34,fontWeight:300,color:T.deepBrown,
            marginBottom:40,
          }}>
            Send a Message
          </h2>

          {sent && (
            <div style={{
              background:"rgba(122,140,110,0.15)",
              border:`1px solid ${T.sage}`,
              padding:"16px 20px",marginBottom:24,
              fontFamily:"'DM Mono',monospace",fontSize:11,
              color:T.sage,
            }}>
              ✓ Message sent! We'll reply within 24 hours.
            </div>
          )}

          {field("Your Name","name")}
          {field("Email Address","email","email")}
          {field("Subject","subject")}
          {field("Message","message","text",true)}

          <button onClick={handleSubmit} style={{
            background:T.rust,color:T.white,border:"none",
            fontFamily:"'DM Mono',monospace",fontSize:11,
            letterSpacing:"0.2em",textTransform:"uppercase",
            padding:"16px",cursor:"pointer",
            transition:"background 0.2s",
            marginTop:8,
          }}
            onMouseEnter={e=>e.target.style.background=T.deepBrown}
            onMouseLeave={e=>e.target.style.background=T.rust}
          >
            Send Message →
          </button>
        </div>
      </div>
    </div>
  );
}
