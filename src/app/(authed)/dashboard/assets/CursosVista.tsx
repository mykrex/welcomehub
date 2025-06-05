import React, { useState, useMemo } from 'react';
import './cursosVista.css';
import { useRouter } from 'next/navigation';
import { CursoInscrito } from '@/app/hooks/useCourses';

interface CursosVistaProps {
  cursos: CursoInscrito[];
}

type FiltroTipo = 'todos' | 'obligatorios' | 'opcionales' | 'completado' | 'en_progreso' | 'sin_comenzar';

const CursosVista: React.FC<CursosVistaProps> = ({ cursos }) => {
  const router = useRouter();
  const [filtroActivo, setFiltroActivo] = useState<FiltroTipo>('todos');

  const getEstadoDisplay = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 'Completado';
      case 'en_progreso':
        return 'En Progreso';
      case 'sin_comenzar':
        return 'Faltante';
      default:
        return 'Faltante';
    }
  };

  const getEstadoClass = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 'completado';
      case 'en_progreso':
        return 'en-progreso';
      case 'sin_comenzar':
        return 'faltante';
      default:
        return 'faltante';
    }
  };

  const getPorcentaje = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 100;
      case 'en_progreso':
        return 50;
      case 'sin_comenzar':
        return 0;
      default:
        return 0;
    }
  };

  const handleClick = (id_curso: string) => {
    router.push(`/cursos/${id_curso}`);
  };

  // Filtrar los cursos del usuario segun el filtro activo
  const cursosFiltrados = useMemo(() => {
    let filtrados = [...cursos];

    switch (filtroActivo) {
      case 'obligatorios':
        filtrados = cursos.filter(curso => curso.obligatorio === true);
        break;
      case 'opcionales':
        filtrados = cursos.filter(curso => curso.obligatorio === false);
        break;
      case 'completado':
        filtrados = cursos.filter(curso => curso.estado === 'completado');
        break;
      case 'en_progreso':
        filtrados = cursos.filter(curso => curso.estado === 'en_progreso');
        break;
      case 'sin_comenzar':
        filtrados = cursos.filter(curso => curso.estado === 'sin_comenzar');
        break;
      case 'todos':
      default:
        filtrados = cursos;
        break;
    }

    // Ordenarlos despues de filtrarlos
    return filtrados.sort((a, b) => {
      const estadoOrden = {
        "en_progreso": 0,
        "sin_comenzar": 1,
        "completado": 2,
      };

      const estadoA = a.estado as keyof typeof estadoOrden;
      const estadoB = b.estado as keyof typeof estadoOrden;

      if (estadoOrden[estadoA] !== estadoOrden[estadoB]) {
        return estadoOrden[estadoA] - estadoOrden[estadoB];
      } else {
        return a.id_curso.localeCompare(b.id_curso);
      }
    });
  }, [cursos, filtroActivo]);

  const opcionesFiltro = [
    { value: 'todos' as FiltroTipo, label: 'Todos' },
    { value: 'obligatorios' as FiltroTipo, label: 'Obligatorios' },
    { value: 'opcionales' as FiltroTipo, label: 'Opcionales' },
    { value: 'completado' as FiltroTipo, label: 'Completados' },
    { value: 'en_progreso' as FiltroTipo, label: 'En Progreso' },
    { value: 'sin_comenzar' as FiltroTipo, label: 'Sin Comenzar' },
  ];

  return (
    <div className="cv-container">
      <div className='flex justify-between items-center'>
        <div className="cv-progress-header">
          <div className="cv-progress-title">Todos mis Cursos</div>
        </div>

        {/* Filtro Desplegable */}
        <div className="cv-filter-dropdown">
          <label htmlFor="filtro-cursos" className="cv-filter-label text-gray-300 font-bold mr-2">
            Filtrar por:
          </label>
          <select
            id="filtro-cursos"
            className="cv-filter-select"
            value={filtroActivo}
            onChange={(e) => setFiltroActivo(e.target.value as FiltroTipo)}
          >
            {opcionesFiltro.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="cv-course-list">
        {cursosFiltrados.length === 0 ? (
          <div className="cv-no-courses">
            No hay cursos que coincidan con el filtro seleccionado
          </div>
        ) : (
          cursosFiltrados.map((curso) => {
            const estadoClass = getEstadoClass(curso.estado);
            const porcentaje = getPorcentaje(curso.estado);

            return (
              <div
                key={curso.id_curso}
                className="cv-curso-card"
                onClick={() => handleClick(curso.id_curso)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleClick(curso.id_curso)}
              >
                <div>
                  <div className="cv-curso-nombre">
                    {curso.titulo}
                    {curso.obligatorio}
                  </div>
                  <div className="cv-curso-abierto">{curso.descripcion}</div>
                </div>
                <div className={`cv-estado-div cv-estado-${estadoClass}`}>
                  <div className="estado-contenido">
                    <div className={`cv-circulo-estado cv-circulo-${estadoClass}`}>
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
                      {getEstadoDisplay(curso.estado)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CursosVista;