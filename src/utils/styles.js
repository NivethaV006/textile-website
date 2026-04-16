export const T = {
  cream:     "#F5F0E8",
  sand:      "#E8DDD0",
  warmBrown: "#8B6A50",
  deepBrown: "#3D2B1F",
  rust:      "#B5522A",
  gold:      "#C8963E",
  sage:      "#7A8C6E",
  charcoal:  "#2A2520",
  white:     "#FDFAF5",
  muted:     "#8C7E73",
  border:    "rgba(61,43,31,0.12)",
};

export const FontLink = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');`}</style>
);

export const GlobalStyle = () => (
  <style>{`
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body { font-family:'DM Mono',monospace; background:${T.cream}; color:${T.deepBrown}; overflow-x:hidden; }
    ::selection { background:${T.rust}; color:${T.white}; }
    ::-webkit-scrollbar { width:6px; }
    ::-webkit-scrollbar-track { background:${T.sand}; }
    ::-webkit-scrollbar-thumb { background:${T.warmBrown}; border-radius:3px; }

    @keyframes fadeUp {
      from { opacity:0; transform:translateY(32px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity:0; } to { opacity:1; }
    }
    @keyframes fadeDown {
      from { opacity:0; transform:translateY(-20px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes slideInLeft {
      from { opacity:0; transform:translateX(-30px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity:0; transform:translateX(30px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes marquee {
      from { transform:translateX(0); }
      to   { transform:translateX(-50%); }
    }
    @keyframes shimmer {
      0%   { background-position:-200% center; }
      100% { background-position:200% center; }
    }
    @keyframes spin {
      from { transform:rotate(0deg); }
      to   { transform:rotate(360deg); }
    }
    @keyframes pulseRing {
      0%   { transform:scale(1); opacity:0.6; }
      100% { transform:scale(2.2); opacity:0; }
    }
    
    /* Page transition styles */
    .page-transition-enter {
      opacity: 0;
      transform: translateY(20px);
    }
    .page-transition-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
    }
    .page-transition-exit {
      opacity: 1;
      transform: translateY(0);
    }
    .page-transition-exit-active {
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
    }
  `}</style>
);
