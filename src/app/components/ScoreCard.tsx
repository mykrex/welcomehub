// ScoreCard.tsx
import React from "react";

type ScoreCardProps = {
  title: string;
  value: string | number; // Porcentaje, minutos, intentos, etc.
};

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#1E293B] rounded-lg shadow-md text-white">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};
    