/**
 * Runs in `prebuild`. A broken mission fails the build with a readable
 * message naming the file, the field, and (where there's a closed set)
 * the valid options — not a surprise mid-mission for a learner.
 */
import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { load } from "js-yaml";

import { journeySchema } from "@/features/content/validators/journey-schema";
import {
  CHECK_TYPES,
  missionFrontmatterSchema,
} from "@/features/content/validators/mission-schema";

const CONTENT_ROOT = path.join(process.cwd(), "content", "journeys");

type FileError = { file: string; lines: string[] };

const errors: FileError[] = [];

function relPath(filePath: string): string {
  return path.relative(process.cwd(), filePath).split(path.sep).join("/");
}

function formatPath(segments: (string | number)[]): string {
  return segments.reduce<string>((acc, segment) => {
    if (typeof segment === "number") return `${acc}[${segment}]`;
    return acc ? `${acc}.${segment}` : String(segment);
  }, "");
}

/**
 * Checked ahead of the full schema parse so a typo'd check type gets the
 * exact "is not a valid check type" message the spec requires, instead of
 * Zod's generic discriminated-union failure.
 */
function findBadCheckTypes(data: unknown): string[] {
  if (typeof data !== "object" || data === null || !("checks" in data)) return [];
  const checks = (data as { checks: unknown }).checks;
  if (!Array.isArray(checks)) return [];

  const lines: string[] = [];
  checks.forEach((check, index) => {
    if (typeof check !== "object" || check === null || !("type" in check)) return;
    const type = (check as { type: unknown }).type;
    if (typeof type === "string" && !(CHECK_TYPES as readonly string[]).includes(type)) {
      lines.push(
        `checks[${index}].type: "${type}" is not a valid check type.`,
        `Valid types: ${CHECK_TYPES.join(", ")}`
      );
    }
  });
  return lines;
}

function validateMissionFile(filePath: string): void {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  const badCheckTypes = findBadCheckTypes(data);
  if (badCheckTypes.length > 0) {
    errors.push({ file: relPath(filePath), lines: badCheckTypes });
    return;
  }

  const result = missionFrontmatterSchema.safeParse(data);
  if (!result.success) {
    errors.push({
      file: relPath(filePath),
      lines: result.error.issues.map(
        (issue) => `${formatPath(issue.path as (string | number)[])}: ${issue.message}`
      ),
    });
  }
}

function validateJourneyDir(journeyDir: string): void {
  const yamlPath = path.join(journeyDir, "journey.yaml");
  if (!fs.existsSync(yamlPath)) {
    errors.push({ file: relPath(yamlPath), lines: ["journey.yaml is missing."] });
    return;
  }

  const raw = fs.readFileSync(yamlPath, "utf-8");
  const result = journeySchema.safeParse(load(raw));
  if (!result.success) {
    errors.push({
      file: relPath(yamlPath),
      lines: result.error.issues.map(
        (issue) => `${formatPath(issue.path as (string | number)[])}: ${issue.message}`
      ),
    });
    return;
  }

  const missionsDir = path.join(journeyDir, "missions");
  const files = fs.existsSync(missionsDir) ? fs.readdirSync(missionsDir) : [];

  for (const missionSlug of result.data.missions) {
    const match = files.find((name) => name.endsWith(`-${missionSlug}.mdx`));
    if (!match) {
      errors.push({
        file: relPath(yamlPath),
        lines: [
          `missions: "${missionSlug}" has no matching file in ${relPath(missionsDir)}.`,
        ],
      });
      continue;
    }
    validateMissionFile(path.join(missionsDir, match));
  }
}

function main(): void {
  const journeyDirs = fs.existsSync(CONTENT_ROOT)
    ? fs
        .readdirSync(CONTENT_ROOT, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(CONTENT_ROOT, entry.name))
    : [];

  for (const dir of journeyDirs) {
    validateJourneyDir(dir);
  }

  if (errors.length > 0) {
    for (const { file, lines } of errors) {
      console.error(`✗ ${file}`);
      for (const line of lines) {
        console.error(`  ${line}`);
      }
    }
    process.exit(1);
  }

  console.log(`✓ Content valid — ${journeyDirs.length} journey(s) checked.`);
}

main();
