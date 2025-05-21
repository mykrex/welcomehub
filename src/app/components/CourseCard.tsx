// CourseCard.tsx
import React from "react";

type CourseCardProps = {
  title: string;
  description: string;
  status: "completed" | "in-progress" | "not-started";
};

const statusColors = {
  completed: "bg-green-500",
  "in-progress": "bg-yellow-500",
  "not-started": "bg-red-500",
};

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  status,
}) => {
  return (
    <div className="flex flex-col p-4 bg-[#1E293B] rounded-lg shadow-md">
      {/* Título del curso */}
      <h3 className="text-lg font-semibold text-white">{title}</h3>

      {/* Descripción del curso */}
      <p className="text-sm text-gray-400 mt-2">{description}</p>

      {/* Estado del curso */}
      <div className="flex items-center mt-4">
        <div
          className={`w-4 h-4 rounded-full ${statusColors[status]} mr-2`}
        ></div>
        <span className="text-sm text-white capitalize">{status.replace("-", " ")}</span>
      </div>
    </div>
  );
};
