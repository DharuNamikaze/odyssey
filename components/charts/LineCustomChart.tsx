import React, { CSSProperties } from "react"; // Added React import for clarity, though may not be strictly needed with new JSX transform
import {
  scaleTime,
  scaleLinear,
  max,
  line as d3_line,
  curveMonotoneX,
} from "d3";

// --- Data Definition ---
const sales = [
  { date: "2023-04-30", value: 3, emotion: "😀" },
  { date: "2023-05-01", value: 6, emotion: "🤮" },
  { date: "2023-05-02", value: 8, emotion: "🤧" },
  { date: "2023-05-03", value: 6, emotion: "😡" },
  { date: "2023-05-04", value: 10, emotion: "😭" },
  { date: "2023-05-05", value: 12, emotion: "😖" },
  { date: "2023-05-06", value: 11, emotion: "🫠" },
  { date: "2023-05-07", value: 8, emotion: "😫" },
  { date: "2023-05-08", value: 4, emotion: "😴" },
  { date: "2023-05-09", value: 9, emotion: "😍" },
  { date: "2023-05-10", value: 9, emotion: "😂" },
];
// Process data: Convert date strings to Date objects
const data = sales.map((d) => ({ ...d, date: new Date(d.date) }));

// --- Company Logos (JSX elements) ---

// --- React Component Definition ---
export function LineCustomChart() {
  // --- D3 Scales ---
  const xScale = scaleTime()
    .domain([data[0].date, data[data.length - 1].date]) // Assumes data is sorted
    .range([0, 100]); // Range in percentage for SVG viewBox
  const yScale = scaleLinear()
    // Calculate max value, provide fallback 0
    .domain([0, max(data, (d) => d.value) ?? 0])
    .range([100, 0]); // Inverted range for SVG coordinates (0,0 is top-left)

  // --- D3 Line Generator ---
  const line = d3_line<(typeof data)[number]>() // Type assertion for data points
    .x((d) => xScale(d.date)) // Get X from scale
    .y((d) => yScale(d.value)) // Get Y from scale
    .curve(curveMonotoneX); // Apply curve

  // Generate the SVG path 'd' attribute string
  const d = line(data);

  // Handle case where line generation might fail (e.g., insufficient data)
  if (!d) {
    return null; // Or return a placeholder/error message
  }

  // --- Render Component ---
  return (
    <div
      className="relative h-72 w-full"
      style={
        {
          // CSS Custom Properties for margins
          "--marginTop": "0px",
          "--marginRight": "8px",
          "--marginBottom": "25px",
          "--marginLeft": "25px",
        } as CSSProperties // Type assertion for style object
      }
    >
      {/* Y axis Labels */}
      <div
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible" // Allows labels to go outside bounds
      >
        {yScale
          .ticks(8) // Generate ~8 tick values
          // .map(yScale.tickFormat(8, "d")) // Format ticks as integers (optional, scaleLinear often does this well)
          .map((value, i) => (
            <div
              key={`y-tick-${i}`}
              style={{
                // Position ticks based on scale
                top: `${yScale(value)}%`,
                left: "0%",
              }}
              className="absolute text-xs tabular-nums -translate-y-1/2 text-gray-500 w-full text-right pr-2"
            >
              {yScale.tickFormat(8, "d")(value)} {/* Format tick value here */}
            </div>
          ))}
      </div>

      {/* Chart area (SVG + X Axis) */}
      <div
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible"
      >
        <svg
          viewBox="0 0 100 100" // Use a viewBox for responsive scaling
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none" // Stretch SVG to fill container
        >
          {/* Grid lines */}
          {yScale.ticks(8).map((value, i) => (
            <g
              key={`y-grid-${i}`}
              transform={`translate(0,${yScale(value)})`} // Position grid line group
              className="text-zinc-300 dark:text-zinc-700"
            >
              <line
                x1={0}
                x2={100} // Line spans the viewBox width
                stroke="currentColor"
                strokeDasharray="6,5" // Dashed line style
                strokeWidth={0.5} // Thin line
                vectorEffect="non-scaling-stroke" // Prevents stroke distortion on resize
              />
            </g>
          ))}

          {/* Data Line */}
          <path
            d={d} // The generated path data
            fill="none"
            className="stroke-gray-400"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* X Axis Labels - Rendered below SVG */}
        <div className="translate-y-2"> {/* Add small space above X labels */}
          {data.map((day, i) => {
            const isFirst = i === 0;
            const isLast = i === data.length - 1;
            // Check if it's the maximum value point
            const isMax = day.value === max(data, d => d.value);
            // Only render labels for first, last, and max value points
            if (!isFirst && !isLast && !isMax) return null;

            return (
              <div key={`x-label-${i}`} className="overflow-visible text-zinc-500">
                <div
                  style={{
                    position: "absolute", // Use absolute positioning relative to parent div
                    left: `${xScale(day.date)}%`, // Position based on X scale
                    top: "0%", // Position at the top of the X axis container
                    // Adjust horizontal alignment based on position
                    transform: `translateX(${isFirst ? "0%" : isLast ? "-100%" : "-50%"})`,
                  }}
                  className="text-xs"
                >
                  {/* Format date as M/D */}
                  {day.date.toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Point Labels (Logos) - Overlay */}
      <div
        className="absolute inset-0 pointer-events-none /* Allow clicks to pass through */
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]"
      >
        {data.map((entry, i) => (
          <div
            key={`logo-${i}`}
            style={{
              position: "absolute",
              // Position logo center at the data point
              top: `${yScale(entry.value)}%`,
              left: `${xScale(entry.date)}%`,
              transform: "translate(-50%, -50%)", // Center the div on the point
            }}
            className="rounded-full overflow-hidden text-sm text-gray-700"
          >
            {/* Render the logo SVG */}
            <span className="text-2xl">{entry.emotion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

