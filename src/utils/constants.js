export const CATEGORIES = ["All","Silk","Cotton","Linen","Wool","Velvet","Brocade"];

export const TESTIMONIALS = [
  { name:"Priya Venkataraman", role:"Fashion Designer, Chennai",
    text:"AMMD has been my go-to source for premium fabrics. Their Banarasi Brocade is unmatched in quality." },
  { name:"Rahul Mehta", role:"Textile Buyer, Mumbai",
    text:"Consistent quality, fast dispatch, and a range that feels genuinely curated. Exceptional service." },
  { name:"Ananya Das", role:"Boutique Owner, Kolkata",
    text:"The Khadi Cotton is perfect — customers love the story behind it. Will be reordering every season." },
];

export const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
