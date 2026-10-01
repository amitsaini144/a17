import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import SubscribeCard from "@/components/homepage/SubscribeCard";
import AuthProvider from "@/components/auth/AuthProvider";
import CartProvider from "@/components/cart/CartProvider";

const satoshi = localFont({
  display: 'swap',
  src: '../../public/fonts/satoshi.ttf',
  variable: '--font-satoshi',
});

export const metadata: Metadata = {
  title: "A17 - Framer Ecommerce Store",
  description: "Shop headphones, displays, smartwatches and phones at A17 — modern tech, thoughtfully designed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${satoshi.variable} font-satoshi antialiased bg-white`}
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <SubscribeCard />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
