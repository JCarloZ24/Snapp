import { describe, expect, it } from "vitest";
import {
  ideaRules,
  textLength,
  validateDate,
  validateReview,
  validateText,
} from "./validation";

describe("text validation", () => {
  it("rejects empty, whitespace and short input", () => {
    for (const input of [
      "",
      "   \n ",
      "\u200B".repeat(30),
      "\u0301".repeat(30),
      "short",
    ])
      expect(validateText(input, ideaRules)).toBeTruthy();
  });
  it("accepts exact boundaries and rejects overflow without truncation", () => {
    expect(validateText("a".repeat(20), ideaRules)).toBeUndefined();
    expect(validateText("a".repeat(280), ideaRules)).toBeUndefined();
    expect(validateText("a".repeat(281), ideaRules)).toBe(
      "Remove 1 character (maximum 280).",
    );
  });
  it("counts graphemes, preserving combining marks and joined emoji", () => {
    expect(textLength("  👩🏽‍💻e\u0301🇵🇭  ")).toBe(3);
    expect(textLength("👨‍👩‍👧‍👦".repeat(20))).toBe(20);
    expect(validateText("👨‍👩‍👧‍👦".repeat(20), ideaRules)).toBeUndefined();
  });
  it("permits multilingual text without stripping joining characters", () => {
    expect(validateText("مرحبا ".repeat(5), ideaRules)).toBeUndefined();
    expect(validateText("工作记录".repeat(5), ideaRules)).toBeUndefined();
  });
  it("allows an optional empty field but validates supplied content", () => {
    expect(validateText("", { ...ideaRules, required: false })).toBeUndefined();
    expect(validateText("x", { ...ideaRules, required: false })).toBeTruthy();
  });
});
describe("date validation", () => {
  const validate = (date: string | null) =>
    validateDate(date, "2024-01-01", "2026-12-31");
  it.each([
    null,
    "",
    "2026-2-03",
    "2026-02-29",
    "2026-04-31",
    "2026-13-01",
    "2026-00-10",
    "2026-11-00",
    "2026-11-06T00:00:00Z",
    "garbage",
  ])("rejects invalid date %s", (date) => expect(validate(date)).toBeTruthy());
  it("accepts leap day and both inclusive boundaries", () => {
    for (const date of ["2024-02-29", "2024-01-01", "2026-12-31"])
      expect(validate(date)).toBeUndefined();
  });
  it("rejects out-of-range dates", () => {
    expect(validate("2023-12-31")).toBeTruthy();
    expect(validate("2027-01-01")).toBeTruthy();
  });
});
describe("review contract", () => {
  it("rejects unknown dropdown values and missing date/reason", () => {
    const errors = validateReview({
      cutoff: "injected",
      date: null,
      reason: " ",
    });
    expect(Object.values(errors).every(Boolean)).toBe(true);
  });
  it("accepts only an available cutoff, bounded date and valid reason", () => {
    const errors = validateReview({
      cutoff: "first",
      date: "2026-11-06",
      reason: "Removed a duplicate two-hour entry.",
    });
    expect(Object.values(errors).every((value) => value === undefined)).toBe(
      true,
    );
  });
});
