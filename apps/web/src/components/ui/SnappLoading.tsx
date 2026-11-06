import "./loading.css";
import "../../design/tokens.css";

/** Mount for an actual pending operation; unmount when it resolves or fails. */
export function SnappLoading({
  label = "Loading your workspace",
  reduced = false,
}: {
  label?: string;
  reduced?: boolean;
}) {
  return (
    <div
      className="snapp-loading"
      data-reduced={reduced}
      role="status"
      aria-live="polite"
    >
      <svg
        className="snapp-loading-mark"
        viewBox="-34 -54 72 72"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="butt"
      >
        <g className="snapp-loading-orbit">
          <path className="snapp-loading-upper" d="M9 -27A9 9 0 1 0 0 -18" />
          <path
            className="snapp-loading-lower"
            d="M4 -18A9 9 0 1 1 -5 -9"
            stroke="var(--logo-release, currentColor)"
          />
        </g>
      </svg>
      <p>{label}</p>
    </div>
  );
}
