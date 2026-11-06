import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseDate } from "@internationalized/date";
import {
  SnappControlProvider,
  SnappDatePicker,
  SnappSelect,
  SnappTabs,
  SnappTextField,
  SnappToastRegion,
  useSnappToasts,
} from "./SnappControls";
import { ideaRules } from "./validation";
import { ValidationExamples } from "../../dev/ValidationExamples";
import { themeVariables } from "../../dev/libraryTokens";

afterEach(() => vi.useRealTimers());
describe("custom field states", () => {
  it("exposes near-limit and overflow states without truncating pasted text", () => {
    const { rerender, container } = render(
      <SnappTextField
        label="Idea"
        value={"a".repeat(260)}
        onChange={() => {}}
        rules={ideaRules}
        multiline
      />,
    );
    expect(screen.getByText("Near limit")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
    rerender(
      <SnappTextField
        label="Idea"
        value={"a".repeat(285)}
        onChange={() => {}}
        rules={ideaRules}
        multiline
      />,
    );
    expect(screen.getByRole("textbox")).toHaveValue("a".repeat(285));
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(
      screen.getByText("Remove 5 characters (maximum 280)."),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".snapp-length-border"),
    ).not.toBeInTheDocument();
    rerender(
      <SnappTextField
        label="Idea"
        value={"a".repeat(280)}
        onChange={() => {}}
        rules={ideaRules}
      />,
    );
    expect(screen.getByText("Limit reached")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
  it("does not show premature errors; validates on blur and clears on correction", async () => {
    function Field() {
      const [value, setValue] = useState("");
      return (
        <SnappTextField
          label="Idea"
          value={value}
          onChange={setValue}
          rules={ideaRules}
        />
      );
    }
    render(<Field />);
    const user = userEvent.setup();
    const input = screen.getByRole("textbox");
    expect(input).not.toHaveAttribute("aria-invalid", "true");
    await user.click(input);
    await user.type(input, "short");
    await user.tab();
    expect(input).toHaveAttribute("aria-invalid", "true");
    await user.click(input);
    await user.type(input, " with enough detail now");
    expect(input).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Minimum met")).toBeInTheDocument();
  });
});
describe("custom select and date picker", () => {
  it("selects with keyboard, closes with Escape and returns focus", async () => {
    function Example() {
      const [value, setValue] = useState("one");
      return (
        <SnappSelect
          label="Cutoff"
          value={value}
          onChange={setValue}
          options={[
            { id: "one", label: "First cutoff" },
            { id: "two", label: "Second cutoff" },
          ]}
        />
      );
    }
    render(<Example />);
    const user = userEvent.setup();
    const trigger = screen.getByRole("button", { name: /Cutoff/ });
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(trigger).toHaveTextContent("Second cutoff");
    await waitFor(() => expect(trigger).toHaveFocus());
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
  it("renders a custom calendar with disabled dates and inherits Paper tokens", async () => {
    const changed = vi.fn();
    const user = userEvent.setup();
    render(
      <SnappControlProvider
        theme="light"
        reduced={false}
        variables={themeVariables("light")}
      >
        <SnappDatePicker
          label="Review date"
          value={parseDate("2026-11-06")}
          onChange={changed}
          min="2026-11-01"
          max="2026-12-15"
        />
      </SnappControlProvider>,
    );
    const trigger = screen.getByRole("button", {
      name: /Open review date calendar/,
    });
    await user.click(trigger);
    expect(
      screen.getByRole("dialog", { name: /Review date calendar/ }),
    ).toBeInTheDocument();
    expect(document.querySelector(".snapp-popover")).toHaveAttribute(
      "data-snapp-theme",
      "light",
    );
    await user.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
    const cells = screen
      .getAllByRole("button")
      .filter((el) => el.getAttribute("aria-label")?.includes("December 16"));
    expect(cells.length).toBeGreaterThan(0);
    expect(cells[0]).toHaveAttribute("aria-disabled", "true");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
describe("review specimen", () => {
  it("accepts a complete review and resets field validation state", async () => {
    const notify = vi.fn();
    render(<ValidationExamples notify={notify} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Cutoff/ }));
    await user.click(screen.getByRole("option", { name: /Nov 1–15/ }));
    await user.click(
      screen.getByRole("button", { name: /Open review date calendar/ }),
    );
    await user.click(screen.getByRole("button", { name: /November 6, 2026/ }));
    await user.type(
      screen.getByRole("textbox", { name: /Adjustment reason/ }),
      "Removed a duplicate two-hour entry.",
    );
    await user.click(screen.getByRole("button", { name: "Validate review" }));
    expect(notify).toHaveBeenLastCalledWith(
      "Review example validated locally. No payroll records were changed.",
    );
    expect(screen.getByText(/Valid example/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reset form" }));
    expect(
      screen.getByRole("textbox", { name: /Adjustment reason/ }),
    ).toHaveValue("");
    expect(
      screen.queryByText("Enter an adjustment reason."),
    ).not.toBeInTheDocument();
  });
  it("blocks invalid submission, retains input, and focuses the first invalid control", async () => {
    const notify = vi.fn();
    render(<ValidationExamples notify={notify} />);
    const user = userEvent.setup();
    await user.type(
      screen.getByRole("textbox", { name: /Adjustment reason/ }),
      "Keep this draft",
    );
    await user.click(screen.getByRole("button", { name: "Validate review" }));
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining("not validated"),
      "error",
    );
    expect(
      screen.getByRole("textbox", { name: /Adjustment reason/ }),
    ).toHaveValue("Keep this draft");
    expect(
      screen.getByText("Choose one of the available cutoffs."),
    ).toBeInTheDocument();
    expect(screen.getByText("Choose a review date.")).toBeInTheDocument();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 30));
    });
    expect(screen.getByRole("button", { name: /Cutoff/ })).toHaveFocus();
  });
});
describe("tabs", () => {
  it("uses roving focus with arrows, Home and End", async () => {
    function Example() {
      const [value, setValue] = useState("A");
      return (
        <SnappTabs
          label="Preview"
          options={["A", "B", "C"]}
          value={value}
          onChange={setValue}
          panelId="panel"
        />
      );
    }
    render(<Example />);
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "C" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "C" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "A" })).toHaveFocus();
    await user.keyboard("{ArrowRight}{Home}");
    expect(screen.getByRole("tab", { name: "A" })).toHaveFocus();
  });
});
describe("notifications", () => {
  function Example() {
    const { toasts, notify, dismiss } = useSnappToasts();
    return (
      <>
        <button onClick={() => notify("Informational example")}>Info</button>
        <button onClick={() => notify("Error example", "error")}>Error</button>
        <SnappToastRegion toasts={toasts} dismiss={dismiss} />
      </>
    );
  }
  it("pauses the remaining timer while hovered and dismisses after resuming", () => {
    vi.useFakeTimers();
    render(<Example />);
    fireEvent.click(screen.getByText("Info"));
    act(() => vi.advanceTimersByTime(2000));
    const toast = screen
      .getByText("Informational example")
      .closest(".snapp-toast")!;
    fireEvent.mouseEnter(toast);
    act(() => vi.advanceTimersByTime(10000));
    expect(toast).toBeInTheDocument();
    fireEvent.mouseLeave(toast);
    act(() => vi.advanceTimersByTime(3999));
    expect(toast).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText("Informational example")).not.toBeInTheDocument();
  });
  it("keeps errors until explicitly dismissed", () => {
    vi.useFakeTimers();
    render(<Example />);
    fireEvent.click(screen.getByText("Error"));
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole("alert")).toHaveTextContent("Error example");
    fireEvent.click(
      within(screen.getByRole("region", { name: "Notifications" })).getByRole(
        "button",
        { name: "Dismiss notification" },
      ),
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
