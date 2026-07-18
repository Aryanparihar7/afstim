export type FeedbackCategory = "bug" | "idea" | "confusing" | "other";

export const FEEDBACK_CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: "bug", label: "Something's broken" },
  { value: "idea", label: "An idea" },
  { value: "confusing", label: "This confused me" },
  { value: "other", label: "Something else" },
];
