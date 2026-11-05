type SnappLogoProps = {
  variant?: "wordmark" | "mark" | "mark-small";
  release?: string; // color of the release arc; pass "currentColor" for one-color
  sting?: boolean;  // play the slip sting once on mount
  className?: string;
  title?: string;
};

export function SnappLogo({
  variant = "wordmark",
  release = "var(--color-volt-400)",
  sting = false,
  className,
  title = "Snapp",
}: SnappLogoProps) {
  const isWordmark = variant === "wordmark";
  const gap = variant === "mark-small" ? 7 : 4;
  const ox = isWordmark ? 9 : 0;

  return (
    <svg
      viewBox={isWordmark ? "-4 -40 224 58" : `-13 -40 ${gap === 7 ? 33 : 30} 44`}
      className={[className, sting ? "snapp-sting" : ""].join(" ")}
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth={7}
    >
      <path className="prep" d={`M${ox + 9} -27A9 9 0 1 0 ${ox} -18`} />
      <path className="release" stroke={release} d={`M${ox + gap} -18A9 9 0 1 1 ${ox + gap - 9} -9`} />
      {isWordmark && (
        <>
          <path d="M37 0V-39.5M37 -23A13 13 0 0 1 63 -23V0M114 -39.5V0M129 -39.5V17.5M180 -39.5V17.5" />
          <circle cx="96" cy="-18" r="18" />
          <circle cx="147" cy="-18" r="18" />
          <circle cx="198" cy="-18" r="18" />
        </>
      )}
    </svg>
  );
}