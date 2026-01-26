"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ComparisonBar } from "@/components/layout/comparison-bar";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Ocultar Navbar y Footer si estamos en /auth (login o registro)
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <ComparisonBar />}
      {!isAuthPage && <Footer />}
    </>
  );
}