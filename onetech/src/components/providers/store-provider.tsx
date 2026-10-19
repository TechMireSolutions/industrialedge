"use client";

import { StoreProvider } from "@/lib/store";

export default function StoreProviderWrapper({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
