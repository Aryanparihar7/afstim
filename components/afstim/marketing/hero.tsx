import Link from "next/link";

import { Button } from "@/components/afstim/button";
import { Eyebrow } from "@/components/afstim/eyebrow";

function Hero() {
  return (
    <section className="mx-auto flex max-w-[1120px] flex-col items-start gap-6 px-4 py-24 sm:px-6 sm:py-32">
      <Eyebrow>Afstim</Eyebrow>
      <h1 className="max-w-[18ch] text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-text sm:text-[56px]">
        You can code. You&rsquo;ve never shipped.
      </h1>
      <p className="max-w-[42ch] text-[15px] leading-[1.65] text-muted">
        Ten missions. Your own editor. A live URL with your name on it.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="primary" size="md">
          <Link href="/register">Start the journey</Link>
        </Button>
        <Button asChild variant="secondary" size="md">
          <Link href="#missions">See the missions</Link>
        </Button>
      </div>
    </section>
  );
}

export { Hero };
