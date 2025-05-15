"use client";
import React,{useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {getCursos, Courses} from "@/app/api/cursos/cursos";

//import SidebarMenu from "@/app/components/(layout)/SidebarMenu";
//import NavBarMenu from "@/app/components/(layout)/NavBarMenu";
import "@/app/verCursos/verCursos.css";
import "@/app/(authed)/cursos/cursos.css";

export default function CoursesDashboard() {
  const router = useRouter();

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

  const renderizedCourses = (list: Courses[]) =>
    list.map((course) => (
      <div
        key={course.title}
        className={"snapItem cursoCard"}
        onClick={() => router.push("/cursos/verCurso")}
      >
        <div className="outliness">
          <div className="coursetitle">{course.title}</div>
          <div className="description">{course.description}</div>
          <div className="textofmodulescompleted">
            {course.completedCourses} de {course.totalCourses}
            <span className="textofmodulescompleted2"> módulos completados</span>
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
      {[
        { title: "Mis Cursos Asignados", list: asignedCourses, id: "asigned" },
        { title: "Mis Cursos Opcionales", list: optionalCourses, id: "optional" },
        { title: "Mis Cursos Recomendados", list: recomendedCourses, id: "recomended" },
      ].map(({ title, list, id }) => (
        <div key={title} className="blackrectangle">
          <h3 className="sectiontitle">{title}</h3>
          <div id={id} className={"scrollArea"}>
            {renderizedCourses(list)}
          </div>
        </div>
      ))}
    </div>
  );
}