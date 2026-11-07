"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

export { StoreProvider };

