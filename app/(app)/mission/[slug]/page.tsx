import { notFound, redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { auth } from "@/auth";
import { mdxComponents } from "@/components/afstim/mdx-components";
import { MissionChecks } from "@/components/afstim/mission-checks";
import { MissionHeader } from "@/components/afstim/mission-header";
import { getMission } from "@/features/content/services/content-service";
import { getJourneyProgress, startMission } from "@/features/progress/services/progress-service";

const JOURNEY_SLUG = "ship-your-first-app";

export default async function MissionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) notFound();

  const { rows } = await getJourneyProgress(session.user.id, JOURNEY_SLUG);
  const row = rows.find((r) => r.slug === slug);
  if (!row) notFound();

  if (row.state === "LOCKED") {
    redirect(`/journey/${JOURNEY_SLUG}?blocked=${row.slug}`);
  }

  await startMission(session.user.id, slug);

  const mission = getMission(slug);

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-10 px-4 py-12 sm:px-6">
      <MissionHeader
        journeySlug={JOURNEY_SLUG}
        order={mission.order}
        duration={mission.duration}
        title={mission.title}
        objective={mission.objective}
      />

      <div className="flex flex-col gap-4">
        <MDXRemote source={mission.body} components={mdxComponents} />
      </div>

      <hr className="border-border" />

      <MissionChecks checks={mission.checks} />
    </div>
  );
}
