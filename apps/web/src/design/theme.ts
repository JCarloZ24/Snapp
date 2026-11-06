// Global design foundation: self-hosted fonts and generated design tokens.
// Import once from the app entry point. Defining tokens and @font-face rules
// does not restyle screens by itself; components opt in through
// data-snapp-theme and the semantic aliases (docs/DESIGN.md §3, §12).
import "@fontsource-variable/sora";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./tokens.css";

export type SnappTheme = "dark" | "light";
