import { CheckRow } from "@/components/afstim/check-row";
import { Eyebrow } from "@/components/afstim/eyebrow";
import { Terminal, TerminalLine } from "@/components/afstim/terminal";
import type { Check } from "@/features/content/types";

export interface MissionChecksProps {
  checks: Check[];
}

function MissionChecks({ checks }: MissionChecksProps) {
  return (
    <section className="flex flex-col gap-4">
      <Eyebrow>How you&apos;ll know it worked</Eyebrow>
      <Terminal>
        <TerminalLine>npx afstim check</TerminalLine>
      </Terminal>
      <div className="flex flex-col gap-3">
        {checks.map((check) => (
          <CheckRow key={check.id} state="pending" label={check.label} hint={check.hint} />
        ))}
      </div>
    </section>
  );
}

export { MissionChecks };
