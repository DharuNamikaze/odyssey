import React, { useMemo } from "react";
import { pie, arc, PieArcDatum } from "d3";

// Define types
type Item = { name: string; value: number };

interface DonutChartProps {
  data?: Item[];
  radius?: number;
  colors?: string[];
  title?: string;
  showLabels?: boolean;
  loading?: boolean;
}

// Default data (fallback when no data provided)
const defaultData: Item[] = [
  { name: "Improvement", value: 12 },
  { name: "Focus", value: 121 },
  { name: "Exercise", value: 231 },
  { name: "Reading", value: 123 },
  { name: "Meditation", value: 123 },
  { name: "Sleep", value: 123 },
  { name: "Nutrition", value: 112 },
];

const defaultColors = [
  "#7e4cfe", "#895cfc", "#956bff", "#a37fff", 
  "#b291fd", "#b597ff", "#b591ff"
];

const DonutChartCenterText = React.memo<DonutChartProps>(({
  data = defaultData,
  radius = 500,
  colors = defaultColors,
  title = "Total",
  showLabels = true,
  loading = false
}) => {
  // Memoized calculations that depend on props
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return defaultData;
    return data;
  }, [data]);

  const totalValue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  // Memoized D3 calculations - these are expensive!
  const { arcs, arcGenerator, arcClip, arcLabel } = useMemo(() => {
    const gap = 0.01;
    const lightStrokeEffect = 10;
    
    const pieLayout = pie<Item>()
      .value((d) => d.value)
      .padAngle(gap);

    const innerRadius = radius / 1.625;
    const arcGen = arc<PieArcDatum<Item>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(lightStrokeEffect + 2);

    const arcClipGen = arc<PieArcDatum<Item>>()
      .innerRadius(innerRadius + lightStrokeEffect / 2)
      .outerRadius(radius)
      .cornerRadius(lightStrokeEffect + 2);

    const labelRadius = radius * 0.825;
    const arcLabelGen = arc<PieArcDatum<Item>>()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

    const calculatedArcs = pieLayout(chartData);

    return {
      arcs: calculatedArcs,
      arcGenerator: arcGen,
      arcClip: arcClipGen,
      arcLabel: arcLabelGen
    };
  }, [chartData, radius]);

  // Memoized helper function
  const computeAngle = useMemo(() => {
    return (d: PieArcDatum<Item>) => ((d.endAngle - d.startAngle) * 180) / Math.PI;
  }, []);

  const minAngle = 20;
  
  console.log("re rendered")

  // Loading state
  if (loading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7e4cfe] mx-auto mb-2"></div>
            <p className="text-sm text-zinc-500">Loading...</p>
          </div>
        </div>
        <div className="max-w-[16rem] mx-auto aspect-square bg-zinc-100 rounded-full opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Centered text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-zinc-500">{title}</p>
          <p className="text-4xl transition-colors duration-300 font-bold">
            {totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      <svg
        viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
        className="max-w-[16rem] mx-auto overflow-visible"
      >
        {/* Define clip paths and gradients */}
        <defs>
          {arcs.map((d, i) => (
            <React.Fragment key={`defs-${i}`}>
              <clipPath id={`donut-c1-clip-${i}`}>
                <path d={arcClip(d) || undefined} />
              </clipPath>
              <linearGradient id={`donut-c1-gradient-${i}`}>
                <stop offset="55%" stopColor={colors[i % colors.length]} stopOpacity={0.95} />
              </linearGradient>
            </React.Fragment>
          ))}
        </defs>

        {/* Render slices and labels */}
        {arcs.map((d, i) => {
          const angle = computeAngle(d);
          let centroid = arcLabel.centroid(d);
          
          if (d.endAngle > Math.PI) {
            centroid[0] += 10;
          } else {
            centroid[0] -= 20;
          }

          return (
            <g key={`slice-${i}`}>
              {/* Slice */}
              <g clipPath={`url(#donut-c1-clip-${i})`}>
                <path
                  fill={`url(#donut-c1-gradient-${i})`}
                  stroke="#ffffff33"
                  strokeWidth={10}
                  d={arcGenerator(d) || undefined}
                />
              </g>

              {/* Labels */}
              {showLabels && (
                <g opacity={angle > minAngle ? 1 : 0}>
                  <text 
                    transform={`translate(${centroid})`} 
                    textAnchor="middle" 
                    fontSize={38}
                  >
                    <tspan y="-0.4em" fontWeight="600" fill="#eee">
                      {d.data.name}
                    </tspan>
                    {angle > minAngle && (
                      <tspan x={0} y="0.7em" fillOpacity={0.7} fill="#eee">
                        {d.data.value.toLocaleString("en-US")}%
                      </tspan>
                    )}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
});

// Set display name for debugging
DonutChartCenterText.displayName = 'DonutChartCenterText';

export default DonutChartCenterText;

// Usage example in your Dashboard:
/*
const Dashboard = () => {
  const [habitsData, setHabitsData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="p-8 rounded-2xl bg-[var(--bggray)]">
      <DonutChartCenterText 
        data={habitsData}
        loading={loading}
        title="Habits"
        radius={400}
        showLabels={true}
      />
    </div>
  );
};
*/