import React from "react";
import * as d3 from "d3";
import { HierarchyNode } from "d3";

const data = [
  { name: "MacOS", sector: "Tech", value: 412 },
  { name: "Linux", sector: "Tech", value: 32 },
  { name: "Windows", sector: "Tech", value: 51 },
  { name: "Diesel", sector: "Energy", value: 12 },
  { name: "Petrol", sector: "Energy", value: 62 },
  { name: "Diesel", sector: "Utilities", value: 12 },
  { name: "Petrol", sector: "Utilities", value: 8 },
  { name: "Bonds", sector: "Cyclicals", value: 15 },
  { name: "Loans", sector: "Cyclicals", value: 12 },
  { name: "Loans", sector: "Cyclicals", value: 21 },
  { name: "Petrol", sector: "Energy", value: 18 },
  { name: "Bonds", sector: "Financials", value: 27 },
  { name: "Loans", sector: "Financials", value: 13 },
  { name: "Loans", sector: "Financials", value: 63 },
  { name: "Petrol", sector: "Energy", value: 85 },
  { name: "Bonds", sector: "Financials", value: 17 },
  { name: "Loans", sector: "Financials", value: 13 },
  { name: "Loans", sector: "Utilities", value: 2 },
];

const colors = [
  "text-pink-400",
  "text-violet-500",
  "text-lime-500",
  "text-sky-400",
  "text-orange-400",
];
export function BubbleChart() {
  // Define scales
  const color = d3.scaleOrdinal(colors);
  const strokeSize = 1;
  // Define pack layout
  const pack = d3.pack().size([1000, 1000]).padding(12);

  // Compute hierarchy and apply pack layout
  const root = pack(
    d3.hierarchy({ children: data }).sum((d: any) => d.value) as HierarchyNode<unknown>
  );

  // Create nodes
  const nodes = root.leaves().map((d) => {
    const x = d.x;
    const y = d.y;
    const r = d.r;
    const fill = color((d.data as any).sector);
    const name = (d.data as any).name;
    const value = (d.data as any).value;

    return {
      x,
      y,
      r,
      fill,
      name,
      value,
    };
  });

  return (
    <><div className="relative w-full aspect-square max-w-[18rem] mx-auto">
    {nodes.map((node, i) => (
      <div
        key={i}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center ${node.fill}`}
        style={{
          left: `${(node.x / 1000) * 100}%`,
          top: `${(node.y / 1000) * 100}%`,
          width: `${((node.r * 2) / 1000) * 100}%`,
          height: `${((node.r * 2) / 1000) * 100}%`,
          borderRadius: "50%",
          backgroundColor: "currentColor",
          border: `${strokeSize}px solid #ffffff33`,
        }}
        title={`${node.name}\n${d3.format(",d")(node.value)}`}
      >
        {node.value > 1000 && (
          <>
            <div
              className="text-white text-center whitespace-nowrap"
              style={{
                fontSize: `${node.r / 9}px`,
                lineHeight: `${node.r / 7}px`,
              }}
            >
              {node.name}
            </div>
            <div
              className="text-white text-center whitespace-nowrap opacity-70"
              style={{
                fontSize: `${node.r / 10}px`,
                lineHeight: `${node.r / 8}px`,
              }}
            >
              {d3.format(",d")(node.value)}
            </div>
          </>
        )}
      </div>
    ))}
  </div></>
    
  );
}
