import { T } from "../utils/styles";

export default function Footer({ setPage }) {
  return (
    <footer>
      <div style={{background: T.charcoal}}>
        <div style={{padding: "72px 60px 40px"}}>
          <div>
            <div style={{fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: T.sand, marginBottom: 4}}>
              SRI MURUGAN <span style={{color: T.rust}}>TEX</span>
            </div>
            <p style={{fontFamily: "'DM Mono', monospace", fontSize: 11, lineHeight: "1.9", color: T.muted, marginBottom: 20, maxWidth: 280}}>
              Bringing finest Indian handloom and artisan fabrics to creators across the country since 1987.
            </p>
            <div style={{fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(232, 221, 208, 0.3)"}}>
              © 2026 SRI MURUGAN TEX. All rights reserved.
            </div>
            <div style={{fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(232, 221, 208, 0.3)"}}>
              Handcrafted with love in Coimbatore 🧵
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
