"use client";
import React from "react";
import { SeeCourse } from "@/app/api/cursos/verCurso/verCurso";


//* STYLES *//
import "./courseDesc.css";

export default function CourseDescription({ course }: { course: SeeCourse }) {
  return (
    <div className="course-description-card">
      <div className="course-title">{course.title}</div>
      <div className="course-meta">
        <div className="meta-item">
          <div className="meta-label">Instructor:</div>
          <div className="meta-value">{course.instructor}</div>
        </div>
        <div className="meta-item">
          <div className="meta-label">Tiempo estimado de finalización:</div>
          <div className="meta-value">{course.duration}</div>
        </div>
      </div>
      <div className="course-paragraph">{course.description}</div>
      <div className="learning-section">
        <div className="learning-title">Puntos de Aprendizaje</div>
        <div className="learning-columns">
          {[0, 1].map((col) => (
            <div className="learning-column" key={col}>
              {course.learningPoints
                .filter((_, i) => i % 2 === col)
                .map((point, idx) => (
                  <div className="learning-point" key={idx}>
                    <div className="bullet-container">
                      <div className="large-circle" />
                      <div className="small-circle" />
                    </div>
                    <div className="learning-text">{point.text}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
