import Link from "next/link";
import type { ReactNode } from "react";

import { Eyebrow } from "@/components/afstim/eyebrow";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="px-4 py-6 sm:px-6">
        <Link href="/" aria-label="Afstim home">
          <Eyebrow>Afstim</Eyebrow>
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
