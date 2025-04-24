import { CSSProperties, useState, useMemo } from "react";
import { scaleTime, scaleLinear, max, line as d3_line, curveStep } from "d3";

const getMockData = (daysInMonth: number, hours: number[]) => {
  const data = [];
  for (let i = 1; i <= daysInMonth; i++) {
    data.push({
      date: new Date(2025, 3, i), // Assuming the current month is April (3 in zero-indexed)
      value: hours[i % hours.length], // Mock sleep hours data
    });
  }
  return data;
};

export function LineChartStep() {
  const [timePeriod, setTimePeriod] = useState<"current" | "last6" | "last12">("current");

  // Get the current month and days in the month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Mock data for sleep hours (e.g., random sleep hours for visualization)
  const sleepData = useMemo(() => {
    switch (timePeriod) {
      case "current":
        return getMockData(daysInMonth, [7, 8, 6, 7, 8, 7, 9, 8, 7, 6, 8, 7, 8, 7, 9, 7, 8, 6, 7, 8, 9, 7, 6, 8, 7, 9, 8, 7, 6, 8]);
      case "last6":
        // Example mock data for last 6 months
        return getMockData(30, [7, 6, 8, 7, 7, 8, 9, 6, 8, 7, 9, 8, 7, 7, 8, 7, 6, 9, 8, 6, 7, 8, 7, 9, 8, 6, 7, 7, 8, 6]);
      case "last12":
        // Example mock data for last 12 months
        return getMockData(30, [6, 7, 8, 7, 7, 8, 7, 9, 7, 8, 6, 7, 8, 7, 9, 8, 7, 6, 7, 8, 7, 9, 6, 7, 8, 9, 6, 7, 8, 7]);
      default:
        return [];
    }
  }, [timePeriod, daysInMonth]);

  const xScale = scaleTime()
    .domain([new Date(currentYear, currentMonth, 1), new Date(currentYear, currentMonth, daysInMonth)])
    .range([0, 100]);

  const yScale = scaleLinear()
    .domain([0, max(sleepData.map((d) => d.value)) ?? 0])
    .range([100, 0]);

  const line = d3_line<typeof sleepData[number]>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value))
    .curve(curveStep);

  const d = line(sleepData);

  if (!d) {
    return null;
  }
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setTimePeriod("current")}
          className="bg-blue-500 text-white px-4 py-2 rounded mx-2 cursor-pointer"
        >
          {monthNames[currentMonth]}
        </button>
        <button
          onClick={() => setTimePeriod("last6")}
          className="bg-blue-500 text-white px-4 py-2 rounded mx-2 cursor-pointer"
        >
          Last 6 Months
        </button>
        <button
          onClick={() => setTimePeriod("last12")}
          className="bg-blue-500 text-white px-4 py-2 rounded mx-2 cursor-pointer"
        >
          Last 12 Months
        </button>
      </div>
      <div
        className="relative h-72 w-full"
        style={
          {
            "--marginTop": "0px",
            "--marginRight": "8px",
            "--marginBottom": "25px",
            "--marginLeft": "25px",
          } as CSSProperties
        }
      >
        {/* Y axis */}
        <div
          className="absolute inset-0
            h-[calc(100%-var(--marginTop)-var(--marginBottom))]
            w-[var(--marginLeft)]
            translate-y-[var(--marginTop)]
            overflow-visible
          "
        >
          {yScale
            .ticks(8)
            .map(yScale.tickFormat(8, "d"))
            .map((value, i) => (
              <div
                key={i}
                style={{
                  top: `${yScale(+value)}%`,
                  left: "0%",
                }}
                className="absolute text-xs tabular-nums -translate-y-1/2 text-gray-500 w-full text-right pr-2"
              >
                {value}
              </div>
            ))}
        </div>

        {/* Chart area */}
        <div
          className="absolute inset-0
            h-[calc(100%-var(--marginTop)-var(--marginBottom))]
            w-[calc(100%-var(--marginLeft)-var(--marginRight))]
            translate-x-[var(--marginLeft)]
            translate-y-[var(--marginTop)]
            overflow-visible
          "
        >
          <svg
            viewBox="0 0 100 100"
            className="overflow-visible w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {yScale
              .ticks(8)
              .map(yScale.tickFormat(8, "d"))
              .map((active, i) => (
                <g
                  transform={`translate(0,${yScale(+active)})`}
                  className="text-zinc-300 dark:text-zinc-700"
                  key={i}
                >
                  <line
                    x1={0}
                    x2={100}
                    stroke="currentColor"
                    strokeDasharray="6,5"
                    strokeWidth={0.5}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}

            {/* Line */}
            <path
              d={d}
              fill="none"
              stroke="url(#lineStep-gradient)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <defs>
              <linearGradient id="lineStep-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="currentColor" className="text-emerald-500" />
                <stop offset="100%" stopColor="currentColor" className="text-lime-400" />
              </linearGradient>
            </defs>
          </svg>

          <div className="translate-y-2">
            {/* X Axis */}
            {sleepData.map((day, i) => {
              const isFirst = i === 0;
              const isLast = i === sleepData.length - 1;
              const isMax = day.value === Math.max(...sleepData.map((d) => d.value));
              if (!isFirst && !isLast && !isMax) return null;
              return (
                <div key={i} className="overflow-visible text-zinc-500">
                  <div
                    style={{
                      left: `${xScale(day.date)}%`,
                      top: "100%",
                      transform: `translateX(${i === 0 ? "0%" : i === sleepData.length - 1 ? "-100%" : "-50%"})`, // The first and last labels should be within the chart area
                    }}
                    className="text-xs absolute"
                  >
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
      </div>
    </div>
  );
}
