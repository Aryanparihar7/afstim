import type { ReactNode } from "react";

import { Footer } from "@/components/afstim/marketing/footer";
import { Nav } from "@/components/afstim/marketing/nav";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
