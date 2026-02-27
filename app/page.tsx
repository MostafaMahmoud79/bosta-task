import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        textAlign: "center",
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,213,176,0.08) 0%, transparent 60%)",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "14px",
          border: "1px solid var(--border)",
          padding: "4px 14px",
          borderRadius: "100px",
          display: "inline-block",
        }}
      >
        Frontend Assessment — FakeStore API
      </div>

      <h1
        style={{
          fontSize: "clamp(36px, 8vw, 76px)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          maxWidth: "680px",
          marginBottom: "18px",
        }}
      >
        Bosta<span style={{ color: "var(--accent)" }}></span>
      </h1>

      <p
        style={{
          fontSize: "clamp(14px, 2vw, 16px)",
          color: "var(--text-muted)",
          maxWidth: "420px",
          lineHeight: 1.6,
          marginBottom: "36px",
        }}
      >
        A full-featured e-commerce app. Browse products, manage your cart, and
        create listings — all with per-user data isolation.
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Link
          href="/products"
          className="btn-primary"
          style={{ fontSize: "14px", padding: "12px 24px" }}
        >
          Browse Products →
        </Link>
        <Link
          href="/signup"
          style={{
            background: "transparent",
            color: "var(--text-muted)",
            fontWeight: 500,
            padding: "12px 24px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "14px",
            border: "1px solid var(--border)",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Sign Up Free
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          marginTop: "64px",
          maxWidth: "680px",
          width: "100%",
        }}
      >
        {[
          { icon: "🛍️", label: "Products",      desc: "Sort, filter & paginate" },
          { icon: "🛒", label: "Per-user Cart", desc: "Saved between sessions"  },
          { icon: "🔒", label: "Auth",          desc: "Register & login by email"},
          { icon: "✏️", label: "Add Products",  desc: "Visible instantly"       },
        ].map((f) => (
          <div
            key={f.label}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "18px 14px",
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "8px" }}>{f.icon}</div>
            <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: "3px" }}>
              {f.label}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {f.desc}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}