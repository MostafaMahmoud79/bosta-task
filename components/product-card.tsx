"use client";

import Link from "next/link";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { ShoppingCart, Eye } from "lucide-react";
import { useState } from "react";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="card animate-fade-in"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <div
        style={{
          background: "var(--bg-elevated)",
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "200px",
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{
            maxHeight: "150px",
            maxWidth: "100%",
            objectFit: "contain",
            transition: "transform 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        />
      </div>

      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}
      >
        <span className="badge">{product.category}</span>

        <h2
          style={{
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "1.4",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "var(--text)",
          }}
        >
          {product.title}
        </h2>

        <p
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--accent)",
            fontFamily: "var(--font-dm-mono)",
            marginTop: "auto",
          }}
        >
          ${product.price.toFixed(2)}
        </p>

        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <Link
            href={`/products/${product.id}`}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              fontSize: "12px",
              textDecoration: "none",
              transition: "all 0.2s",
              background: "transparent",
            }}
          >
            <Eye size={13} />
            Details
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleAddToCart}
              style={{
                flex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                background: added ? "var(--success)" : "var(--accent)",
                color: "#0a0a0a",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <ShoppingCart size={13} />
              {added ? "Added!" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}