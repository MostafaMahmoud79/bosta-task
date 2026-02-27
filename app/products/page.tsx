"use client";

import { useEffect, useState, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { fetchProducts, fetchCategories } from "@/services/product.service";
import { useProductsStore } from "@/store/productsStore";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/loader";
import Link from "next/link";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const { allProducts, setApiProducts, loadUserProducts } = useProductsStore();
  const { isAuthenticated, email } = useAuthStore();

  const [categories, setCategories] = useState<string[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc">("default");
const [selectedCat, setSelectedCat] = useState("all");
const [page, setPage] = useState(1);


  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([prods, cats]) => {
        setApiProducts(prods);
        setCategories(cats);
      })
      .catch(() => setError("Failed to load products. Please try again."))
      .finally(() => setLoading(false));
  }, []);


  useEffect(() => {
    if (isAuthenticated && email) {
      loadUserProducts(email);
    }

  }, [isAuthenticated, email]);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (selectedCat !== "all")
      list = list.filter((p) => p.category === selectedCat);
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [allProducts, selectedCat, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleCat = (c: string) => {
    setSelectedCat(c);
    setPage(1);
  };
  const handleSort = (s: typeof sortBy) => {
    setSortBy(s);
    setPage(1);
  };

  if (loading) return <Loader text="Fetching products..." />;
  if (error)
    return (
      <div style={{ textAlign: "center", padding: "80px 16px" }}>
        <p style={{ color: "var(--danger)", marginBottom: "16px" }}>{error}</p>
        <button
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );

  const allCategories = Array.from(
    new Set([...categories, ...allProducts.map((p) => p.category)])
  );

  return (
    <div className="page-wrapper">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(20px, 4vw, 28px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            Products
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        {isAuthenticated && (
          <Link
            href="/products/create"
            className="btn-primary"
            style={{ fontSize: "13px", padding: "9px 16px" }}
          >
            + Add Product
          </Link>
        )}
      </div>

      <div className="filters-bar">
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--text-muted)",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          <SlidersHorizontal size={13} /> Filters
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Category
          </span>
          <select
            value={selectedCat}
            onChange={(e) => handleCat(e.target.value)}
            className="input-base"
            style={{ width: "auto", padding: "5px 10px", fontSize: "12px" }}
          >
            <option value="all">All</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Price
          </span>
          <div style={{ display: "flex", gap: "4px" }}>
            {[
              { v: "default", l: "Default" },
              { v: "price_asc", l: "↑ Low" },
              { v: "price_desc", l: "↓ High" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => handleSort(o.v as typeof sortBy)}
                style={{
                  padding: "4px 9px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  cursor: "pointer",
                  border:
                    sortBy === o.v
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                  background:
                    sortBy === o.v
                      ? "rgba(232,213,176,0.1)"
                      : "transparent",
                  color:
                    sortBy === o.v ? "var(--accent)" : "var(--text-muted)",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                }}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {paginated.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 16px" }}>
          <p style={{ fontSize: "28px", marginBottom: "10px" }}>🔍</p>
          <p style={{ color: "var(--text-muted)" }}>No products found.</p>
        </div>
      ) : (
        <div className="products-grid">
          {paginated.map((product, i) => (
            <div
              key={product.id}
              style={{
                animation: "fadeIn 0.3s ease forwards",
                animationDelay: `${Math.min(i, 7) * 0.04}s`,
                opacity: 0,
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={paginBtnStyle(false, page === 1)}
          >
            <ChevronLeft size={15} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={paginBtnStyle(page === p, false)}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={paginBtnStyle(false, page === totalPages)}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function paginBtnStyle(
  active: boolean,
  disabled: boolean
): React.CSSProperties {
  return {
    minWidth: "34px",
    height: "34px",
    borderRadius: "8px",
    border: active
      ? "1px solid var(--accent)"
      : "1px solid var(--border)",
    background: active ? "rgba(232,213,176,0.12)" : "transparent",
    color: disabled
      ? "var(--border)"
      : active
      ? "var(--accent)"
      : "var(--text-muted)",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "13px",
    fontWeight: active ? 600 : 400,
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 6px",
    fontFamily: "var(--font-dm-sans), sans-serif",
  };
}