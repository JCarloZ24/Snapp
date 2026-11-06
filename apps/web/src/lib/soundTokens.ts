/** Shared synthesis values for the Snapp sound specimens. Seconds unless named Ms. */
export const soundTokens = {
  defaultVolume: 0.35,
  logoReleaseMs: 310,
  holdMs: 750,
  cancelMs: 60,
  clickMs: 22,
  bodyMs: 60,
  tailMs: 800,
  clickHz: 1200,
  lowpassHz: 3500,
  popStartHz: 520,
  popEndHz: 360,
  thudGain: 0.12,
  warmthDb: 1.5,
  wetGain: 0.12,
} as const;
export const soundTokenDescriptions: Record<keyof typeof soundTokens, string> =
  {
    defaultVolume: "Default preview gain; sound starts off",
    logoReleaseMs: "Snap onset at the logo release, after prepare + hold",
    holdMs: "Preparation swell for the approval specimen",
    cancelMs: "Early-release fade, with no snap",
    clickMs: "Skin-click decay",
    bodyMs: "Short palm body; avoids a bass-heavy impact",
    tailMs: "Dark room impulse length",
    clickHz: "Skin-click band center",
    lowpassHz: "Roll off harsh high-frequency noise",
    popStartHz: "Palm pop starting pitch",
    popEndHz: "Palm pop ending pitch",
    thudGain: "Low-body gain",
    warmthDb: "Low-shelf warmth",
    wetGain: "Quiet reverb send",
  };
export const soundAssets = {
  snap: {
    path: "audio/finger-snap.wav",
    durationMs: 98.798,
    author: "Vinrax",
    license: "CC0-1.0",
    source: "https://opengameart.org/content/snap-of-the-fingers-sounds",
  },
} as const;
