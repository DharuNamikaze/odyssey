import React from 'react';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay, addDays } from 'date-fns';
import '../../src/app/globals.css'; // Create this CSS file for styling

interface HeatmapDayData {
  date: string;
  count: number;
}

const generateHeatmapData = (year: number): HeatmapDayData[] => {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(start);
  const days = eachDayOfInterval({ start, end });

  const contributions: Record<string, number> = {};
  for (let i = 0; i < 200; i++) {
    const rand = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const key = format(rand, 'yyyy-MM-dd');
    contributions[key] = (contributions[key] || 0) + Math.floor(Math.random() * 5);
  }

  return days.map((day) => ({
    date: format(day, 'yyyy-MM-dd'),
    count: contributions[format(day, 'yyyy-MM-dd')] || 0,
  }));
};

const colorForCount = (count: number) => {
  if (count === 0) return '#2a2a1a';
  if (count <= 1) return '#9be9a8';
  if (count <= 3) return '#40c463';
  if (count <= 5) return '#30a14e';
  return '#216e39';
};

const Heatmap: React.FC<{ year?: number }> = ({ year = new Date().getFullYear() }) => {
  const data = generateHeatmapData(year);
  const start = startOfYear(new Date(year, 0, 1));
  const offset = getDay(start); // Get which day the year starts (Sunday = 0)

  // Pad beginning for proper alignment
  const paddedData: (HeatmapDayData | null)[] = Array(offset).fill(null).concat(data);

  const weeks: (HeatmapDayData | null)[][] = [];
  for (let i = 0; i < paddedData.length; i += 7) {
    weeks.push(paddedData.slice(i, i + 7));
  }

  return (
    <div className="heatmap-container ">
      {weeks.map((week, wi) => (
        <div key={wi} className="heatmap-week ">
          {week.map((day, di) =>
            day ? (
              <div
                key={di}
                className="heatmap-day p-2.5 rounded-full"
                title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                style={{ backgroundColor: colorForCount(day.count) }}
              />
            ) : (
              <div key={di} className="heatmap-day empty " />
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default Heatmap;
