import { SoundExamples, useLibrarySound } from "./SoundExamples";
import { LoadingExamples, InteractionExamples } from "./LibraryExtensions";
import { ReportExamples } from "./ReportExamples";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Layers,
  LockKeyhole,
  Moon,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  TriangleAlert,
  X,
  XCircle,
} from "lucide-react";
import { SnappLogo } from "../components/SnappLogo";
import {
  categories,
  durations,
  easings,
  palettes,
  slug,
  spacing,
  themes,
  controlThemes,
  tokenCSS,
  typography,
} from "./libraryTokens";
import "../design/theme";
import "./DesignLibrary.css";
import {
  SnappControlProvider,
  SnappSelect,
  SnappSwitch,
  SnappSlider,
  SnappTabs,
  SnappToastRegion,
  useSnappToasts,
} from "../components/ui/SnappControls";
import {
  ClientFeedbackExample,
  ValidationExamples,
} from "./ValidationExamples";
const workflowTabs = [
  "Owner review",
  "Employee statement",
  "Client evaluation",
  "Recipient results",
];
const studyTabs = ["Evidence depth", "Prepare & release", "Spatial stages"];
const feedbackStates = [
  "Ready",
  "Loading",
  "Empty",
  "Error",
  "Stale approval",
  "Partial completion",
  "Needs reconciliation",
];
const optionsFor = (values: string[]) =>
  values.map((value) => ({ id: value, label: value }));

const statusItems = [
  ["Draft", "neutral"],
  ["Prepared by agent", "agent"],
  ["Approved by owner", "human"],
  ["Awaiting claim", "attention"],
  ["Claim confirmed", "settled"],
  ["Needs check", "attention"],
  ["Failed", "stop"],
] as const;
function Badge({
  kind = "neutral",
  children,
}: {
  kind?: string;
  children: ReactNode;
}) {
  const Icon =
    kind === "settled"
      ? CheckCircle2
      : kind === "attention"
        ? TriangleAlert
        : kind === "stop"
          ? XCircle
          : kind === "agent"
            ? Sparkles
            : kind === "human"
              ? ShieldCheck
              : Layers;
  return (
    <span className={`lib-badge ${kind}`}>
      <Icon size={13} />
      {children}
    </span>
  );
}
function Panel({
  title,
  children,
  note,
}: {
  title: string;
  children: ReactNode;
  note?: string;
}) {
  return (
    <article className="lib-panel">
      <h3>{title}</h3>
      {children}
      {note && <p className="lib-note">{note}</p>}
    </article>
  );
}

