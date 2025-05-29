'use client';

import { useRef, useState } from 'react';
import CourseCard from './courseCard';
import { CursoInscrito, CursoOpcional } from '@/app/hooks/useCourses';

interface CourseSectionProps {
  title: string;
  courses: CursoInscrito[] | CursoOpcional[];
  showStatus?: boolean;
  showObligatory?: boolean;
}

export default function CourseSection({ title, courses, showStatus = false, showObligatory = false }: CourseSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 400;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + 
      (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleCourseClick = (course: CursoInscrito | CursoOpcional) => {
    // Si es un curso inscrito con contenido navegamos al detalle del curso
    if ('estado' in course && 'ruta_archivo' in course && course.ruta_archivo) {
      window.location.href = `/cursos/${course.id_curso}`;
    } else {
      // Para cursos opcionales o sin contenido mostramos la info/modal de inscripcion
      console.log('Clicked course:', course.id_curso);
      // Temos que checar esta implementacion de inscripcion y/o informacion del curso
    }
  };

  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-white text-2xl font-bold mb-4 px-4">
        {title}
      </h2>
      
      <div className="relative group">
        {/* Boton izquierdo para movernos entre cursos */}
        {canScrollLeft && (
          <button onClick={() => scroll('left')} className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {/* Container de los cursos */}
        <div ref={scrollContainerRef} onScroll={handleScroll} className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {courses.map((course) => (
            <CourseCard
              key={course.id_curso}
              id_curso={course.id_curso}
              titulo={course.titulo}
              descripcion={course.descripcion}
              portada={course.portada}
              duracion={course.duracion}
              obligatorio={course.obligatorio}
              estado={showStatus && 'estado' in course ? course.estado : undefined}
              showObligatory={showObligatory}
              onClick={() => handleCourseClick(course)}
            />
          ))}
        </div>
        
        {/* Boton derecho para movernos entre cursos */}
        {canScrollRight && (
          <button onClick={() => scroll('right')} className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
      </div>
    </div>
  );
}