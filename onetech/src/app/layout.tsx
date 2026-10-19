import type { Metadata } from "next";
import StoreProvider from "@/components/providers/store-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "OneTech — Electronics Store",
  description: "Your trusted destination for cutting-edge electronics, smart devices, and premium gadgets.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#ffffff] text-[#212529] font-['Rubik',sans-serif]">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
