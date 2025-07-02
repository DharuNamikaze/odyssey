import React from 'react';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay } from 'date-fns';
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
// const random = Math.random()  

const colorForCount = (count: number) => {
  if (count === 0) return '#3f3f3f';
  if (count <= 1) return '#9be9a8';
  if (count <= 3) return '#40c463';
  if (count <= 5) return '#30a14e';
  return '#216e39';
};

const Heatmap: React.FC<{ year?: number }> = ({ year = new Date().getFullYear() }) => {
  const data = generateHeatmapData(year);
  const start = startOfYear(new Date(year, 0, 1));
  const offset = getDay(start);

  const paddedData: (HeatmapDayData | null)[] = Array(offset).fill(null).concat(data);

  const weeks: (HeatmapDayData | null)[][] = [];
  for (let i = 0; i < paddedData.length; i += 7) {
    weeks.push(paddedData.slice(i, i + 7));
  }

  // Month label logic
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  // Find the first week of each month
  const monthLabels: { name: string; colStart: number }[] = [];
  let lastMonth: number | null = null;
  weeks.forEach((week, wi) => {
    const firstDay = week.find(cell => cell != null);
    if (firstDay) {
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ name: months[month], colStart: wi });
        lastMonth = month;
      }
    }
  });

  return (
    <div className="flex flex-col items-center w-full">
      {/* Month labels */}
      <div className="flex flex-row w-full justify-between px-8 mb-2">
        {monthLabels.map((label, i) => (
          <span
            key={i}
            className="text-xs text-neutral-400 font-semibold"
            style={{ marginLeft: i === 0 ? `${label.colStart * 1.5}rem` : undefined }}
          >
            {label.name}
          </span>
        ))}
      </div>
      <div className="flex flex-row gap-1.5 mx-auto w-full">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1 w-full mx-auto">
            {week.map((day, di) =>
              day ? (
                <div
                  key={di}
                  className="w-4 h-4 rounded-full"
                  title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                  style={{ backgroundColor: colorForCount(day.count) }}
                />
              ) : (
                <div key={di} className="w-4 h-4 rounded-full bg-transparent" />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
