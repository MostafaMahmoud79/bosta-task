"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetchCategories } from "@/services/product.service";
import { useAuthStore } from "@/store/authStore";
import { useProductsStore } from "@/store/productsStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Please select a category"),
  image: z.string().url("Please enter a valid image URL"),
});

type FormData = z.infer<typeof schema>;

export default function CreateProductPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, email } = useAuthStore();
  const addLocalProduct = useProductsStore((s) => s.addLocalProduct);

  const [categories, setCategories] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!email) return;
    addLocalProduct(
      {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image,
      },
      email
    );
    setSuccess(true);
    reset();
    setTimeout(() => setSuccess(false), 4000);
  };

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

  return (
    <div className="form-container">
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
        Back
      </button>

      <h1
        style={{
          fontSize: "clamp(20px, 4vw, 24px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          marginBottom: "6px",
        }}
      >
        Create Product
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "28px" }}>
        Your product will appear instantly in the listings.
      </p>

      {success && (
        <div
          style={{
            background: "rgba(85,200,122,0.1)",
            border: "1px solid var(--success)",
            borderRadius: "10px",
            padding: "14px",
            marginBottom: "22px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--success)",
            fontSize: "14px",
          }}
        >
          <CheckCircle size={17} />
          Product created and visible in the listings!
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "18px" }}
      >
        <Field label="Title *" error={errors.title?.message}>
          <input
            {...register("title")}
            className="input-base"
            placeholder="e.g. Premium Leather Wallet"
          />
        </Field>

        <Field label="Description *" error={errors.description?.message}>
          <textarea
            {...register("description")}
            className="input-base"
            rows={4}
            placeholder="Describe the product..."
          />
        </Field>

        <Field label="Price ($) *" error={errors.price?.message}>
          <input
            {...register("price")}
            type="number"
            step="0.01"
            min="0"
            className="input-base"
            placeholder="0.00"
          />
        </Field>

        <Field label="Category *" error={errors.category?.message}>
          <select {...register("category")} className="input-base">
            <option value="">Select a category...</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Image URL *" error={errors.image?.message}>
          <input
            {...register("image")}
            className="input-base"
            placeholder="https://example.com/image.jpg"
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          style={{ padding: "13px", fontSize: "14px", marginTop: "6px" }}
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </form>
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
          marginBottom: "6px",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
}