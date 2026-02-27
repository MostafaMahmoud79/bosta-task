"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();


  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isHydrated, isAuthenticated, router]);


  if (!isHydrated) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 60px)",
      }}>
        <div style={{
          width: "32px",
          height: "32px",
          border: "2px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // ── Empty state ───────
  if (items.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "80px 16px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        <div style={{ fontSize: "56px", marginBottom: "14px" }}>🛒</div>
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
          Your cart is empty
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "28px", fontSize: "14px" }}>
          Add some products to get started.
        </p>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: "960px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap",
      }}>
        <button
          onClick={() => router.back()}
          style={{
            display: "flex",
            alignItems: "center",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <h1 style={{
          fontSize: "clamp(18px, 4vw, 24px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <ShoppingBag size={22} />
          Cart
          <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--text-muted)" }}>
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>
      </div>

      <div className="cart-layout">
        {/* ── Items ─────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="cart-item">
              {/* Thumbnail */}
              <div style={{
                background: "var(--bg-elevated)",
                borderRadius: "8px",
                padding: "10px",
                width: "68px",
                height: "68px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ maxWidth: "48px", maxHeight: "48px", objectFit: "contain" }}
                />
              </div>

              {/* Info */}
              <div className="cart-item-info" style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {product.title}
                </p>
                <p style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginTop: "2px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {product.category}
                </p>
                <p style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--accent)",
                  fontFamily: "var(--font-dm-mono)",
                  marginTop: "4px",
                }}>
                  ${(product.price * quantity).toFixed(2)}
                </p>
              </div>

              {/* Controls */}
              <div className="cart-item-controls" style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    style={qtyBtn}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={11} />
                  </button>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    width: "22px",
                    textAlign: "center",
                    fontFamily: "var(--font-dm-mono)",
                  }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    style={qtyBtn}
                    aria-label="Increase quantity"
                  >
                    <Plus size={11} />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(product.id)}
                  aria-label="Remove item"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border)",
                    color: "var(--danger)",
                    borderRadius: "7px",
                    padding: "7px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Summary ────────── */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "20px",
          position: "sticky",
          top: "72px",
          minWidth: 0,
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px" }}>
            Order Summary
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {items.map(({ product, quantity }) => (
              <div key={product.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "8px",
                fontSize: "12px",
                color: "var(--text-muted)",
              }}>
                <span style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  flex: 1,
                  lineHeight: 1.4,
                }}>
                  {product.title} ×{quantity}
                </span>
                <span style={{
                  fontFamily: "var(--font-dm-mono)",
                  flexShrink: 0,
                  fontWeight: 500,
                  marginLeft: "4px",
                }}>
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: "1px solid var(--border)",
            marginTop: "14px",
            paddingTop: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontWeight: 600, fontSize: "14px" }}>Total</span>
            <span style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--accent)",
              fontFamily: "var(--font-dm-mono)",
            }}>
              ${totalPrice().toFixed(2)}
            </span>
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", padding: "12px", marginTop: "16px", fontSize: "14px" }}
          >
            Checkout
          </button>

          <button
            onClick={clearCart}
            style={{
              width: "100%",
              marginTop: "8px",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--danger)",
              borderRadius: "8px",
              padding: "9px",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

const qtyBtn: React.CSSProperties = {
  width: "26px",
  height: "26px",
  borderRadius: "6px",
  border: "1px solid var(--border)",
  background: "var(--bg-elevated)",
  color: "var(--text)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
  flexShrink: 0,
};