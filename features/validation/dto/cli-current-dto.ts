import type { Check } from "@/features/content/types";

/**
 * `run` (present on command_succeeds checks) is the only executable string
 * that crosses this API boundary. It comes from a repo-committed mission
 * file — never from user input, never from the database. Do not route a DB
 * or request value into this field.
 */
export type CliCurrentDTO = {
  journeySlug: string;
  missionSlug: string;
  missionTitle: string;
  missionOrder: number;
  checks: Check[];
};
