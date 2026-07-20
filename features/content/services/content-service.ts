import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { load } from "js-yaml";

import { journeySchema } from "@/features/content/validators/journey-schema";
import {
  LOCAL_CHECK_TYPES,
  REMOTE_CHECK_TYPES,
  missionFrontmatterSchema,
} from "@/features/content/validators/mission-schema";
import type { Check, Journey, Mission, MissionMeta } from "@/features/content/types";

const CONTENT_ROOT = path.join(process.cwd(), "content", "journeys");

// Read once per process (build, or server start), then served from memory.
// Zero DB queries — content is files, not rows.
const journeyCache = new Map<string, Journey>();
const missionCache = new Map<string, Mission>();

function readJourney(journeySlug: string): Journey {
  const cached = journeyCache.get(journeySlug);
  if (cached) return cached;

  const filePath = path.join(CONTENT_ROOT, journeySlug, "journey.yaml");
  const raw = fs.readFileSync(filePath, "utf-8");
  const journey = journeySchema.parse(load(raw));

  journeyCache.set(journeySlug, journey);
  return journey;
}

function findMissionFilePath(missionSlug: string): string {
  const journeyDirs = fs.existsSync(CONTENT_ROOT)
    ? fs.readdirSync(CONTENT_ROOT, { withFileTypes: true }).filter((e) => e.isDirectory())
    : [];

  for (const journeyDir of journeyDirs) {
    const missionsDir = path.join(CONTENT_ROOT, journeyDir.name, "missions");
    if (!fs.existsSync(missionsDir)) continue;

    const match = fs
      .readdirSync(missionsDir)
      .find((name) => name.endsWith(`-${missionSlug}.mdx`));
    if (match) return path.join(missionsDir, match);
  }

  throw new Error(`No mission file found for slug "${missionSlug}".`);
}

function readMission(missionSlug: string): Mission {
  const cached = missionCache.get(missionSlug);
  if (cached) return cached;

  const filePath = findMissionFilePath(missionSlug);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = missionFrontmatterSchema.parse(data);

  const mission: Mission = { ...frontmatter, body: content.trim() };
  missionCache.set(missionSlug, mission);
  return mission;
}

export function getJourney(slug: string): Journey {
  return readJourney(slug);
}

export function listMissions(journeySlug: string): MissionMeta[] {
  const journey = readJourney(journeySlug);
  return journey.missions
    .map((missionSlug) => readMission(missionSlug))
    .sort((a, b) => a.order - b.order);
}

export function getMission(slug: string): Mission {
  return readMission(slug);
}

export function getLocalChecks(slug: string): Check[] {
  const mission = readMission(slug);
  return mission.checks.filter((check) =>
    (LOCAL_CHECK_TYPES as readonly string[]).includes(check.type)
  );
}

export function getRemoteChecks(slug: string): Check[] {
  const mission = readMission(slug);
  return mission.checks.filter((check) =>
    (REMOTE_CHECK_TYPES as readonly string[]).includes(check.type)
  );
}
