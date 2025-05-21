// Legend.tsx
import React from "react";

type LegendItem = {
  color: string;
  label: string;
};

type LegendProps = {
  items: LegendItem[];
};

export const Legend: React.FC<LegendProps> = ({ items }) => {
  return (
    <div className="flex justify-center space-x-4 mt-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <div
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: item.color }}
          ></div>
          <div className="legend-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};
