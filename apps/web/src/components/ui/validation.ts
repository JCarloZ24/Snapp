import { parseDate } from "@internationalized/date";

/** Counts user-perceived characters, not UTF-16 code units. */
export function textLength(value: string): number {
  // Formatting-only input is not a reason. Preserve joiners in real multilingual
  // text; this check never rewrites what the user entered.
  if (!/[^\p{White_Space}\p{Cf}\p{Cc}\p{M}]/u.test(value)) return 0;
  return [
    ...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(
      value.normalize("NFC").trim(),
    ),
  ].length;
}

export type TextRules = {
  label: string;
  min: number;
  max: number;
  required?: boolean;
};
export function validateText(
  value: string,
  { label, min, max, required = true }: TextRules,
): string | undefined {
  const count = textLength(value);
  if (!count) return required ? `Enter ${label.toLowerCase()}.` : undefined;
  if (count < min)
    return `Add ${min - count} more ${min - count === 1 ? "character" : "characters"} (minimum ${min}).`;
  if (count > max)
    return `Remove ${count - max} ${count - max === 1 ? "character" : "characters"} (maximum ${max}).`;
  return undefined;
}

export function validateDate(
  value: string | null,
  min: string,
  max: string,
): string | undefined {
  if (!value) return "Choose a review date.";
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
      return "Enter a complete, valid date.";
    const date = parseDate(value);
    if (date.compare(parseDate(min)) < 0 || date.compare(parseDate(max)) > 0)
      return `Choose a date from ${min} through ${max}.`;
    return undefined;
  } catch {
    return "Enter a complete, valid date.";
  }
}

export const cutoffOptions = [
  {
    id: "first",
    label: "Nov 1–15, 2026",
    description: "First cutoff · Asia/Manila",
  },
  {
    id: "second",
    label: "Nov 16–30, 2026",
    description: "Second cutoff · Asia/Manila",
  },
] as const;
export const reasonRules: TextRules = {
  label: "an adjustment reason",
  min: 20,
  max: 240,
};
export const ideaRules: TextRules = { label: "an idea", min: 20, max: 280 };
export const reviewDateBounds = { min: "2026-11-01", max: "2026-12-15" };

export function validateReview(input: {
  cutoff: string;
  date: string | null;
  reason: string;
}) {
  return {
    cutoff: cutoffOptions.some((option) => option.id === input.cutoff)
      ? undefined
      : "Choose one of the available cutoffs.",
    date: validateDate(input.date, reviewDateBounds.min, reviewDateBounds.max),
    reason: validateText(input.reason, reasonRules),
  };
}
