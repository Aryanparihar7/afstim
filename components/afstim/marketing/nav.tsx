import Link from "next/link";

import { Button } from "@/components/afstim/button";
import { Eyebrow } from "@/components/afstim/eyebrow";

function Nav() {
  return (
    <nav className="border-b border-border">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" aria-label="Afstim home">
          <Eyebrow>Afstim</Eyebrow>
        </Link>
        <Button asChild variant="secondary" size="sm">
          <Link href="/register">Start the journey</Link>
        </Button>
      </div>
    </nav>
  );
}

export { Nav };
