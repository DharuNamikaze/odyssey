import React, { CSSProperties } from "react";
import { scaleBand, scaleLinear, max} from "d3";
import { AnimatedBar } from "../charts/AnimatedBar";

const data = [
  { key: "Technology", value: 38.1, color: "#F5A5DB" },
  { key: "Financials", value: 25.3, color: "#B89DFB" },
  { key: "Energy", value: 23.1, color: "#758bcf" },
  { key: "Cyclical", value: 19.5, color: "#33C2EA" },
  { key: "Defensive", value: 14.7, color: "#FFC182" },
  { key: "Utilities", value: 5.8, color: "#87db72" },
].toSorted((a, b) => b.value - a.value);

export function HorizontalBarChart() {
  // Scales
  const yScale = scaleBand()
    .domain(data.map((d) => d.key))
    .range([0, 100])
    .padding(0.175);

  const xScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([0, 100]);

  const longestWord = max(data.map((d) => d.key.length)) || 1;
  return (
    <div
      className="relative w-full h-72"
      style={
        {
          "--marginTop": "20px",
          "--marginRight": "8px",
          "--marginBottom": "25px",
          "--marginLeft": `${longestWord * 7}px`,
        } as CSSProperties
      }
    >
      {/* Chart Area */}
      <div
        className="absolute inset-0
          z-5
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-hidden
        "
      >
        {/* Bars with Rounded Right Corners */}
        {data.map((d, index) => {
          const barWidth = xScale(d.value);
          const barHeight = yScale.bandwidth();

          return (
            <AnimatedBar key={index} index={index}>
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  top: `${yScale(d.key)}%`,
                  width: `${barWidth}%`,
                  height: `${barHeight}%`,
                  backgroundColor: d.color,
                  borderRadius: "0 6px 6px 0", // Rounded right corners
                }}
              />
            </AnimatedBar>
          );
        })}
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {xScale
            .ticks(8)
            .map(xScale.tickFormat(8, "d"))
            .map((active, i) => (
              <g
                transform={`translate(${xScale(+active)},0)`}
                className="text-gray-300/80 dark:text-gray-800/80"
                key={i}
              >
                <line
                  y1={0}
                  y2={100}
                  stroke="currentColor"
                  strokeDasharray="6,5"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
        </svg>
      </div>
      {/* Y Axis (Letters) */}
      <svg
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          translate-y-[var(--marginTop)]
          overflow-visible"
      >
        <g className="translate-x-[calc(var(--marginLeft)-8px)]">
          {data.map((entry, i) => (
            <text
              key={i}
              x="0"
              y={`${yScale(entry.key)! + yScale.bandwidth() / 2}%`}
              dy=".35em"
              textAnchor="end"
              fill="currentColor"
              className="text-xs text-zinc-400"
            >
              {entry.key}
            </text>
          ))}
        </g>
      </svg>

      {/* X Axis (Values) */}
      <svg
        className="absolute inset-0
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          h-[calc(100%-var(--marginBottom))]
          translate-y-4
          overflow-visible
        "
      >
        <g className="overflow-visible">
          {xScale.ticks(4).map((value, i) => (
            <text
              key={i}
              x={`${xScale(value)}%`}
              y="100%"
              textAnchor="middle"
              fill="currentColor"
              className="text-xs tabular-nums text-gray-400"
            >
              {value}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
