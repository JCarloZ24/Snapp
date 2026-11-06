import { useId, useState } from "react";

type ReportRow = { date: string; hours: number; check: string };
const outcomes = [
  { label: "Passed", tone: "positive" },
  { label: "Needs correction", tone: "negative" },
  { label: "Pending", tone: "pending" },
];
function useChartTip() {
  const [tip, setTip] = useState<string | null>(null);
  const id = useId();
  return {
    tip,
    frame: {
      onMouseLeave: () => setTip(null),
      onBlur: (event: React.FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setTip(null);
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Escape") setTip(null);
      },
    },
    point: (text: string) => ({
      tabIndex: 0,
      "aria-label": text,
      "aria-describedby": tip === text ? id : undefined,
      onMouseEnter: () => setTip(text),
      onFocus: () => setTip(text),
      onClick: () => setTip(text),
    }),
    bubble: tip && (
      <span className="lib-large-chart-tooltip" role="tooltip" id={id}>
        {tip}
      </span>
    ),
  };
}
export function pieSlice(start: number, end: number) {
  const point = (angle: number) => [
    120 + 96 * Math.cos(angle),
    120 + 96 * Math.sin(angle),
  ];
  const [x1, y1] = point(start);
  const [x2, y2] = point(end);
  return `M120 120 L${x1} ${y1} A96 96 0 ${end - start > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`;
}
export function ReportChartGallery({
  rows,
  dates,
}: {
  rows: ReportRow[];
  dates: string[];
}) {
  const trend = useChartTip();
  const combo = useChartTip();
  const pie = useChartTip();
  const values = dates.map((date) => ({
    date,
    hours: rows
      .filter((row) => row.date === date)
      .reduce((sum, row) => sum + row.hours, 0),
    passed: rows
      .filter((row) => row.date === date && row.check === "Passed")
      .reduce((sum, row) => sum + row.hours, 0),
  }));
  const x = (date: string) => 64 + ((Number(date.slice(-2)) - 3) / 9) * 512;
  const y = (hours: number) => 210 - (hours / 160) * 160;
  const points = values
    .map((value) => `${x(value.date)},${y(value.hours)}`)
    .join(" ");
  const summary = values
    .map((value) => `${value.date}: ${value.hours} hours`)
    .join("; ");
  let angle = -Math.PI / 2;
  const slices = outcomes.map((outcome) => {
    const count = rows.filter((row) => row.check === outcome.label).length;
    const start = angle;
    angle += rows.length ? (count / rows.length) * Math.PI * 2 : 0;
    return {
      ...outcome,
      count,
      start,
      end: angle,
      percent: rows.length ? (count / rows.length) * 100 : 0,
    };
  });
  return (
    <div className="lib-chart-gallery">
      <figure className="lib-large-chart" {...trend.frame}>
        <figcaption>
          <h3>Large sparkline: submitted hours</h3>
          <p>
            A spacious trend view of the three fixture dates.{" "}
            {rows.length ? "" : "No matching records. "}Zero baseline; straight
            segments connect observed totals.
          </p>
        </figcaption>
        <div
          className="lib-large-chart-scroll"
          tabIndex={0}
          role="region"
          aria-label="Large sparkline, horizontally scrollable"
        >
          <svg
            viewBox="0 0 640 260"
            className="lib-expanded-chart"
            role="group"
            aria-label={`Large submitted-hours trend. ${summary}`}
          >
            <line
              className="lib-chart-baseline"
              x1="48"
              x2="592"
              y1="210"
              y2="210"
            />
            <text x="32" y="214">
              0
            </text>
            <polyline className="lib-chart-trend" points={points} />
            {values.map((value) => (
              <g
                key={value.date}
                role="img"
                {...trend.point(
                  `Trend ${value.date}: ${value.hours} submitted hours`,
                )}
              >
                <circle
                  className="lib-chart-hit"
                  cx={x(value.date)}
                  cy={y(value.hours)}
                  r="18"
                />
                <circle
                  className="lib-chart-dot"
                  cx={x(value.date)}
                  cy={y(value.hours)}
                  r="4"
                />
                <text
                  x={x(value.date)}
                  y={y(value.hours) - 16}
                  textAnchor="middle"
                >
                  {value.hours} h
                </text>
                <text x={x(value.date)} y="242" textAnchor="middle">
                  Nov {Number(value.date.slice(-2))}
                </text>
              </g>
            ))}
          </svg>
        </div>
        {trend.bubble}
      </figure>
      <figure className="lib-large-chart" {...combo.frame}>
        <figcaption>
          <h3>Combo: submitted and passed-check hours</h3>
          <p>
            Violet bars show submitted hours. The lime line shows hours on
            records whose completeness checks passed. Both use the same hour
            axis; checks do not approve pay.
          </p>
        </figcaption>
        <div
          className="lib-large-chart-scroll"
          tabIndex={0}
          role="region"
          aria-label="Combo chart, horizontally scrollable"
        >
          <svg
            viewBox="0 0 640 260"
            className="lib-expanded-chart"
            role="group"
            aria-label="Submitted hours as bars and passed-check hours as a line, shared zero to 160 hour scale"
          >
            {[0, 40, 80, 120, 160].map((value) => (
              <g key={value}>
                <line
                  className="lib-chart-baseline"
                  x1="48"
                  x2="592"
                  y1={y(value)}
                  y2={y(value)}
                />
                <text x="36" y={y(value) + 4} textAnchor="end">
                  {value}
                </text>
              </g>
            ))}
            {values.map((value) => (
              <rect
                key={value.date}
                className="lib-combo-bar"
                x={x(value.date) - 24}
                y="-160"
                width="48"
                height="160"
                rx="3"
                style={{
                  transform: `translateY(210px) scaleY(${value.hours / 160})`,
                }}
              />
            ))}
            <polyline
              className="lib-chart-passed"
              points={values
                .map((value) => `${x(value.date)},${y(value.passed)}`)
                .join(" ")}
            />
            {values.map((value) => (
              <g
                key={value.date}
                role="img"
                {...combo.point(
                  `Combo ${value.date}: ${value.hours} submitted hours; ${value.passed} passed-check hours`,
                )}
              >
                <rect
                  className="lib-chart-hit"
                  x={x(value.date) - 26}
                  y="32"
                  width="52"
                  height="180"
                />
                <circle
                  className="lib-chart-passed-dot"
                  cx={x(value.date)}
                  cy={y(value.passed)}
                  r="5"
                />
                <text x={x(value.date)} y="242" textAnchor="middle">
                  Nov {Number(value.date.slice(-2))}
                </text>
              </g>
            ))}
          </svg>
        </div>
        {combo.bubble}
        <div className="lib-combo-legend">
          <span>
            <i />
            Submitted hours
          </span>
          <span>
            <i />
            Passed-check hours
          </span>
        </div>
      </figure>
      <figure className="lib-large-chart lib-pie-figure" {...pie.frame}>
        <figcaption>
          <h3>Pie: data-check outcomes</h3>
          <p>
            Share of matching records, not money or hours. Counts and
            percentages are listed alongside each outcome.
          </p>
        </figcaption>
        <div className="lib-pie-layout">
          {rows.length ? (
            <svg
              viewBox="0 0 240 240"
              className="lib-report-pie"
              role="group"
              aria-label={`Data-check outcome distribution for ${rows.length} records`}
            >
              {slices
                .filter((slice) => slice.count > 0)
                .map((slice) => (
                  <g
                    key={slice.label}
                    className={`lib-pie-${slice.tone}`}
                    role="img"
                    {...pie.point(
                      `${slice.label}: ${slice.count} of ${rows.length} records (${slice.percent.toFixed(1)}%)`,
                    )}
                  >
                    {slice.count === rows.length ? (
                      <circle cx="120" cy="120" r="96" />
                    ) : (
                      <path d={pieSlice(slice.start, slice.end)} />
                    )}
                  </g>
                ))}
            </svg>
          ) : (
            <div className="lib-pie-empty">No records to distribute</div>
          )}
          <ul className="lib-pie-legend">
            {slices.map((slice) => (
              <li key={slice.label}>
                <button
                  className={`lib-pie-${slice.tone}`}
                  {...pie.point(
                    `${slice.label}: ${slice.count} of ${rows.length} records${rows.length ? ` (${slice.percent.toFixed(1)}%)` : "; no percentage available"}`,
                  )}
                >
                  <i aria-hidden="true" />
                  <span>{slice.label}</span>
                  <strong>
                    {slice.count}{" "}
                    <small>
                      {rows.length ? `${slice.percent.toFixed(1)}%` : "No data"}
                    </small>
                  </strong>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {pie.bubble}
      </figure>
    </div>
  );
}
