import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import StoreProvider from "@/components/providers/store-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CartDrawer from "@/components/cart/cart-drawer";
import AuthModal from "@/components/auth/auth-modal";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "IndustrialEdge.pk — Industrial Electronics & Tech Store",
  description: "Your trusted destination for cutting-edge electronics, industrial hardware, smart devices, and premium gadgets in Pakistan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${rubik.variable}`} suppressHydrationWarning>
      <body
        className={`min-h-full flex flex-col bg-[#ffffff] text-[#212529] ${rubik.className}`}
        suppressHydrationWarning
      >
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <AuthModal />
        </StoreProvider>
      </body>
    </html>
  );
}