export default function DesignLibrary() {
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    new URLSearchParams(window.location.search).get("theme") === "light"
      ? "light"
      : "dark",
  );
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("Overview");
  const [reduce, setReduce] = useState(false);
  const [systemReduce, setSystemReduce] = useState(false);
  const [width, setWidth] = useState("Fluid");
  const { toasts, notify: setAnnouncement, dismiss } = useSnappToasts();
  const [motion, setMotion] = useState(0);
  const sound = useLibrarySound();
  const [study, setStudy] = useState("Evidence depth");
  const [depth, setDepth] = useState(40);
  const [tilt, setTilt] = useState(-16);
  const [expanded, setExpanded] = useState(true);
  const [stage, setStage] = useState(0);
  const [state, setState] = useState("Ready");
  const [tab, setTab] = useState("Owner review");
  const [approved, setApproved] = useState(false);
  const [holding, setHolding] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const reduced = reduce || systemReduce;
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduce(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const o = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting)
            setActive(e.target.getAttribute("data-category") || "Overview");
      },
      { rootMargin: "-10% 0px -65% 0px" },
    );
    document.querySelectorAll(".lib-section").forEach((el) => o.observe(el));
    return () => o.disconnect();
  }, [query]);
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setAnnouncement(`Copied ${value}`);
    } catch {
      setAnnouncement(
        "Clipboard unavailable. Select the displayed value to copy.",
        "error",
      );
    }
  };
  const approve = () => {
    setHolding(false);
    setApproved(true);
    setApprovalNote("Preview approved · v3 · locked. No payment sent.");
    if (dialog.current?.open) dialog.current.close();
  };
  const cancel = useCallback(() => {
    clearTimeout(timer.current);
    setHolding(false);
  }, []);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) cancel();
    };
    window.addEventListener("blur", cancel);
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.removeEventListener("blur", cancel);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [cancel]);
  useEffect(() => {
    cancel();
  }, [query, cancel]);
  const exportTokens = () => {
    const url = URL.createObjectURL(new Blob([tokenCSS], { type: "text/css" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "snapp-draft-tokens.css";
    a.click();
    URL.revokeObjectURL(url);
  };
  const match = (...s: string[]) =>
    !query.trim() ||
    s.join(" ").toLowerCase().includes(query.trim().toLowerCase());
  const navigateSection = (name: string, pointer = false) => {
    setQuery("");
    setActive(name);
    requestAnimationFrame(() => {
      window.history.replaceState(null, "", `#${slug(name)}`);
      document.getElementById(slug(name))?.scrollIntoView({
        block: "start",
        behavior: reduced || !pointer ? "instant" : "smooth",
      });
    });
  };
  let matchedCategories = 0;
  const section = (
    name: string,
    description: string,
    children: ReactNode,
    keywords = "",
  ) =>
    match(name, description, keywords)
      ? (++matchedCategories,
        (
          <section id={slug(name)} data-category={name} className="lib-section">
            <div className="lib-section-heading">
              <div>
                <h2>{name}</h2>
                <p>{description}</p>
              </div>
            </div>
            {children}
          </section>
        ))
      : null;
  return (
    <SnappControlProvider theme={theme} reduced={reduced}>
      <div
        className="snapp-library snapp-ui"
        data-snapp-theme={theme}
        data-reduced={reduced}
      >
        <a className="lib-skip" href="#library-content">
          Skip to library content
        </a>
        <aside className="lib-sidebar">
          <a
            href="#overview"
            aria-label="Snapp library home"
            onClick={(event) => {
              event.preventDefault();
              navigateSection("Overview", event.detail > 0);
            }}
          >
            <SnappLogo className="lib-logo" release="var(--logo-release)" />
          </a>
          <div className="lib-edition">
            DESIGN LIBRARY <span>V0.2</span>
          </div>
          <nav aria-label="Library categories">
            {categories.map((name) => (
              <a
                key={name}
                href={`#${slug(name)}`}
                className={active === name ? "selected" : ""}
                aria-current={active === name ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  navigateSection(name, event.detail > 0);
                }}
              >
                {name}
                {name === "3D studies" && <span className="lib-new">LAB</span>}
              </a>
            ))}
          </nav>
          <div className="lib-sidebar-bottom">
            <span className="lib-dot" /> Draft for team review
            <p>Prepare. Release. Snapp.</p>
            <a href="/">
              Back to app <ArrowUpRight size={14} />
            </a>
          </div>
        </aside>
        <div className="lib-workspace">
          <header className="lib-toolbar">
            <label className="lib-search">
              <Search size={16} />
              <input
                aria-label="Search library and tokens"
                placeholder="Find a token, component, or pattern…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button aria-label="Clear search" onClick={() => setQuery("")}>
                  <X size={16} />
                </button>
              )}
            </label>
            <div className="lib-toolbar-actions">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={`Switch to ${theme === "dark" ? "Paper" : "Ink"} theme`}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span>{theme === "dark" ? "Ink" : "Paper"}</span>
              </button>
              <SnappSwitch
                label={
                  systemReduce ? "Reduced motion (system)" : "Reduced motion"
                }
                selected={reduced}
                disabled={systemReduce}
                onChange={setReduce}
              />
              <button onClick={exportTokens}>
                <Download size={16} />
                <span>Tokens</span>
              </button>
            </div>
          </header>
          <main id="library-content" className="lib-main">
            <SnappToastRegion toasts={toasts} dismiss={dismiss} />
            <h1 className="lib-page-title">Snapp design library</h1>
            {section(
              "Overview",
              "A shared language for the moments that matter.",
              <>
                <div className="lib-hero">
                  <div>
                    <h2 className="lib-hero-title">
                      Exact by design.
                      <br />
                      <span>Fast by preparation.</span>
                    </h2>
                    <p>
                      From the first review to the final receipt.
                      <br />
                      One system. Two hands. A clear trail.
                    </p>
                    <a
                      className="lib-button primary"
                      href="#color"
                      onClick={() => setQuery("")}
                    >
                      Explore the foundations <ArrowDown size={16} />
                    </a>
                  </div>
                  <div className="lib-hero-mark">
                    <SnappLogo variant="mark" release="var(--logo-release)" />
                    <span>THE GAP IS THE SNAP.</span>
                  </div>
                </div>
                <div className="lib-principles">
                  <div>
                    <span className="human">HUMAN AUTHORITY</span>
                    <h3>Only you release.</h3>
                    <p>Volt marks the owner's exact approval.</p>
                  </div>
                  <div>
                    <span className="agent">AGENT ACTIVITY</span>
                    <h3>Prepared, not presumed.</h3>
                    <p>Ultraviolet marks assistance and execution.</p>
                  </div>
                  <div>
                    <span className="settled">VERIFIED OUTCOME</span>
                    <h3>Proof before celebration.</h3>
                    <p>Only teal means funds were claimed.</p>
                  </div>
                </div>
                <p className="lib-disclaimer">
                  Draft brand direction · Fictional previews · No transfers.
                  Company adoption awaits approval. Proyekto and bank workflows
                  are proposed, not implemented.
                </p>
              </>,
            )}
            {section(
              "Brand",
              "The Slip S. Two arcs, one deliberate gap.",
              <>
                <div className="lib-grid">
                  <Panel
                    title="Primary wordmark"
                    note="Paper + Volt on Ink. Minimum width 72 px."
                  >
                    <div className="lib-logo-board ink">
                      <SnappLogo release="#D4FF3F" />
                    </div>
                  </Panel>
                  <Panel
                    title="On Paper"
                    note="One-color Ink. Never Volt on a light surface."
                  >
                    <div className="lib-logo-board paper">
                      <SnappLogo release="currentColor" />
                    </div>
                  </Panel>
                  <Panel
                    title="Mark family"
                    note="4-unit gap; 7-unit gap under 24 px. Flat caps, always."
                  >
                    <div className="lib-mark-family">
                      <SnappLogo variant="mark" release="var(--logo-release)" />
                      <SnappLogo
                        variant="mark-small"
                        release="var(--logo-release)"
                      />
                      <span>16 / 24 / 48</span>
                    </div>
                  </Panel>
                  <Panel
                    title="Construction"
                    note="Keep one bowl-height clear space. No distortion, gradients, glow or rotating the logo."
                  >
                    <dl className="lib-facts">
                      <dt>Stroke / cap</dt>
                      <dd>7 / butt</dd>
                      <dt>Arc radius</dt>
                      <dd>9 units</dd>
                      <dt>x-height</dt>
                      <dd>36 units</dd>
                      <dt>Wordmark</dt>
                      <dd>Artwork, never typed</dd>
                    </dl>
                  </Panel>
                </div>
                <details>
                  <summary>View the supplied source sheet</summary>
                  <img
                    loading="lazy"
                    width="680"
                    height="830"
                    className="lib-source-sheet"
                    src="/brand/snapp_logo_final_slip_s_v1.svg"
                    alt="Supplied Snapp Slip S v1 logo reference sheet"
                  />
                  <p className="lib-note">
                    Reference artwork preserved. Usage follows SNAPP_BRAND.md;
                    the construction diagram's green arc on Paper is not a
                    production logo variant.
                  </p>
                </details>
              </>,
              "logo slip svg clear space",
            )}
            {section(
              "Color",
              "Color tells you whose hand moved it. Never confuse approval with receipt.",
              <>
                {Object.entries(palettes).map(([name, items]) => (
                  <div className="lib-palette" key={name}>
                    <h3>
                      {name}
                      <span>
                        {name === "Volt"
                          ? "Human authority"
                          : name === "Ultraviolet"
                            ? "Agent presence"
                            : name === "Semantic"
                              ? "Evidence-led states"
                              : "The quiet foundation"}
                      </span>
                    </h3>
                    <div className="lib-swatches">
                      {items
                        .filter(([n, v]) => match("Color", name, n, v))
                        .map(([n, v]) => (
                          <button
                            className="lib-swatch"
                            key={n}
                            onClick={() => copy(v)}
                            aria-label={`Copy ${n} ${v}`}
                          >
                            <span style={{ background: v }} />
                            <strong>{n}</strong>
                            <code>
                              {v} <Copy size={11} />
                            </code>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
                <Panel title="Semantic aliases · Ink / Paper">
                  <div className="lib-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Token</th>
                          <th>Ink</th>
                          <th>Paper</th>
                          <th>Usage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...themes, ...controlThemes].map(([n, d, l, u]) => (
                          <tr key={n}>
                            <td>
                              <code>--{n}</code>
                            </td>
                            <td>{d}</td>
                            <td>{l}</td>
                            <td>{u}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              </>,
              Object.values(palettes).flat().flat().join(" "),
            )}
            {section(
              "Typography",
              "Sora sets the tone. Geist carries the work. Geist Mono keeps it exact.",
              <div className="lib-type-list">
                {typography
                  .filter(([n]) => match("Typography", n, "Sora Geist Mono"))
                  .map(([name, size, line, font, weight, tracking]) => (
                    <div className="lib-type-row" key={name}>
                      <div>
                        <code>{name}</code>
                        <small>
                          {font} {weight} · {size}/{line}
                        </small>
                      </div>
                      <div
                        className="lib-type-specimen"
                        style={{
                          fontFamily: `'${font} Variable'`,
                          fontSize: size,
                          lineHeight: `${line}px`,
                          fontWeight: weight,
                          letterSpacing: tracking,
                        }}
                      >
                        {name.includes("amount")
                          ? "PHP 12,450.00"
                          : name === "mono"
                            ? "125.0000000 XLM · Testnet"
                            : name === "label"
                              ? "PREPARE. RELEASE. SNAPP."
                              : "Pay fast, in a snap."}
                      </div>
                    </div>
                  ))}
                <p className="lib-note">
                  12 px minimum. Money is right-aligned, tabular and never
                  abbreviated. PHP: two decimals. XLM: explicit asset and
                  Testnet label. Cutoff: Nov 1–15, 2026 · Asia/Manila.
                </p>
              </div>,
              typography.map((t) => t[0]).join(" "),
            )}
            {section(
              "Layout",
              "A 4 px base, quiet hairlines, and space to make a considered decision.",
              <>
                <div className="lib-grid">
                  <Panel title="Spacing scale">
                    <div className="lib-space-list">
                      {spacing.map((n) => (
                        <div key={n}>
                          <code>space-{n}</code>
                          <span style={{ width: n }} />
                          <small>{n}px</small>
                        </div>
                      ))}
                    </div>
                  </Panel>
                  <Panel title="Shape & elevation">
                    <div className="lib-radius-list">
                      {[4, 8, 12, 20].map((n) => (
                        <div key={n} style={{ borderRadius: n }}>
                          {n}
                          <small>px</small>
                        </div>
                      ))}
                    </div>
                    <p className="lib-note">
                      Small 4 · Controls 8 · Cards 12 · Sheets 20 · Chips full ·
                      App icons 22%.
                    </p>
                    <p>
                      Dark elevation uses lighter surfaces. Paper uses one soft
                      shadow per level.
                    </p>
                    <div className="lib-elevation">
                      <span>Base</span>
                      <span>Surface</span>
                      <span>Raised</span>
                    </div>
                  </Panel>
                </div>
                <Panel title="Responsive grid">
                  <div className="lib-grid-sample">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <p className="lib-note">
                    12 columns · 24 px gutter · 1280 px maximum. Mobile: 4
                    columns / 16 px gutters. Rows: 44 px default / 36 px
                    compact; interactive targets remain at least 44 × 44 px.
                  </p>
                </Panel>
              </>,
              "spacing radius borders grid elevation density",
            )}
            {section(
              "Elements",
              "A small vocabulary, used with intention.",
              <div className="lib-grid three">
                <Panel
                  title="Slip divider"
                  note="Preparation → release boundary."
                >
                  <div className="lib-slip">
                    <span />
                    <i />
                    <span />
                  </div>
                </Panel>
                <Panel title="Transient line" note="One attack, a short decay.">
                  <svg
                    viewBox="0 0 300 70"
                    className="lib-transient"
                    aria-hidden="true"
                  >
                    <path d="M0 38H115L124 38L133 8L141 60L149 25L157 42L167 38H300" />
                  </svg>
                </Panel>
                <Panel title="Echo rings" note="One-shot approval resonance.">
                  <div className="lib-rings">
                    <i />
                    <i />
                    <i />
                  </div>
                </Panel>
                <Panel
                  title="Tempo ticks"
                  note="Cutoffs and preparation rhythm."
                >
                  <div className="lib-ticks">
                    {Array.from({ length: 15 }, (_, i) => (
                      <i key={i} />
                    ))}
                  </div>
                  <code>01 ————————— 15</code>
                </Panel>
                <Panel title="Evidence stack" note="Every amount has a trace.">
                  <div className="lib-evidence">
                    <Layers size={20} />
                    Versioned evidence
                  </div>
                </Panel>
                <Panel
                  title="Unconfirmed hatch"
                  note="Reserved for unknown outcomes. Reconcile before retry."
                >
                  <div className="lib-hatch">
                    <TriangleAlert size={20} />
                    Needs check
                  </div>
                </Panel>
              </div>,
              "dividers transient echo tempo evidence hatching",
            )}
            {section(
              "Components",
              "Consistent controls, explicit states, no hidden authority.",
              <>
                <div className="lib-grid">
                  <Panel
                    title="Actions"
                    note="One Volt primary action per product view. This library intentionally compares variants."
                  >
                    <div className="lib-inline">
                      <button
                        className="lib-button primary"
                        onClick={() => dialog.current?.showModal()}
                      >
                        Review approval <ArrowUpRight size={16} />
                      </button>
                      <button
                        className="lib-button"
                        onClick={() =>
                          setAnnouncement("Secondary action preview selected.")
                        }
                      >
                        Secondary
                      </button>
                      <button className="lib-button" disabled>
                        Unavailable
                      </button>
                      <button
                        className="lib-button danger"
                        onClick={() =>
                          setAnnouncement(
                            "Rejected preview. No records changed.",
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </Panel>
                  <Panel
                    title="Custom notifications"
                    note="Info closes after six seconds; hover, focus, or a hidden tab pauses the timer. Warnings and errors stay until dismissed. No generic success teal."
                  >
                    <div className="lib-inline">
                      <button
                        className="lib-button"
                        onClick={() =>
                          setAnnouncement(
                            "Information example. Review details are ready to inspect.",
                          )
                        }
                      >
                        Show info
                      </button>
                      <button
                        className="lib-button"
                        onClick={() =>
                          setAnnouncement(
                            "Approval is stale. Review the changed hours before approving a new version.",
                            "warning",
                          )
                        }
                      >
                        Show warning
                      </button>
                      <button
                        className="lib-button"
                        onClick={() =>
                          setAnnouncement(
                            "Review could not be validated. Correct the marked fields and try again.",
                            "error",
                          )
                        }
                      >
                        Show error
                      </button>
                    </div>
                  </Panel>
                  <Panel title="Status vocabulary">
                    <div className="lib-inline">
                      {statusItems.map(([s, k]) => (
                        <Badge key={s} kind={k}>
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </Panel>
                  <Panel title="Feedback & recovery">
                    <SnappSelect
                      label="Preview state"
                      value={state}
                      onChange={setState}
                      options={optionsFor(feedbackStates)}
                    />
                    <div
                      className={`lib-feedback ${state === "Needs reconciliation" ? "lib-hatch" : ""}`}
                      role="status"
                    >
                      {state === "Ready"
                        ? "Ready for owner review."
                        : state === "Loading"
                          ? "Loading reviewed records…"
                          : state === "Empty"
                            ? "No reviewed hours in this cutoff. Select another period."
                            : state === "Error"
                              ? "Records could not be loaded. Check the connection before retrying."
                              : state === "Stale approval"
                                ? "Inputs changed. A new version needs owner approval."
                                : state === "Partial completion"
                                  ? "1 confirmed · 1 unresolved. Inspect each recipient."
                                  : "Outcome unknown · Last checked 14:32 PHT. Reconcile before retry."}
                    </div>
                  </Panel>
                </div>
                <ValidationExamples notify={setAnnouncement} />
              </>,
              "buttons input select dropdown calendar date picker toast notifications idea text length validation badges dialog loading error empty stale partial",
            )}
            {section(
              "Patterns",
              "The product journey, assembled from the same parts.",
              <>
                <div className="lib-pattern-toolbar">
                  <SnappTabs
                    label="Workflow preview"
                    options={workflowTabs}
                    value={tab}
                    onChange={setTab}
                    panelId="workflow-panel"
                  />
                  <div className="lib-viewport-select">
                    <SnappSelect
                      label="Preview width"
                      value={width}
                      onChange={setWidth}
                      options={optionsFor(["Fluid", "360", "768", "1280"])}
                    />
                  </div>
                </div>
                <div className="lib-preview-outer">
                  <div
                    id="workflow-panel"
                    role="tabpanel"
                    aria-labelledby={`workflow-panel-${workflowTabs.indexOf(tab)}`}
                    tabIndex={0}
                    className="lib-preview"
                    style={{
                      maxWidth: width === "Fluid" ? "100%" : `${width}px`,
                    }}
                  >
                    <div className="lib-preview-head">
                      <span className="lib-preview-label">
                        Fictional workflow preview
                      </span>
                      <Badge>
                        {tab === "Employee statement"
                          ? "Own data only"
                          : "Nov 1–15, 2026"}
                      </Badge>
                    </div>
                    <div className="lib-stage-bar">
                      {["Prepare", "Review", "Snap", "Settle"].map((s, i) => (
                        <span key={s} className={i === 1 ? "current" : ""}>
                          0{i + 1}/ {s}
                        </span>
                      ))}
                    </div>
                    <h3>
                      {tab === "Owner review"
                        ? "A clear view before the release."
                        : tab === "Employee statement"
                          ? "Your work. Your pay breakdown."
                          : tab === "Client evaluation"
                            ? "Feedback belongs to a version."
                            : "Every recipient, accounted for."}
                    </h3>
                    {tab === "Owner review" ? (
                      <>
                        <div className="lib-inline">
                          <Badge kind="agent">Prepared by agent</Badge>
                          <Badge kind="attention">Owner review required</Badge>
                        </div>
                        <div className="lib-table-wrap">
                          <table>
                            <thead>
                              <tr>
                                <th>Employee / project</th>
                                <th>Submitted</th>
                                <th>Reviewed</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  Alex Rivera
                                  <small>Website · Evidence v2</small>
                                </td>
                                <td>40.0 h</td>
                                <td>38.0 h</td>
                                <td className="lib-money">PHP 11,400.00</td>
                              </tr>
                              <tr>
                                <td>
                                  Sam Cruz<small>Identity · Evidence v1</small>
                                </td>
                                <td>32.0 h</td>
                                <td>32.0 h</td>
                                <td className="lib-money">PHP 9,600.00</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="lib-note">
                          Illustrative PHP calculations only. Owner reviews
                          hours manually; client acceptance does not
                          automatically gate wages.
                        </p>
                      </>
                    ) : tab === "Employee statement" ? (
                      <>
                        <div className="lib-statement">
                          <span>Alex Rivera · Hourly agreement v2</span>
                          <strong className="lib-money">PHP 11,400.00</strong>
                        </div>
                        <dl className="lib-facts">
                          <dt>Submitted / approved</dt>
                          <dd>40.0 / 38.0 h</dd>
                          <dt>Applicable rate</dt>
                          <dd>PHP 300.00 / h</dd>
                          <dt>Review correction</dt>
                          <dd>−2.0 h · Duplicate time entry</dd>
                          <dt>Adjustments</dt>
                          <dd>PHP 0.00</dd>
                        </dl>
                        <button
                          className="lib-button"
                          onClick={() =>
                            setAnnouncement(
                              "Discrepancy preview: a correction would preserve the original statement and require reapproval.",
                            )
                          }
                        >
                          Raise a discrepancy
                        </button>
                      </>
                    ) : tab === "Client evaluation" ? (
                      <>
                        <Badge>Website delivery · v2</Badge>
                        <p>
                          Source: proposed Proyekto reference · Evaluation
                          retained with this version.
                        </p>
                        <ClientFeedbackExample notify={setAnnouncement} />
                      </>
                    ) : (
                      <>
                        <div className="lib-result">
                          <span>Alex · 1.0000000 XLM · Testnet</span>
                          <Badge kind="settled">Claim confirmed · sample</Badge>
                        </div>
                        <div className="lib-result lib-hatch">
                          <span>Sam · 1.0000000 XLM · Testnet</span>
                          <Badge kind="attention">Needs check · sample</Badge>
                        </div>
                        <p>
                          Partial outcome. Authorization is not a claim;
                          reconcile the unresolved item before retrying.
                        </p>
                        <p className="lib-note">
                          No real transaction hashes or settlement evidence.
                          Velo client collection is a separate flow and does not
                          fund these payouts.
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <Panel title="Exact-run approval specimen">
                  <div className="lib-approval">
                    <div>
                      <Badge>Fictional Testnet snapshot · v3</Badge>
                      <h3>2 recipients. One exact approval.</h3>
                      <strong className="lib-total">
                        2.0000000 XLM · Testnet
                      </strong>
                      <p>
                        Alex: 1.0000000 XLM · Testnet
                        <br />
                        Sam: 1.0000000 XLM · Testnet
                      </p>
                      <small>
                        Recipient verification and payment safeguards are
                        simulated, not connected.
                      </small>
                    </div>
                    <div>
                      <button
                        className={`lib-button primary lib-hold ${holding ? "holding" : ""}`}
                        disabled={approved}
                        onPointerDown={(e) => {
                          if (
                            e.button !== 0 ||
                            !e.isPrimary ||
                            holding ||
                            approved
                          )
                            return;
                          e.currentTarget.setPointerCapture(e.pointerId);
                          cancel();
                          setHolding(true);
                          timer.current = setTimeout(approve, 750);
                        }}
                        onPointerUp={cancel}
                        onPointerLeave={cancel}
                        onPointerCancel={cancel}
                        onLostPointerCapture={cancel}
                        onBlur={cancel}
                        onClick={(e) => {
                          if (e.detail === 0) dialog.current?.showModal();
                        }}
                      >
                        <SnappLogo
                          variant="mark-small"
                          release="currentColor"
                        />
                        {approved ? (
                          <>
                            <LockKeyhole size={16} />
                            Approved · v3 · locked
                          </>
                        ) : (
                          "Hold to approve preview"
                        )}
                      </button>
                      <button
                        className="lib-text-button"
                        onClick={() => dialog.current?.showModal()}
                        disabled={approved}
                      >
                        Use confirmation dialog
                      </button>
                      <button
                        className="lib-text-button"
                        onClick={() => {
                          cancel();
                          setApproved(false);
                          setApprovalNote(
                            "New preview revision requires approval.",
                          );
                        }}
                      >
                        Reset specimen
                      </button>
                    </div>
                  </div>
                  <p role="status" className="lib-note">
                    {approvalNote ||
                      "Hold 750 ms. Release early to cancel. Approval does not mean funds arrived."}
                  </p>
                </Panel>
              </>,
              "cutoff hours approval statement client reconciliation",
            )}
            {section(
              "Loading",
              "A branded pending view, with explicit completion and recovery states.",
              <LoadingExamples reduced={reduced} />,
              "logo loader skeleton pending error retry",
            )}
            {section(
              "Reports",
              "Custom charts and tables for clear cutoff review.",
              <ReportExamples />,
              "dashboard chart table sorting pagination export reporting",
            )}
            {section(
              "Motion",
              "Prepare. Hold. Release. Settle. Every movement has a reason.",
              <>
                <div className="lib-motion-stage">
                  <div key={motion} className={motion ? "lib-sting" : ""}>
                    <SnappLogo variant="mark" release="var(--logo-release)" />
                    <div className="lib-motion-echo" aria-hidden="true" />
                    <div
                      className="lib-motion-echo lib-motion-echo-second"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3>The gap is the moment.</h3>
                    <p>250 ms prepare → 60 ms hold → 125 ms release → rest.</p>
                    <button
                      className="lib-button"
                      onClick={() =>
                        void sound.play(
                          "logo",
                          () => setMotion((m) => m + 1),
                          reduced,
                        )
                      }
                    >
                      <Play size={15} />
                      Replay once
                    </button>
                    <SnappSwitch
                      label="Sound on logo replay"
                      selected={sound.enabled}
                      onChange={sound.toggle}
                    />
                  </div>
                </div>
                <InteractionExamples reduced={reduced} />
                <div className="lib-duration-grid">
                  {durations.map(([n, v, u]) => (
                    <div key={n}>
                      <code>--dur-{n}</code>
                      <strong>
                        {v}
                        <small>ms</small>
                      </strong>
                      <span>{u}</span>
                      <i style={{ width: `${v / 7.5}%` }} />
                    </div>
                  ))}
                </div>
                <div className="lib-grid">
                  <Panel title="Easing tokens">
                    {easings.map(([n, v]) => (
                      <p key={n}>
                        <strong>{n}</strong>
                        <code className="lib-block-code">{v}</code>
                      </p>
                    ))}
                  </Panel>
                  <Panel
                    title="Spring specifications"
                    note="Documented brand presets; current specimens use CSS easing."
                  >
                    <dl className="lib-facts">
                      <dt>Crisp</dt>
                      <dd>700 stiffness / 40 damping / 0.6 mass</dd>
                      <dt>Snap</dt>
                      <dd>900 stiffness / 30 damping / 0.5 mass</dd>
                    </dl>
                    <p>
                      Exits are faster than entrances. Logo loops are reserved
                      for loading states. No amount tweening. Unknown outcomes
                      remain static.
                    </p>
                    <a className="lib-text-button" href="/dev/hold">
                      Open existing hold & sound tuning lab{" "}
                      <ArrowUpRight size={14} />
                    </a>
                  </Panel>
                </div>
              </>,
              "timing easing spring animation tick snap beat settle pulse hold",
            )}
            {section(
              "Sound",
              "Optional sound tokens, previews and logo release timing.",
              <SoundExamples
                sound={sound}
                motion={motion}
                replayLogo={() =>
                  void sound.play(
                    "logo",
                    () => setMotion((m) => m + 1),
                    reduced,
                  )
                }
              />,
              "audio sound effects snap suction cancellation volume gain pitch reverb",
            )}
            {section(
              "3D studies",
              "Depth explains the work. Motion makes the relationship visible.",
              <>
                <div className="lib-pattern-toolbar">
                  <SnappTabs
                    label="3D study"
                    options={studyTabs}
                    value={study}
                    onChange={(s) => {
                      setStudy(s);
                      setStage(0);
                    }}
                    panelId="spatial-panel"
                  />
                  <Badge>Proposed extension</Badge>
                </div>
                <div
                  id="spatial-panel"
                  role="tabpanel"
                  aria-labelledby={`spatial-panel-${studyTabs.indexOf(study)}`}
                  tabIndex={0}
                  className="lib-spatial-layout"
                >
                  <div
                    className="lib-spatial-stage"
                    style={
                      {
                        "--depth": `${reduced ? 0 : depth}px`,
                        "--tilt": `${reduced ? 0 : tilt}deg`,
                        "--spread": expanded ? 1 : 0,
                      } as CSSProperties
                    }
                  >
                    <div className="lib-spatial-caption">
                      {reduced
                        ? "FLAT / REDUCED MOTION"
                        : "CSS 3D / INTERACTIVE STUDY"}
                    </div>
                    {study === "Evidence depth" ? (
                      <div className="lib-3d-stack">
                        {[
                          "Source records",
                          "Reviewed hours",
                          "Exact calculation",
                        ].map((s, i) => (
                          <div
                            className="lib-3d-card"
                            key={s}
                            style={{ "--layer": i } as CSSProperties}
                          >
                            <span>0{i + 1} / EVIDENCE</span>
                            <Layers size={22} />
                            <strong>{s}</strong>
                            <small>Versioned. Attributable. Traceable.</small>
                          </div>
                        ))}
                      </div>
                    ) : study === "Prepare & release" ? (
                      <div className={`lib-release-study phase-${stage}`}>
                        <div>01 / PREPARE</div>
                        <div>02 / HOLD</div>
                        <div>03 / RELEASE</div>
                        <p>
                          {
                            [
                              "Gather the evidence",
                              "Pause for human review",
                              "Release the approved version",
                            ][stage]
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="lib-spatial-steps">
                        {["Prepare", "Review", "Snap", "Settle"].map((s, i) => (
                          <button
                            key={s}
                            className={stage === i ? "current" : ""}
                            onClick={() => setStage(i)}
                            style={{ "--layer": i } as CSSProperties}
                          >
                            <span>0{i + 1}/</span>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Panel title="Study controls">
                    <SnappSlider
                      label="Depth"
                      value={depth}
                      onChange={setDepth}
                      min={0}
                      max={64}
                      suffix=" px"
                      disabled={reduced}
                    />
                    <SnappSlider
                      label="Tilt"
                      value={tilt}
                      onChange={setTilt}
                      min={-24}
                      max={0}
                      suffix="?"
                      disabled={reduced}
                    />
                    {study === "Evidence depth" ? (
                      <button
                        className="lib-button"
                        onClick={() => setExpanded(!expanded)}
                      >
                        {expanded ? "Collapse layers" : "Separate layers"}
                      </button>
                    ) : (
                      <button
                        className="lib-button"
                        onClick={() =>
                          setStage(
                            (stage + 1) % (study === "Spatial stages" ? 4 : 3),
                          )
                        }
                      >
                        Next phase <ArrowUpRight size={14} />
                      </button>
                    )}
                    <p className="lib-note">
                      User-triggered only. No autoplay or payment actions.
                      Reduced motion flattens depth and removes transitions.
                    </p>
                  </Panel>
                </div>
                <Panel title="Spatial tokens · proposed, not approved brand values">
                  <div className="lib-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Token</th>
                          <th>Value</th>
                          <th>Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["perspective", "900 px", "Camera perspective"],
                          ["depth", "0–64 px", "Evidence separation"],
                          ["tilt", "−24° to 0°", "Bounded inspection"],
                          ["transition", "375 ms / ease-snap", "Depth changes"],
                          [
                            "material",
                            "Matte / solid surface",
                            "Readable HTML planes",
                          ],
                          [
                            "lighting",
                            "None",
                            "No glow or artificial logo shading",
                          ],
                          [
                            "fallback",
                            "Flat layout",
                            "Reduced motion / unsupported CSS 3D",
                          ],
                        ].map(([n, v, u]) => (
                          <tr key={n}>
                            <td>
                              <code>spatial.{n}</code>
                            </td>
                            <td>{v}</td>
                            <td>{u}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              </>,
              "3d animation depth perspective tilt spatial",
            )}
            {section(
              "Accessibility",
              "Fast should still feel calm. Exact should still be accessible.",
              <>
                <div className="lib-grid">
                  <Panel title="Interaction contract">
                    <ul className="lib-checklist">
                      {[
                        "Visible 2 px focus with 2 px offset",
                        "44 × 44 px minimum interactive targets",
                        "Status labels and icons alongside color",
                        "Native dialog with Escape and focus return",
                        "Keyboard confirmation instead of mandatory hold",
                        "System reduced-motion preference always respected",
                        "Money is readable text, never canvas-only",
                      ].map((s) => (
                        <li key={s}>
                          <Check size={16} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Panel>
                  <Panel title="Contrast specimens">
                    <Contrast
                      name="Primary text"
                      foreground={theme === "dark" ? "#F6F6F2" : "#0A0A0F"}
                      background={theme === "dark" ? "#0A0A0F" : "#F6F6F2"}
                    />
                    <Contrast
                      name="Human action"
                      foreground="#0A0A0F"
                      background="#D4FF3F"
                    />
                    <Contrast
                      name="Agent text"
                      foreground={theme === "dark" ? "#8F7BFF" : "#5A3FF0"}
                      background={theme === "dark" ? "#0A0A0F" : "#F6F6F2"}
                    />
                    <p className="lib-note">
                      Ratios calculated from sRGB. Test actual component
                      backgrounds too; palette approval alone does not guarantee
                      contrast.
                    </p>
                  </Panel>
                </div>
              </>,
              "contrast keyboard focus reduced motion",
            )}
            {query && (
              <p role="status" className="lib-note">
                {matchedCategories
                  ? `${matchedCategories} matching categories`
                  : "No categories or tokens found"}{" "}
                for “{query}”.{" "}
                <button
                  className="lib-text-button"
                  onClick={() => setQuery("")}
                >
                  Show all categories
                </button>
              </p>
            )}
            <footer className="lib-footer">
              <SnappLogo release="var(--logo-release)" />
              <p>Pay fast, in a snap.</p>
              <span>
                Draft system / November 2026
                <br />
                SNAPP_BRAND.md · Slip S v1
              </span>
            </footer>
          </main>
        </div>
        <dialog
          ref={dialog}
          aria-labelledby="approval-dialog-title"
          className="lib-dialog"
          onCancel={cancel}
        >
          <form method="dialog">
            <button
              className="lib-dialog-close"
              aria-label="Close approval dialog"
            >
              <X size={20} />
            </button>
          </form>
          <Badge>Preview only · No payment</Badge>
          <h2 id="approval-dialog-title">Approve this exact snapshot?</h2>
          <p>Version 3 · 2 sample recipients</p>
          <p>
            Alex: 1.0000000 XLM · Testnet
            <br />
            Sam: 1.0000000 XLM · Testnet
          </p>
          <strong className="lib-money">Total: 2.0000000 XLM · Testnet</strong>
          <p>
            Approval locks this specimen. Any material change requires a new
            approval.
          </p>
          <div className="lib-inline">
            <button
              className="lib-button"
              onClick={() => dialog.current?.close()}
            >
              Cancel
            </button>
            <button
              className="lib-button primary"
              onClick={approve}
              disabled={approved}
            >
              Confirm preview approval
            </button>
          </div>
        </dialog>
      </div>
    </SnappControlProvider>
  );
}
function Contrast({
  name,
  foreground,
  background,
}: {
  name: string;
  foreground: string;
  background: string;
}) {
  const lum = (hex: string) => {
    const c = hex
      .match(/[a-f\d]{2}/gi)!
      .map((x) => parseInt(x, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
  };
  const a = lum(foreground),
    b = lum(background),
    ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  return (
    <div className="lib-contrast" style={{ color: foreground, background }}>
      <span>{name}</span>
      <strong>
        {ratio.toFixed(2)}:1 · {ratio >= 4.5 ? "AA" : "Large text only"}
      </strong>
    </div>
  );
}
