import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import DesignLibrary from "./DesignLibrary";
import { themeVariables } from "../design/tokens";

afterEach(() => {
  vi.useRealTimers();
  window.history.replaceState({}, "", "/");
});
describe("library integration", () => {
  it("exposes all categories and an actionable no-results state", async () => {
    render(<DesignLibrary />);
    const user = userEvent.setup();
    for (const name of [
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
    ])
      expect(
        screen.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    await user.type(
      screen.getByRole("textbox", { name: "Search library and tokens" }),
      "zzzz-not-found",
    );
    expect(
      screen.getByText(/No categories or tokens found/),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Show all categories" }),
    );
    expect(
      screen.getByRole("heading", { name: "Components" }),
    ).toBeInTheDocument();
  });
  it("keeps replay focus and changes the ripple token for Paper", async () => {
    render(<DesignLibrary />);
    const user = userEvent.setup();
    const replay = screen.getByRole("button", { name: "Replay once" });
    await user.click(replay);
    expect(replay).toHaveFocus();
    expect(replay).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Switch to Paper theme" }),
    );
    // Theme aliases resolve from tokens.css by attribute, not inline styles.
    const root = document.querySelector(".snapp-library") as HTMLElement;
    expect(root).toHaveAttribute("data-snapp-theme", "light");
    expect(themeVariables("light")["--ripple"]).toBe("var(--color-ink-950)");
    await user.click(replay);
    expect(document.querySelectorAll(".lib-motion-echo")).toHaveLength(2);
  });
  it("cancels an interrupted hold and only locks after a complete hold", () => {
    vi.useFakeTimers();
    render(<DesignLibrary />);
    const button = screen.getByRole("button", {
      name: /Hold to approve preview/,
    });
    fireEvent.pointerDown(button, { button: 0, pointerId: 1, isPrimary: true });
    act(() => vi.advanceTimersByTime(500));
    fireEvent.pointerCancel(button);
    act(() => vi.advanceTimersByTime(1000));
    expect(button).not.toBeDisabled();
    fireEvent.pointerDown(button, { button: 0, pointerId: 1, isPrimary: true });
    fireEvent.blur(window);
    act(() => vi.advanceTimersByTime(1000));
    expect(button).not.toBeDisabled();
    fireEvent.pointerDown(button, { button: 0, pointerId: 1, isPrimary: true });
    act(() => vi.advanceTimersByTime(750));
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Approved");
    expect(
      screen.getByText(/Preview approved.*No payment sent/),
    ).toBeInTheDocument();
  });
});
