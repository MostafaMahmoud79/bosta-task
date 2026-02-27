"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useProductsStore } from "@/store/productsStore";
import {
  ShoppingCart,
  Package,
  Plus,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { items, totalItems, loadCart } = useCartStore();
  const unloadCart = useCartStore((s) => s.unloadCart);
  const { isAuthenticated, username, email, logout } = useAuthStore();
  const clearUserProducts = useProductsStore((s) => s.clearUserProducts);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();


  useEffect(() => {
    if (isAuthenticated && email) {
      loadCart(email);
    }
  }, [isAuthenticated, email]); 

  const handleLogout = () => {
    logout();
    unloadCart();
    clearUserProducts();
    setMenuOpen(false);
    router.push("/products");
  };


  const count = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          height: "60px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontWeight: 700,
              fontSize: "17px",
              letterSpacing: "-0.02em",
              color: "var(--accent)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              flexShrink: 0,
            }}
          >
            <Package size={19} />
            Bosta
          </Link>

          {/* Desktop nav */}
          <nav
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
            className="sf-desktop-nav"
          >
            <Link href="/products" style={navStyle}>
              Products
            </Link>

            {isAuthenticated && (
              <Link href="/products/create" style={navStyle}>
                <Plus size={13} />
                Add
              </Link>
            )}

            {isAuthenticated && (
              <Link href="/cart" style={{ ...navStyle, position: "relative" }}>
                <ShoppingCart size={15} />
                Cart
                {count > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "var(--accent)",
                      color: "#0a0a0a",
                      borderRadius: "50%",
                      width: "17px",
                      height: "17px",
                      fontSize: "10px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 8px",
                    maxWidth: "130px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <User size={13} />
                  {username}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    ...navStyle,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--danger)",
                  }}
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                style={{
                  ...navStyle,
                  background: "var(--accent)",
                  color: "#0a0a0a",
                  fontWeight: 600,
                }}
              >
                <LogIn size={13} />
                Login
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="sf-hamburger"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "6px 8px",
              cursor: "pointer",
              color: "var(--text)",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="sf-mobile-menu"
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            zIndex: 49,
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border)",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <MobileLink href="/products" onClick={() => setMenuOpen(false)}>
            🛍️ Products
          </MobileLink>

          {isAuthenticated && (
            <MobileLink
              href="/products/create"
              onClick={() => setMenuOpen(false)}
            >
              ➕ Add Product
            </MobileLink>
          )}

          {isAuthenticated && (
            <MobileLink href="/cart" onClick={() => setMenuOpen(false)}>
              🛒 Cart{count > 0 ? ` (${count})` : ""}
            </MobileLink>
          )}

          {isAuthenticated ? (
            <>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  padding: "8px 12px",
                  borderTop: "1px solid var(--border)",
                  marginTop: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <User size={13} /> {username}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  ...mobileLinkStyle,
                  color: "var(--danger)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <MobileLink href="/login" onClick={() => setMenuOpen(false)}>
              🔑 Login
            </MobileLink>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .sf-desktop-nav { display: none !important; }
          .sf-hamburger   { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} onClick={onClick} style={mobileLinkStyle}>
      {children}
    </Link>
  );
}

const navStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  padding: "5px 10px",
  borderRadius: "7px",
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--text-muted)",
  textDecoration: "none",
  transition: "all 0.2s",
  border: "1px solid transparent",
  position: "relative",
  whiteSpace: "nowrap",
  background: "transparent",
};

const mobileLinkStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 12px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
  color: "var(--text)",
  textDecoration: "none",
  background: "var(--bg-elevated)",
};