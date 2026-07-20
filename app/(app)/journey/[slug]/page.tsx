import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { Button } from "@/components/afstim/button";
import { Eyebrow } from "@/components/afstim/eyebrow";
import { MissionListItem } from "@/components/afstim/mission-list-item";
import { getJourney } from "@/features/content/services/content-service";
import { getJourneyProgress } from "@/features/progress/services/progress-service";

export default async function JourneyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ blocked?: string }>;
}) {
  const { slug } = await params;
  const { blocked } = await searchParams;
  const session = await auth();
  if (!session?.user) notFound();

  const journey = getJourney(slug);
  const { verifiedCount, totalCount, hasAnyProgress, rows } = await getJourneyProgress(
    session.user.id,
    slug
  );
  const firstMission = rows[0];
  const blockedRow = blocked ? rows.find((row) => row.slug === blocked) : undefined;

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-2">
        <Eyebrow>Journey</Eyebrow>
        <h1 className="text-[36px] font-medium tracking-[-0.02em] text-text">
          {journey.title}
        </h1>
        <p className="max-w-[68ch] text-[15px] leading-[1.65] text-muted">
          {journey.objective}
        </p>
        <p className="font-mono text-[13px] text-subtle">
          {verifiedCount} of {totalCount} verified
        </p>
      </header>

      {blockedRow?.state === "LOCKED" && blockedRow.blockerLabel ? (
        <div className="rounded-lg border border-border bg-surface p-4 text-[15px] text-muted">
          That mission is locked. {blockedRow.blockerLabel}
        </div>
      ) : null}

      {!hasAnyProgress && firstMission ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-border bg-surface p-6">
          <p className="text-[15px] leading-[1.65] text-muted">
            Mission 1 takes about 20 minutes. Start when you have a clear hour.
          </p>
          <Button asChild>
            <Link href={`/mission/${firstMission.slug}`}>Start mission 1</Link>
          </Button>
        </div>
      ) : null}

      <ol className="flex flex-col gap-1">
        {rows.map((row) => (
          <MissionListItem key={row.slug} {...row} />
        ))}
      </ol>
    </div>
  );
}
