"use client";

import React from "react";
import { useFetch } from "@/app/hooks/useFetch";


type CourseCardProps = {
  courseId: string;
  userId: string;
};

type CourseData = {
  title: string;
  description: string;
  status: "complete" | "in_progress" | "not_started";
};


export const CourseCard: React.FC<CourseCardProps> = ({ courseId, userId }) => {
  const { data: courseData, loading, error } = useFetch<CourseData>(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/courses/${courseId}/user/${userId}`
  );


  if (loading) {
    return <p className="text-gray-300">Cargando curso...</p>;
  }

  if (error || !courseData) {
    return (
      <p className="text-gray-300">
        {error ? `Error: ${error}` : "No se encontró información del curso."}
      </p>
    );
  }

  const { title, description, status } = courseData;
  const getStatusColor = () => {
    switch (status) {
      case "complete":
        return "bg-green-500";
      case "in_progress":
        return "bg-yellow-500";
      case "not_started":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-4 bg-[#1E293B] rounded-lg shadow-md text-white">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-300 mb-2">{description}</p>
      <div
        className={`w-4 h-4 rounded-full ${getStatusColor()}`}
        title={status}
      ></div>
    </div>
  );
};