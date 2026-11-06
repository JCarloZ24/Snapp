// Library navigation only. Design tokens live in src/design/tokens.ts.
export * from "../design/tokens";
export const categories = [
  "Overview",
  "Brand",
  "Color",
  "Typography",
  "Layout",
  "Elements",
  "Components",
  "Patterns",
  "Loading",
  "Reports",
  "Motion",
  "Sound",
  "3D studies",
  "Accessibility",
];
export const slug = (s: string) => s.toLowerCase().replaceAll(" ", "-");
