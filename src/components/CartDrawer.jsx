import { T } from "../utils/styles";
import { fmt } from "../utils/constants";

export default function CartDrawer({
  isOpen,
  cart = [],
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout
}) {
  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(42,37,32,0.5)",
          zIndex: 850,
          backdropFilter: "blur(2px)",
          animation: "fadeIn 0.2s ease"
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          background: T.white,
          zIndex: 860,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.12)",
          animation: "slideIn 0.3s ease"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "28px 32px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: "0.08em",
                color: T.deepBrown
              }}
            >
              Your Cart
            </div>

            <div
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 10,
                color: T.muted,
                marginTop: 2
              }}
            >
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: `1px solid ${T.border}`,
              width: 36,
              height: 36,
              cursor: "pointer",
              fontSize: 16,
              color: T.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 32px" }}>
          {cart.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 16
              }}
            >
              <div style={{ fontSize: 48 }}>🧵</div>

              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 22,
                  color: T.muted,
                  textAlign: "center"
                }}
              >
                Your cart is empty
              </div>

              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 10,
                  color: T.muted,
                  textAlign: "center"
                }}
              >
                Add some beautiful fabrics to get started.
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom: `1px solid ${T.border}`
                }}
              >
                {/* Product Image */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: item.product?.images?.[0]
                      ? `url(${item.product.images[0]})`
                      : "#E8E8E8",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    flexShrink: 0,
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 9px)"
                    }}
                  />
                </div>

                {/* Product Details */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 16,
                      color: T.deepBrown
                    }}
                  >
                    {item.product?.name || "Product"}
                  </div>

                  <div
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 10,
                      color: T.muted,
                      marginTop: 2
                    }}
                  >
                    {item.quantity} × {fmt(item.price)}
                    {item.selectedColor && ` • ${item.selectedColor}`}
                  </div>
                </div>

                {/* Price + Controls */}
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: T.rust
                    }}
                  >
                    {fmt(item.price * item.quantity)}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 4
                    }}
                  >
                    {/* Decrease */}
                    <button
                      onClick={() =>
                        onUpdateQuantity(item._id, item.quantity - 1)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 14
                      }}
                    >
                      −
                    </button>

                    {/* Quantity */}
                    <span
                      style={{
                        minWidth: 20,
                        textAlign: "center"
                      }}
                    >
                      {item.quantity}
                    </span>

                    {/* Increase */}
                    <button
                      onClick={() =>
                        onUpdateQuantity(item._id, item.quantity + 1)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 14
                      }}
                    >
                      +
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => onRemove(item._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: T.rust,
                        cursor: "pointer",
                        fontSize: 10,
                        marginLeft: 6
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div
            style={{
              padding: "24px 32px",
              borderTop: `1px solid ${T.border}`,
              background: T.cream
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: T.muted
                }}
              >
                SUBTOTAL
              </span>

              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: T.deepBrown
                }}
              >
                {fmt(total)}
              </span>
            </div>

            <button
              onClick={onCheckout}
              style={{
                width: "100%",
                background: T.rust,
                color: T.white,
                border: "none",
                padding: "16px",
                cursor: "pointer",
                fontSize: 12,
                letterSpacing: "0.1em"
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = T.deepBrown)
              }
              onMouseLeave={(e) =>
                (e.target.style.background = T.rust)
              }
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}