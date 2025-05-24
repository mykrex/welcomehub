import React from 'react';
import './cursosVista.css';
import { useRouter } from 'next/navigation';

const CursosVista = ({ cursos }) => {
  const router = useRouter();

  const getEstado = (curso) => {
    if (curso.completedCourses === curso.totalCourses && curso.totalCourses > 0) {
      return "completado";
    } else if (curso.completedCourses > 0) {
      return "en-progreso";
    } else {
      return "faltante";
    }
  };

  const handleClick = (id) => {
    router.push(`/cursos/verCurso/${id}`);
  };

  // 🔥 Ordenar cursos según estado y por id
  const cursosOrdenados = [...cursos].sort((a, b) => {
    const estadoA = getEstado(a);
    const estadoB = getEstado(b);

    const estadoOrden = {
      "en-progreso": 0,
      "faltante": 1,
      "completado": 2,
    };

    if (estadoOrden[estadoA] !== estadoOrden[estadoB]) {
      return estadoOrden[estadoA] - estadoOrden[estadoB];
    } else {
      return a.id - b.id; // Ordenar por id ascendente si tienen mismo estado
    }
  });

  return (
    <div className="cv-container">
      <div className="cv-progress-header">
        <div className="cv-progress-title">Todos mis Cursos</div>
      </div>
      <div className="cv-course-list">
        {cursosOrdenados.map((curso, index) => {
          const estado = getEstado(curso);
          const porcentaje = curso.totalCourses
            ? (curso.completedCourses / curso.totalCourses) * 100
            : 0;

          return (
            <div
              key={index}
              className="cv-curso-card"
              onClick={() => handleClick(curso.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleClick(curso.id)}
            >
              <div>
                <div className="cv-curso-nombre">{curso.title}</div>
                <div className="cv-curso-abierto">{curso.description}</div>
              </div>
              <div className={`cv-estado-div cv-estado-${estado}`}>
                <div className="estado-contenido">
                  <div className={`cv-circulo-estado cv-circulo-${estado}`}>
                    <svg viewBox="0 0 36 36">
                      <path
                        className="cv-circulo-base"
                        d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="cv-circulo-progreso"
                        strokeDasharray={`${porcentaje}, 100`}
                        d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>
                  <span>
                    {estado === "completado"
                      ? "Completado"
                      : estado === "en-progreso"
                      ? "En Progreso"
                      : "Faltante"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CursosVista;
