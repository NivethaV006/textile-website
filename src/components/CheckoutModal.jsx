import { useState } from "react";
import { T } from "../utils/styles";
import { fmt } from "../utils/constants";
import RazorpayPayment from "./RazorpayPayment";

export default function CheckoutModal({ isOpen, cart, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({name:"",phone:"",address:"",city:"",pin:""});
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const total = cart.reduce((s,i)=>s+i.price,0);

  if (!isOpen) return null;

  const fld = (lbl,key,ph="") => (
    <div style={{marginBottom:16}}>
      <label style={{
        fontFamily:"'DM Mono',monospace",fontSize:9,
        letterSpacing:"0.2em",textTransform:"uppercase",
        color:T.muted,display:"block",marginBottom:6,
      }}>{lbl}</label>
      <input placeholder={ph} value={info[key]}
        onChange={e=>setInfo(i=>({...i,[key]:e.target.value}))}
        style={{
          width:"100%",background:T.cream,
          border:`1px solid ${T.border}`,
          padding:"10px 12px",
          fontFamily:"'DM Mono',monospace",fontSize:11,
          color:T.deepBrown,outline:"none",
        }}
      />
    </div>
  );

  return (
    <div style={{
      position:"fixed",inset:0,zIndex:1000,
      background:"rgba(42,37,32,0.7)",
      display:"flex",alignItems:"center",justifyContent:"center",
      backdropFilter:"blur(4px)",
      animation:"fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div style={{
        background:T.white,width:520,
        maxHeight:"90vh",overflow:"auto",
        animation:"fadeUp 0.35s ease",
      }} onClick={e=>e.stopPropagation()}>
        <div style={{
          padding:"24px 32px",
          borderBottom:`1px solid ${T.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"center",
        }}>
          <div style={{
            fontFamily:"'Syne',sans-serif",fontWeight:800,
            fontSize:16,color:T.deepBrown,
          }}>
            {step===1?"Shipping Details":step===2?"Order Summary":step===3?"Payment":"Order Confirmed!"}
          </div>
          <button onClick={onClose} style={{
            background:"none",border:"none",
            fontSize:18,cursor:"pointer",color:T.muted,
          }}>✕</button>
        </div>

        <div style={{padding:"28px 32px"}}>
          {step===1 && (
            <>
              {fld("Full Name","name","Your name")}
              {fld("Phone","phone","+91 XXXXX XXXXX")}
              {fld("Address","address","Street / Building")}
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
                {fld("City","city","City")}
                {fld("PIN Code","pin","600001")}
              </div>
              <button
                onClick={()=>{ if(info.name&&info.phone&&info.address) setStep(2); }}
                style={{
                  width:"100%",background:T.rust,color:T.white,
                  border:"none",padding:"14px",marginTop:8,
                  fontFamily:"'DM Mono',monospace",fontSize:11,
                  letterSpacing:"0.2em",textTransform:"uppercase",
                  cursor:"pointer",
                }}
              >
                Continue to Summary →
              </button>
            </>
          )}
          {step===2 && (
            <>
              <div style={{
                background:T.cream,padding:20,marginBottom:20,
              }}>
                <div style={{
                  fontFamily:"'DM Mono',monospace",fontSize:9,
                  letterSpacing:"0.2em",textTransform:"uppercase",
                  color:T.muted,marginBottom:12,
                }}>
                  Delivering To
                </div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:T.deepBrown,lineHeight:1.8}}>
                  {info.name} · {info.phone}<br/>
                  {info.address}, {info.city} — {info.pin}
                </div>
              </div>
              {Object.values(cart.reduce((a,i)=>{a[i.id]=a[i.id]||{...i,count:0};a[i.id].count++;return a},{})).map(item=>(
                <div key={item.id} style={{
                  display:"flex",justifyContent:"space-between",
                  padding:"10px 0",borderBottom:`1px solid ${T.border}`,
                  fontFamily:"'DM Mono',monospace",fontSize:11,
                }}>
                  <span style={{color:T.deepBrown}}>{item.name} × {item.count}m</span>
                  <span style={{color:T.rust}}>{fmt(item.price*item.count)}</span>
                </div>
              ))}
              <div style={{
                display:"flex",justifyContent:"space-between",
                padding:"16px 0",
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:22,fontWeight:600,color:T.deepBrown,
              }}>
                <span>Total</span>
                <span style={{color:T.rust}}>{fmt(total)}</span>
              </div>
              <button onClick={()=>setStep(3)} style={{
                width:"100%",background:T.rust,color:T.white,
                border:"none",padding:"14px",
                fontFamily:"'DM Mono',monospace",fontSize:11,
                letterSpacing:"0.2em",textTransform:"uppercase",
                cursor:"pointer",
              }}>
                Proceed to Payment →
              </button>
            </>
          )}
          {step===3 && (
            <div style={{
              display:"flex",flexDirection:"column",
              alignItems:"center",padding:"40px 20px",
              gap:16, textAlign:"center",
            }}>
              {paymentCompleted ? (
                <>
                  <div style={{
                    width:64,height:64,background:T.sage,
                    borderRadius:"50%",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:28,
                  }}>✓</div>
                  <h3 style={{
                    fontFamily:"'Cormorant Garamond',serif",
                    fontSize:28,fontWeight:300,color:T.deepBrown,
                  }}>
                    Payment Successful!
                  </h3>
                  <p style={{
                    fontFamily:"'DM Mono',monospace",fontSize:11,
                    color:T.muted,lineHeight:1.8,maxWidth:320,
                  }}>
                    Thank you for your order. We'll send a confirmation to your phone
                    and begin processing within 24 hours.
                  </p>
                  <button onClick={onClose} style={{
                    background:T.deepBrown,color:T.white,border:"none",
                    fontFamily:"'DM Mono',monospace",fontSize:11,
                    letterSpacing:"0.2em",textTransform:"uppercase",
                    padding:"12px 28px",cursor:"pointer",marginTop:8,
                  }}>
                    Continue Shopping
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{
                    fontFamily:"'Cormorant Garamond',serif",
                    fontSize:28,fontWeight:300,color:T.deepBrown,marginBottom:20,
                  }}>
                    Complete Payment
                  </h3>
                  <div style={{
                    background:T.cream,padding:20,marginBottom:20,
                    borderRadius:8,border:`1px solid ${T.border}`,
                  }}>
                    <div style={{
                      fontFamily:"'DM Mono',monospace",fontSize:11,
                      color:T.muted,marginBottom:8,
                    }}>
                      Order Total: <span style={{color:T.rust,fontWeight:600}}>{fmt(total)}</span>
                    </div>
                  </div>
                  <RazorpayPayment
                    amount={total}
                    customerInfo={info}
                    onSuccess={(paymentDetails) => {
                      setPaymentCompleted(true);
                      onComplete();
                    }}
                    onError={(error) => {
                      console.error('Payment failed:', error);
                      setStep(2); // Go back to order summary
                    }}
                    onClose={() => setStep(2)}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
