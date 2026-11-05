// Dev-only playground for tuning the hold-to-approve duration and the snap sound.
// Mounted at /dev/hold only when running `npm run dev` (excluded from production builds).
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { SnappLogo } from "../components/SnappLogo";
import { playSnap, startSuction, type Suction } from "../lib/snapSound";
import "./HoldPlayground.css";

type Input = "mouse" | "touch" | "pen" | "keyboard" | "confirm";
type Attempt = {
  id: number;
  input: Input;
  holdMs: number;
  heldMs: number;
  outcome: "approved" | "released early";
  accidental: boolean;
};

const RING = 2 * Math.PI * 30;
const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export default function HoldPlayground() {
  const [holdMs, setHoldMs] = useState(750);
  const [soundOn, setSoundOn] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [snapped, setSnapped] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const active = useRef(false);
  const start = useRef(0);
  const input = useRef<Input>("mouse");
  const frame = useRef(0);
  const suction = useRef<Suction | null>(null);
  const nextId = useRef(1);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const record = (a: Omit<Attempt, "id" | "accidental" | "holdMs">) =>
    setAttempts((xs) => [{ ...a, id: nextId.current++, holdMs, accidental: false }, ...xs]);

  const approve = (via: Input, heldMs: number) => {
    if (soundOn) playSnap(volume);
    record({ input: via, heldMs, outcome: "approved" });
    setSnapped(true);
    window.setTimeout(() => {
      setSnapped(false);
      setProgress(0);
    }, 1200);
  };

  const begin = (via: Input) => {
    if (active.current || snapped) return;
    active.current = true;
    input.current = via;
    start.current = performance.now();
    setHolding(true);
    if (soundOn) suction.current = startSuction(holdMs, volume);
    const tick = () => {
      const p = Math.min(1, (performance.now() - start.current) / holdMs);
      setProgress(p);
      if (p >= 1) {
        active.current = false;
        suction.current = null;
        setHolding(false);
        approve(via, holdMs);
      } else {
        frame.current = requestAnimationFrame(tick);
      }
    };
    frame.current = requestAnimationFrame(tick);
  };

  const end = () => {
    if (!active.current) return;
    active.current = false;
    cancelAnimationFrame(frame.current);
    suction.current?.stop();
    suction.current = null;
    setHolding(false);
    setProgress(0); // ring drains back via CSS transition
    record({ input: input.current, heldMs: Math.round(performance.now() - start.current), outcome: "released early" });
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    begin(e.pointerType as Input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      if (!e.repeat) begin("keyboard");
    } else if (e.key === "Enter") {
      e.preventDefault();
      setConfirming(true);
    }
  };

  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      end();
    }
  };

  const approved = attempts.filter((a) => a.outcome === "approved");
  const early = attempts.filter((a) => a.outcome === "released early");
  const accidental = attempts.filter((a) => a.accidental);
  const lastApproved = approved[0];

  const markAccidental = () =>
    lastApproved &&
    setAttempts((xs) => xs.map((a) => (a.id === lastApproved.id ? { ...a, accidental: !a.accidental } : a)));

  const copyResults = () =>
    void navigator.clipboard?.writeText(JSON.stringify({ holdMs, attempts }, null, 2));

  return (
    <div className="hp">
      <div className="hp-head">
        <div className="eyebrow">Dev only · /dev/hold</div>
        <h1>Hold-to-approve playground</h1>
        <p className="hp-muted">
          Tune the hold duration and the snap sound. Hold the button with mouse, touch, or Space. Enter opens the
          confirmation alternative.
        </p>
      </div>

      <div className="hp-grid">
        <section className="hp-stage">
          <div className="hp-summary">
            <span>Sample run · v3 · 12 recipients</span>
            <span className="hp-amount">PHP 184,320.00</span>
          </div>

          <button
            type="button"
            className={`hp-snap${holding ? " is-holding" : ""}${snapped ? " is-snapped" : ""}`}
            onPointerDown={onPointerDown}
            onPointerUp={end}
            onPointerCancel={end}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onContextMenu={(e) => e.preventDefault()}
            aria-label={`Snap to approve. Hold for ${holdMs} milliseconds, or press Enter to confirm.`}
          >
            <svg className="hp-ring" viewBox="0 0 72 72" aria-hidden="true">
              <circle cx="36" cy="36" r="30" className="hp-ring-track" />
              <circle
                cx="36"
                cy="36"
                r="30"
                className="hp-ring-fill"
                strokeDasharray={RING}
                strokeDashoffset={RING * (1 - progress)}
              />
            </svg>
            <SnappLogo variant="mark" release="currentColor" className="hp-mark" title="" />
            <span>{snapped ? "Approved · v3 · locked" : "Snap to approve"}</span>
          </button>

          {confirming && (
            <div className="hp-confirm" role="dialog" aria-label="Confirm approval">
              <p>Approve run v3: 12 recipients, PHP 184,320.00?</p>
              <div className="hp-row">
                <button
                  type="button"
                  className="hp-btn hp-btn-primary"
                  autoFocus
                  onClick={() => {
                    setConfirming(false);
                    setProgress(1);
                    approve("confirm", 0);
                  }}
                >
                  Approve
                </button>
                <button type="button" className="hp-btn" onClick={() => setConfirming(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <p className="hp-live" aria-live="polite">
            {snapped ? "Run approved and locked." : holding ? "Holding…" : ""}
          </p>
        </section>

        <section className="hp-panel">
          <label className="hp-field">
            <span>
              Hold duration <strong className="hp-mono">{holdMs} ms</strong>
            </span>
            <input
              type="range"
              min={500}
              max={1000}
              step={25}
              value={holdMs}
              onChange={(e) => setHoldMs(Number(e.target.value))}
            />
          </label>

          <label className="hp-check">
            <input type="checkbox" checked={soundOn} onChange={(e) => setSoundOn(e.target.checked)} />
            Sound (suction while holding, snap on release)
          </label>

          <label className="hp-field">
            <span>
              Volume <strong className="hp-mono">{Math.round(volume * 100)}%</strong>
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </label>

          <div className="hp-row">
            <button type="button" className="hp-btn" onClick={() => startSuction(holdMs, volume)}>
              Play suction
            </button>
            <button type="button" className="hp-btn" onClick={() => playSnap(volume)}>
              Play snap
            </button>
            <button
              type="button"
              className="hp-btn"
              onClick={() => {
                startSuction(holdMs, volume);
                window.setTimeout(() => playSnap(volume), holdMs);
              }}
            >
              Play both
            </button>
          </div>

          <div className="hp-stats">
            <div>
              <span className="hp-muted">Approved</span>
              <strong>{approved.length}</strong>
            </div>
            <div>
              <span className="hp-muted">Released early</span>
              <strong>{early.length}</strong>
            </div>
            <div>
              <span className="hp-muted">Accidental</span>
              <strong>{accidental.length}</strong>
            </div>
            <div>
              <span className="hp-muted">Median early release</span>
              <strong className="hp-mono">{Math.round(median(early.map((a) => a.heldMs)))} ms</strong>
            </div>
          </div>

          <div className="hp-row">
            <button type="button" className="hp-btn" disabled={!lastApproved} onClick={markAccidental}>
              {lastApproved?.accidental ? "Unmark last approval" : "Last approval was accidental"}
            </button>
            <button type="button" className="hp-btn" disabled={!attempts.length} onClick={copyResults}>
              Copy results (JSON)
            </button>
            <button type="button" className="hp-btn" disabled={!attempts.length} onClick={() => setAttempts([])}>
              Reset
            </button>
          </div>

          <p className="hp-muted">
            When you settle on a value, set <code className="hp-mono">--dur-hold: {holdMs}ms;</code>
          </p>

          <ol className="hp-log">
            {attempts.map((a) => (
              <li key={a.id} className={a.accidental ? "is-accidental" : ""}>
                <span>{a.outcome}</span>
                <span className="hp-muted">{a.input}</span>
                <span className="hp-mono">
                  {a.input === "confirm" ? "dialog" : `${a.heldMs} / ${a.holdMs} ms`}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
