import type { MissionFrontmatter } from "@/features/content/validators/mission-schema";

export type { Journey } from "@/features/content/validators/journey-schema";
export type {
  Check,
  MissionFrontmatter,
  Submission,
} from "@/features/content/validators/mission-schema";
export {
  CHECK_TYPES,
  LOCAL_CHECK_TYPES,
  REMOTE_CHECK_TYPES,
} from "@/features/content/validators/mission-schema";

export type MissionMeta = MissionFrontmatter;

export type Mission = MissionFrontmatter & {
  /** Raw MDX body, frontmatter stripped. Compiling to renderable JSX is the mission-page milestone's job (M13), not this one. */
  body: string;
};
