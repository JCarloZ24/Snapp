import { useEffect, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { SnappLoading } from "../components/ui/SnappLoading";
import "./LibraryExtensions.css";

export function LoadingExamples({ reduced }: { reduced: boolean }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  return (
    <div className="lib-panel">
      <div className="lib-demo-toolbar" aria-label="Loading preview controls">
        <button
          className="lib-button"
          onClick={() => setState("loading")}
          disabled={state === "loading"}
        >
          Start loading
        </button>
        <button
          className="lib-button"
          onClick={() => setState("ready")}
          disabled={state !== "loading"}
        >
          Resolve preview
        </button>
        <button
          className="lib-button"
          onClick={() => setState("error")}
          disabled={state !== "loading"}
        >
          Simulate failure
        </button>
      </div>
      {state === "loading" ? (
        <SnappLoading reduced={reduced} label="Loading reviewed records..." />
      ) : (
        <div className="lib-loading-result" role="status">
          {state === "ready" ? (
            <>
              <Check aria-hidden="true" />
              <h3>Records ready</h3>
              <p>The pending view is replaced by its content.</p>
            </>
          ) : (
            <>
              <h3>Records could not load</h3>
              <p>Your changes are safe. Try loading again.</p>
              <button
                className="lib-button"
                onClick={() => setState("loading")}
              >
                Retry loading
              </button>
            </>
          )}
        </div>
      )}
      <p className="lib-note">
        Local preview: use the controls to resolve or fail. The logo loops
        through linked, infinity-like arcs and an open orbit while pending. No
        invented percentage or minimum wait.
      </p>
    </div>
  );
}

export function InteractionExamples({ reduced }: { reduced: boolean }) {
  const [shake, setShake] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [replay, setReplay] = useState(0);
  const area = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    setSeen(false);
    if (reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { root: area.current, threshold: 0.7 },
    );
    if (marker.current) observer.observe(marker.current);
    return () => observer.disconnect();
  }, [reduced, replay]);
  return (
    <div className="lib-grid lib-interactions">
      <article className="lib-panel">
        <h3>Hover, focus & press</h3>
        <p>Small feedback confirms which action you are about to take.</p>
        <button
          className="lib-button lib-motion-button"
          aria-pressed={pressed}
          onClick={() => setPressed((value) => !value)}
        >
          {pressed ? "Selected; click to reset" : "Try the interaction"}
        </button>
        <p className="lib-note">
          125 ms hover; immediate press. Keyboard focus stays visible.
        </p>
      </article>
      <article className="lib-panel">
        <h3>Validation nudge</h3>
        <p>
          A brief lateral nudge can reinforce a rejected submission. The error
          remains readable.
        </p>
        <div
          key={shake}
          className={shake && !reduced ? "lib-validation-nudge" : ""}
        >
          <p className="lib-nudge-message">Add a reason before submitting.</p>
        </div>
        <button className="lib-button" onClick={() => setShake((n) => n + 1)}>
          <RotateCcw size={16} />
          Preview nudge
        </button>
        <p className="lib-note">
          Opt-in specimen, never triggered on every keystroke.
        </p>
      </article>
      <article className="lib-panel lib-scroll-panel">
        <h3>One-time scroll entrance</h3>
        <p>
          Scroll the preview to reveal the note. Report figures and controls
          stay still.
        </p>
        <div
          className="lib-scroll-preview"
          ref={area}
          tabIndex={0}
          aria-label="Scrollable motion preview"
        >
          <p>Scroll down to the review note.</p>
          <div className="lib-scroll-spacer" />
          <div
            ref={marker}
            className={`lib-scroll-note ${seen && !reduced ? "is-seen" : ""}`}
          >
            Review complete. Continue when you are ready.
          </div>
        </div>
        <button
          className="lib-text-button"
          onClick={() => {
            area.current?.scrollTo({ top: 0, behavior: "instant" });
            setReplay((n) => n + 1);
          }}
        >
          Reset scroll preview
        </button>
      </article>
    </div>
  );
}
