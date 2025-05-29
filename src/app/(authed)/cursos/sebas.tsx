{/**"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCursos, Courses } from "@/app/api/cursos/cursos";

// Hook especializado para los cursos obligatorios
import { useObligatoryCourses } from "@/app/hooks/useObligatoryCourses";
// Carrusel reutilizable
import { CoursesCarousel } from "@/app/components/coursesCarousel";

import "./verCursos.css";
import "@/app/(authed)/cursos/cursos.css";

export default function CoursesDashboard() {
  const router = useRouter();

  // 1) Carga real de cursos obligatorios
  const { cursos: obligCursos, loading, error } = useObligatoryCourses();

  // 2) Fake API para las otras secciones
  const [asignedCourses, setAsignedCourses] = useState<Courses[]>([]);
  const [optionalCourses, setOptionalCourses] = useState<Courses[]>([]);
  const [recomendedCourses, setRecomendedCourses] = useState<Courses[]>([]);

  useEffect(() => {
    getCursos().then((data) => {
      setAsignedCourses(data.asignedCourses);
      setOptionalCourses(data.optionalCourses);
      setRecomendedCourses(data.recomendedCourses);
    });
  }, []);

  // Navegación al hacer click en cualquier card
  const handleViewCourse = (id: number | string) => {
    const base = typeof id === "number" ? "verCurso" : "contenidocursoobligatorio";
    // Por ahora redirige a /retos para pruebas
    //router.push(`/retos`);
    router.push(`/${base}/${id}`);
  };

  // Render para las secciones de Fake API
  const renderizedCourses = (list: Courses[]) =>
    list.map((course) => (
      <div
        key={course.id}
        className="snapItem cursoCard"
        onClick={() => handleViewCourse(course.id)}
      >
        <div className="outliness">
          <div className="coursetitle">{course.title}</div>
          <div className="description">{course.description}</div>
          <div className="textofmodulescompleted">
            {course.completedCourses} de {course.totalCourses}
            <span className="textofmodulescompleted2">
              {" "}
              módulos completados
            </span>
          </div>
          <div className="lengthofmodulestotal">
            {Array.from({ length: course.totalCourses }, (_, idx) => (
              <div
                key={idx}
                className={`progressbar ${
                  idx < course.completedCourses ? "completed" : "incomplete"
                }`}
              />
            ))}
          </div>
        </div>
        <Image
          src={course.picture}
          alt={course.title}
          width={10000}
          height={10000}
          className="imageofcourses"
        />
      </div>
    ));

  return (
    <div className="main-content">
      {/* Sección de Cursos Obligatorios */}{/* 
      <div className="blackrectangle">
        <h3 className="sectiontitle">Cursos Obligatorios</h3>

        {loading ? (
          <p>Cargando cursos obligatorios…</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div className="scrollArea">
            <CoursesCarousel
              cursos={obligCursos}
              onCardClick={handleViewCourse}
            />
          </div>
        )}
      </div>

      {/* Secciones existentes (Fake API) */}{/*}
      {[
        { title: "Mis Cursos Asignados", list: asignedCourses, id: "asigned" },
        { title: "Mis Cursos Opcionales", list: optionalCourses, id: "optional" },
        { title: "Mis Cursos Recomendados", list: recomendedCourses, id: "recomended" },
      ].map(({ title, list, id }) => (
        <div key={id} className="blackrectangle">
          <h3 className="sectiontitle">{title}</h3>
          <div id={id} className="scrollArea">
            {renderizedCourses(list)}
          </div>
        </div>
      ))}
    </div>
  );
}*/}
