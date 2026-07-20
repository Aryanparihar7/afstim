import Link from "next/link";

import { Eyebrow } from "@/components/afstim/eyebrow";

export interface MissionHeaderProps {
  journeySlug: string;
  order: number;
  duration: number;
  title: string;
  objective: string;
}

function MissionHeader({ journeySlug, order, duration, title, objective }: MissionHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <Link
        href={`/journey/${journeySlug}`}
        className="w-fit text-[15px] text-muted hover:text-text"
      >
        ← Back to journey
      </Link>
      <div className="flex flex-col gap-2">
        <Eyebrow>
          Mission {String(order).padStart(2, "0")} · {duration} min
        </Eyebrow>
        <h1 className="text-[36px] font-medium tracking-[-0.02em] text-text">{title}</h1>
        <p className="max-w-[68ch] text-[17px] leading-[1.65] text-muted">{objective}</p>
      </div>
    </header>
  );
}

export { MissionHeader };
