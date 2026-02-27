"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useProductsStore } from "@/store/productsStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const authLogin = useAuthStore((s) => s.login);
  const loadCart = useCartStore((s) => s.loadCart);
  const loadUserProducts = useProductsStore((s) => s.loadUserProducts);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    setApiError("");
    const err = authLogin(data.email, data.password);
    if (err) {
      setApiError(err);
      return;
    }
    const emailLower = data.email.toLowerCase().trim();
    loadCart(emailLower);
    loadUserProducts(emailLower);
    router.push("/products");
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 16px",
        background:
          "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,213,176,0.06) 0%, transparent 60%)",
      }}
    >
      <div className="auth-card">
        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "46px",
              height: "46px",
              background: "rgba(232,213,176,0.1)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <LogIn size={20} color="var(--accent)" />
          </div>
          <h1
            style={{
              fontSize: "21px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            Sign in to your account
          </p>
        </div>

        {/* Error */}
        {apiError && (
          <div
            style={{
              background: "rgba(232,85,85,0.1)",
              border: "1px solid var(--danger)",
              borderRadius: "8px",
              padding: "11px 14px",
              marginBottom: "18px",
              fontSize: "13px",
              color: "var(--danger)",
              lineHeight: 1.5,
            }}
          >
            {apiError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <Field label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              className="input-base"
              placeholder="you@example.com"
              autoComplete="email"
              type="email"
            />
          </Field>

          <Field label="Password" error={errors.password?.message}>
            <input
              {...register("password")}
              type="password"
              className="input-base"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ padding: "12px", fontSize: "14px", marginTop: "6px" }}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "13px",
            color: "var(--text-muted)",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 500,
          marginBottom: "5px",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          style={{
            color: "var(--danger)",
            fontSize: "12px",
            marginTop: "3px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}