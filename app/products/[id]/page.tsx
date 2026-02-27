"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useProductsStore } from "@/store/productsStore";
import { fetchProductById } from "@/services/product.service";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/types/product";
import Loader from "@/components/loader";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const allProducts = useProductsStore((s) => s.allProducts);
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;


    const numId = Number(id);
    const stored = allProducts.find((p) => p.id === numId);
    if (stored) {
  setTimeout(() => {
    setProduct(stored);
    setLoading(false);
  }, 0);
  return;
}


    fetchProductById(id)
      .then(setProduct)
      .catch(() => router.push("/products"))
      .finally(() => setLoading(false));

  }, [id, allProducts]);

  const handleAdd = () => {
    if (!product) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loader text="Loading product..." />;
  if (!product)
    return (
      <div style={{ textAlign: "center", padding: "80px 16px" }}>
        <p style={{ color: "var(--text-muted)" }}>Product not found.</p>
      </div>
    );

  return (
    <div className="page-wrapper" style={{ maxWidth: "960px" }}>
      <button
        onClick={() => router.back()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          background: "transparent",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          fontSize: "13px",
          marginBottom: "28px",
          padding: "6px 0",
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}
      >
        <ArrowLeft size={14} />
        Back to Products
      </button>

      <div className="detail-grid">
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "40px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{
              maxHeight: "260px",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              background: "var(--bg-elevated)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              alignSelf: "flex-start",
            }}
          >
            {product.category}
          </span>

          <h1
            style={{
              fontSize: "clamp(18px, 3vw, 22px)",
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
            }}
          >
            {product.title}
          </h1>

          {product.rating && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill={
                      i < Math.round(product.rating!.rate)
                        ? "var(--accent)"
                        : "transparent"
                    }
                    color={
                      i < Math.round(product.rating!.rate)
                        ? "var(--accent)"
                        : "var(--border)"
                    }
                  />
                ))}
              </div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>
          )}

          <p
            style={{
              fontSize: "clamp(24px, 4vw, 30px)",
              fontWeight: 700,
              color: "var(--accent)",
              fontFamily: "var(--font-dm-mono)",
              letterSpacing: "-0.02em",
            }}
          >
            ${product.price.toFixed(2)}
          </p>

          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              lineHeight: 1.7,
              borderTop: "1px solid var(--border)",
              paddingTop: "18px",
            }}
          >
            {product.description}
          </p>

          {isAuthenticated ? (
            <button
              onClick={handleAdd}
              className="btn-primary"
              style={{
                padding: "13px 20px",
                fontSize: "14px",
                background: added ? "var(--success)" : undefined,
                width: "100%",
              }}
            >
              <ShoppingCart size={15} />
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>
          ) : (
            <div
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "14px",
                textAlign: "center",
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              
               <a href="/login" style={{ color: "var(--accent)", textDecoration: "none" }}>
                Login
              </a>{" "}
              to add this product to your cart.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}