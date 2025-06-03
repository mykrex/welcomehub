import React from "react";

type RecentCourseProps = {
  title: string;
  description: string;
  status: "complete" | "in_progress" | "not_started";
};

export const RecentCourse: React.FC<RecentCourseProps> = ({ title, description, status }) => {
  const getStatusColor = (status: RecentCourseProps["status"]) => {
    switch (status) {
      case "complete":
        return "bg-green-500"; // Verde para completo
      case "in_progress":
        return "bg-yellow-500"; // Amarillo para en progreso
      case "not_started":
        return "bg-red-500"; // Rojo para no iniciado
      default:
        return "bg-gray-500"; // Color neutro
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[#1E293B] rounded-lg shadow-md text-white">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
      <div
        className={`w-4 h-4 rounded-full ${getStatusColor(status)}`}
        title={status === "complete" ? "Completado" : status === "in_progress" ? "En progreso" : "No iniciado"}
      ></div>
    </div>
  );
};
