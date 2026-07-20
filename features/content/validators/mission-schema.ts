import { z } from "zod";

// The closed set — PLAN.md Section 7. Exactly seven. Adding an eighth
// requires founder approval; do not add one to make a mission "work."
export const CHECK_TYPES = [
  "command_succeeds",
  "file_exists",
  "file_contains",
  "http_ok",
  "remote_http_ok",
  "remote_https_valid",
  "remote_repo_exists",
] as const;

export const LOCAL_CHECK_TYPES = [
  "command_succeeds",
  "file_exists",
  "file_contains",
  "http_ok",
] as const;

export const REMOTE_CHECK_TYPES = [
  "remote_http_ok",
  "remote_https_valid",
  "remote_repo_exists",
] as const;

const baseCheckFields = {
  id: z.string().min(1),
  label: z.string().min(1),
  // Every hint is something the founder actually said out loud when it
  // happened to him (PLAN.md Phase 9) — required, not decorative.
  hint: z.string().min(1),
};

const commandSucceedsCheck = z.object({
  ...baseCheckFields,
  type: z.literal("command_succeeds"),
  run: z.string().min(1),
  expectStdoutMatches: z.string().optional(),
});

const fileExistsCheck = z.object({
  ...baseCheckFields,
  type: z.literal("file_exists"),
  path: z.string().min(1),
});

const fileContainsCheck = z.object({
  ...baseCheckFields,
  type: z.literal("file_contains"),
  path: z.string().min(1),
  pattern: z.string().min(1),
});

const httpOkCheck = z.object({
  ...baseCheckFields,
  type: z.literal("http_ok"),
  url: z.string().min(1),
  expectStatus: z.number().int(),
  expectJsonPath: z.string().optional(),
});

const remoteHttpOkCheck = z.object({
  ...baseCheckFields,
  type: z.literal("remote_http_ok"),
  from: z.string().min(1),
  expectStatus: z.number().int(),
});

const remoteHttpsValidCheck = z.object({
  ...baseCheckFields,
  type: z.literal("remote_https_valid"),
  from: z.string().min(1),
});

const remoteRepoExistsCheck = z.object({
  ...baseCheckFields,
  type: z.literal("remote_repo_exists"),
  from: z.string().min(1),
});

export const checkSchema = z.discriminatedUnion("type", [
  commandSucceedsCheck,
  fileExistsCheck,
  fileContainsCheck,
  httpOkCheck,
  remoteHttpOkCheck,
  remoteHttpsValidCheck,
  remoteRepoExistsCheck,
]);

const submissionSchema = z.object({
  kind: z.enum(["public_url", "repo_url"]),
  label: z.string().min(1),
  placeholder: z.string().optional(),
});

export const missionFrontmatterSchema = z.object({
  slug: z.string().min(1),
  order: z.number().int().positive(),
  title: z.string().min(1),
  objective: z.string().min(1),
  capability: z.string().min(1),
  duration: z.number().int().positive(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  prerequisites: z.array(z.string()).default([]),
  optional: z.boolean().default(false),
  submissions: z.array(submissionSchema).default([]),
  checks: z.array(checkSchema).min(1),
  reflection: z.array(z.string()).default([]),
});

export type Check = z.infer<typeof checkSchema>;
export type Submission = z.infer<typeof submissionSchema>;
export type MissionFrontmatter = z.infer<typeof missionFrontmatterSchema>;
