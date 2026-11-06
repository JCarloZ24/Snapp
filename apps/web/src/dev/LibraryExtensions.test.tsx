import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoadingExamples } from "./LibraryExtensions";
import { ReportExamples } from "./ReportExamples";

describe("loading preview", () => {
  it("resolves, fails, and retries without a fake completion timer", async () => {
    const user = userEvent.setup();
    render(<LoadingExamples reduced />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading reviewed records",
    );
    await user.click(screen.getByRole("button", { name: "Resolve preview" }));
    expect(screen.getByRole("status")).toHaveTextContent("Records ready");
    await user.click(screen.getByRole("button", { name: "Start loading" }));
    await user.click(screen.getByRole("button", { name: "Simulate failure" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Records could not load",
    );
    await user.click(screen.getByRole("button", { name: "Retry loading" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading reviewed records",
    );
  });
});
describe("report preview", () => {
  it("sorts the complete dataset before pagination and keeps amounts explicit", async () => {
    const user = userEvent.setup();
    render(<ReportExamples />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("PHP 19,200.00")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Hours" }));
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent(
      "Fran Garcia",
    );
    expect(screen.getByRole("columnheader", { name: "Hours" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent(
      "Bea Santos",
    );
    expect(screen.getByRole("status")).toHaveTextContent("4-6 of 6");
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });
  it("filters, reports an empty result, and recovers", async () => {
    const user = userEvent.setup();
    render(<ReportExamples />);
    await user.click(
      screen.getByRole("button", { name: /Report review state/ }),
    );
    await user.click(screen.getByRole("option", { name: "Needs review" }));
    expect(screen.getByRole("status")).toHaveTextContent("1-2 of 2");
    expect(
      within(screen.getByRole("table")).queryByText("Alex Rivera"),
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /Report review state/ }),
    );
    await user.click(
      screen.getByRole("option", { name: "Approved (empty example)" }),
    );
    expect(
      screen.getByText("No approved records in this preview"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Export filtered CSV" }),
    ).toBeDisabled();
    await user.click(
      screen.getByRole("button", { name: "Show all review states" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("1-3 of 6");
  });
});

describe("report data controls", () => {
  it("keeps scorecards, sparkline and table in sync across project and search filters", async () => {
    const user = userEvent.setup();
    render(<ReportExamples />);
    await user.click(screen.getByRole("button", { name: /Report project/ }));
    await user.click(screen.getByRole("option", { name: "Brand assets" }));
    expect(
      within(screen.getByLabelText("Filtered report scorecards")).getByRole(
        "button",
        { name: "108 h" },
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /Submitted hours, by record date/ }),
    ).toHaveAttribute("aria-label", expect.stringContaining("0, 108, 0"));
    await user.type(
      screen.getByRole("searchbox", { name: "Find employee" }),
      "Bea",
    );
    expect(
      within(screen.getByLabelText("Filtered report scorecards")).getByRole(
        "button",
        { name: "52 h" },
      ),
    ).toBeInTheDocument();
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(
      2,
    );
    await user.click(
      screen.getByRole("button", { name: "Reset report filters" }),
    );
    expect(
      within(screen.getByLabelText("Filtered report scorecards")).getByRole(
        "button",
        { name: "292 h" },
      ),
    ).toBeInTheDocument();
  });
  it("applies a calendar range only after Apply, includes both endpoints, and recovers from empty dates", async () => {
    const user = userEvent.setup();
    render(<ReportExamples />);
    await user.click(
      screen.getByRole("button", { name: /Open report date range calendar/ }),
    );
    await user.click(screen.getByRole("button", { name: /November 7, 2026/ }));
    await user.click(screen.getByRole("button", { name: /November 12, 2026/ }));
    expect(
      within(screen.getByLabelText("Filtered report scorecards")).getByRole(
        "button",
        { name: "292 h" },
      ),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Apply date range" }));
    expect(
      within(screen.getByLabelText("Filtered report scorecards")).getByRole(
        "button",
        { name: "188 h" },
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("of 4 employees");
    await user.click(screen.getByRole("button", { name: "Nov 16-30" }));
    expect(
      screen.getByText("No records match these filters"),
    ).toBeInTheDocument();
    expect(
      within(screen.getByLabelText("Filtered report scorecards")).getByRole(
        "button",
        { name: "0 h" },
      ),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Reset report filters" }),
    );
    expect(
      within(screen.getByLabelText("Filtered report scorecards")).getByRole(
        "button",
        { name: "292 h" },
      ),
    ).toBeInTheDocument();
  });
});

it("does not apply an incomplete report range", async () => {
  const user = userEvent.setup();
  render(<ReportExamples />);
  await user.click(screen.getByRole("spinbutton", { name: /day, Start Date/ }));
  await user.keyboard("{Backspace}");
  await user.click(screen.getByRole("button", { name: "Apply date range" }));
  expect(
    screen.getByText("Choose a complete, ordered range within November 2026."),
  ).toBeInTheDocument();
  expect(
    within(screen.getByLabelText("Filtered report scorecards")).getByRole(
      "button",
      { name: "292 h" },
    ),
  ).toBeInTheDocument();
});

it("shows custom point tooltips on hover and focus, and dismisses with Escape", async () => {
  const user = userEvent.setup();
  render(<ReportExamples />);
  const point = screen.getByRole("img", {
    name: "Submitted hours, 2026-11-07: 108",
  });
  await user.hover(point);
  expect(screen.getByRole("tooltip")).toHaveTextContent("2026-11-07");
  await user.unhover(point);
  point.focus();
  expect(await screen.findByRole("tooltip")).toHaveTextContent("108");
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  await user.hover(
    screen.getByRole("img", { name: "Nov 3: 104 submitted hours" }),
  );
  expect(screen.getByRole("tooltip")).toHaveTextContent("104 submitted hours");
});
it("animates data updates and respects the library reduced-motion setting", async () => {
  const original = Element.prototype.animate;
  const animate = vi.fn(() => ({ cancel: vi.fn() }) as unknown as Animation);
  Element.prototype.animate = animate;
  try {
    const user = userEvent.setup();
    const { rerender } = render(
      <div data-reduced="false">
        <ReportExamples />
      </div>,
    );
    await user.type(
      screen.getByRole("searchbox", { name: "Find employee" }),
      "Alex",
    );
    expect(animate).toHaveBeenCalled();
    animate.mockClear();
    rerender(
      <div data-reduced="true">
        <ReportExamples />
      </div>,
    );
    await user.clear(screen.getByRole("searchbox", { name: "Find employee" }));
    expect(animate).not.toHaveBeenCalled();
  } finally {
    Element.prototype.animate = original;
  }
});

it("uses labeled positive, negative and pending outcomes derived from filtered records", async () => {
  const user = userEvent.setup();
  render(<ReportExamples />);
  const outcomes = screen.getByRole("region", {
    name: "Filtered data-check outcomes",
  });
  expect(
    within(outcomes).getByRole("button", { name: "4 passed" }),
  ).toBeInTheDocument();
  expect(
    within(outcomes).getByRole("button", { name: "1 needs correction" }),
  ).toBeInTheDocument();
  expect(
    within(outcomes).getByRole("button", { name: "1 pending" }),
  ).toBeInTheDocument();
  await user.hover(within(outcomes).getByRole("button", { name: "4 passed" }));
  expect(screen.getByRole("tooltip")).toHaveTextContent(
    "does not approve hours or payment",
  );
  await user.click(screen.getByRole("button", { name: /Report review state/ }));
  await user.click(screen.getByRole("option", { name: "Needs review" }));
  expect(
    within(outcomes).getByRole("button", { name: "0 passed" }),
  ).toBeInTheDocument();
  expect(
    within(outcomes).getByRole("button", { name: "1 needs correction" }),
  ).toBeInTheDocument();
});

it("keeps the large trend, combo and pie charts aligned with report filters", async () => {
  const user = userEvent.setup();
  render(<ReportExamples />);
  expect(
    screen.getByRole("heading", { name: "Large sparkline: submitted hours" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "Trend 2026-11-07: 108 submitted hours" }),
  ).toBeInTheDocument();
  const comboPoint = screen.getByRole("img", {
    name: "Combo 2026-11-07: 108 submitted hours; 56 passed-check hours",
  });
  await user.hover(comboPoint);
  expect(screen.getByRole("tooltip")).toHaveTextContent(
    "56 passed-check hours",
  );
  await user.unhover(comboPoint);
  expect(
    screen.getByRole("img", { name: "Passed: 4 of 6 records (66.7%)" }),
  ).toBeInTheDocument();
  await user.type(
    screen.getByRole("searchbox", { name: "Find employee" }),
    "Alex",
  );
  const fullPie = screen.getByRole("img", {
    name: "Passed: 1 of 1 records (100.0%)",
  });
  expect(fullPie.querySelector("circle")).toBeInTheDocument();
  expect(fullPie.querySelector("path")).not.toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "Trend 2026-11-03: 64 submitted hours" }),
  ).toBeInTheDocument();
  await user.type(
    screen.getByRole("searchbox", { name: "Find employee" }),
    "zzzz",
  );
  expect(screen.getByText("No records to distribute")).toBeInTheDocument();
  expect(
    screen.queryByRole("group", { name: /Data-check outcome distribution/ }),
  ).not.toBeInTheDocument();
});
