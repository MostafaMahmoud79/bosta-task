import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Bosta",
  description: "Modern e-commerce experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${dmMono.variable} antialiased`}
        style={{
          background: "var(--bg)",
          color: "var(--text)",
          minHeight: "100vh",
        }}
      >
        <Header />
        <main style={{ paddingTop: "60px", minHeight: "100vh" }}>
          {children}
        </main>
      </body>
    </html>
  );
}