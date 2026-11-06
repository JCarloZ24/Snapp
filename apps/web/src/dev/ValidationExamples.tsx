import { useRef, useState, type FormEvent } from "react";
import { type DateValue } from "@internationalized/date";
import { Check, TriangleAlert } from "lucide-react";
import {
  SnappDatePicker,
  SnappSelect,
  SnappTextField,
  type ToastTone,
} from "../components/ui/SnappControls";
import {
  cutoffOptions,
  ideaRules,
  reasonRules,
  reviewDateBounds,
  validateReview,
  validateText,
} from "../components/ui/validation";

type Notify = (message: string, tone?: ToastTone) => void;
export function ValidationExamples({ notify }: { notify: Notify }) {
  const [cutoff, setCutoff] = useState("");
  const [date, setDate] = useState<DateValue | null>(null);
  const [reason, setReason] = useState("");
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [validated, setValidated] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const form = useRef<HTMLFormElement>(null);
  const errors = validateReview({
    cutoff,
    date: date?.toString() ?? null,
    reason,
  });
  const hasErrors = Object.values(errors).some(Boolean);
  const change = (action: () => void) => {
    action();
    setValidated(false);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setValidated(false);
    if (hasErrors) {
      notify(
        "Review not validated. Correct the marked fields; your entries are preserved.",
        "error",
      );
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLElement>(
            '[data-invalid] .snapp-select-trigger, [role="spinbutton"][aria-invalid="true"], input[aria-invalid="true"], textarea[aria-invalid="true"]',
          )
          ?.focus(),
      );
      return;
    }
    setValidated(true);
    notify(
      "Review example validated locally. No payroll records were changed.",
    );
  };
  return (
    <div className="lib-validation-layout">
      <article className="lib-panel">
        <h3>Review details</h3>
        <p className="lib-note">
          Try submitting an empty form, choosing a date, or pasting a long
          reason.
        </p>
        <form
          key={resetVersion}
          ref={form}
          onSubmit={submit}
          noValidate
          className="snapp-form"
          aria-label="Review details example"
        >
          <SnappSelect
            label="Cutoff"
            options={cutoffOptions}
            value={cutoff}
            onChange={(value) => change(() => setCutoff(value))}
            required
            error={submitted ? errors.cutoff : undefined}
          />
          <SnappDatePicker
            label="Review date"
            value={date}
            onChange={(value) => change(() => setDate(value))}
            {...reviewDateBounds}
            error={submitted ? errors.date : undefined}
          />
          <SnappTextField
            label="Adjustment reason"
            value={reason}
            onChange={(value) => change(() => setReason(value))}
            rules={reasonRules}
            multiline
            submitted={submitted}
            placeholder="Explain why the reviewed hours changed…"
          />
          {submitted && hasErrors && (
            <p className="snapp-error-summary" role="alert">
              <TriangleAlert size={16} aria-hidden="true" />
              {Object.values(errors).filter(Boolean).length} fields need
              attention. Review the messages above.
            </p>
          )}
          {validated && (
            <p className="snapp-form-confirmation" role="status">
              <Check size={16} aria-hidden="true" />
              Valid example. Ready for an authenticated server check.
            </p>
          )}
          <div className="lib-inline">
            <button className="lib-button" type="submit">
              Validate review
            </button>
            <button
              className="lib-text-button"
              type="button"
              onClick={() => {
                setCutoff("");
                setDate(null);
                setReason("");
                setSubmitted(false);
                setValidated(false);
                setResetVersion((version) => version + 1);
                requestAnimationFrame(() =>
                  form.current
                    ?.querySelector<HTMLButtonElement>("button")
                    ?.focus(),
                );
              }}
            >
              Reset form
            </button>
          </div>
        </form>
      </article>
      <article className="lib-panel">
        <h3>Text length without visual noise</h3>
        <p className="lib-note">
          One border marks focus or an error. A small meter beside the count
          tracks length and turns amber near the limit. Over-limit text stays
          editable, with a clear correction message.
        </p>
        <div className="snapp-form">
          <SnappTextField
            label="Idea"
            value={idea}
            onChange={setIdea}
            rules={ideaRules}
            multiline
            placeholder="Describe an improvement to the cutoff review…"
          />
          <div className="lib-inline">
            <button
              className="lib-button"
              onClick={() =>
                setIdea(
                  "Make the link between reviewed hours and deliverable evidence easier to inspect.",
                )
              }
            >
              Load valid example
            </button>
            <button
              className="lib-button"
              onClick={() => setIdea("a".repeat(260))}
            >
              Near limit
            </button>
            <button
              className="lib-button"
              onClick={() => setIdea("a".repeat(285))}
            >
              Over limit
            </button>
            <button className="lib-text-button" onClick={() => setIdea("")}>
              Clear
            </button>
          </div>
          <dl className="lib-facts">
            <dt>Counting</dt>
            <dd>Visible characters (graphemes)</dd>
            <dt>Whitespace</dt>
            <dd>Trimmed at the edges</dd>
            <dt>Valid state</dt>
            <dd>Neutral + check; never settlement teal</dd>
            <dt>Input preservation</dt>
            <dd>Paste and composition remain intact</dd>
          </dl>
          <SnappSelect
            label="Recipient source"
            value="pending"
            options={[{ id: "pending", label: "Proyekto connection pending" }]}
            onChange={() => {}}
            disabled
            description="Disabled specimen. No connector is implemented."
          />
        </div>
      </article>
    </div>
  );
}

const feedbackRules = { label: "version feedback", min: 10, max: 500 };
export function ClientFeedbackExample({ notify }: { notify: Notify }) {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const form = useRef<HTMLDivElement>(null);
  const submit = (action: "revision" | "acceptance") => {
    setSubmitted(true);
    if (validateText(feedback, feedbackRules)) {
      notify(
        "Add 10–500 characters of feedback before recording this example.",
        "error",
      );
      form.current?.querySelector("textarea")?.focus();
      return;
    }
    notify(
      `${action === "revision" ? "Revision request" : "Acceptance"} preview recorded for v2 only. Hours approval remains separate.`,
    );
  };
  return (
    <div ref={form} className="snapp-form">
      <SnappTextField
        label="Version feedback"
        value={feedback}
        onChange={setFeedback}
        rules={feedbackRules}
        submitted={submitted}
        multiline
        placeholder="Comment on the submitted version…"
      />
      <div className="lib-inline">
        <button className="lib-button" onClick={() => submit("revision")}>
          Request revisions
        </button>
        <button className="lib-button" onClick={() => submit("acceptance")}>
          Accept this version
        </button>
      </div>
    </div>
  );
}
