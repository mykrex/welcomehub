'use client';
import React from 'react';

interface Project {
  id_proyecto: string;
  nombre: string;
}

interface Course {
  id: string;
  title: string;
  hours: number;
}

interface Day {
  iso: string;
  name: string;
  format: string;
  date: Date;
}

interface DraftCourse {
  [iso: string]: {
    id: string;
    title: string;
    hours: number;
  };
}

interface Props {
  week: Day[];
  expanded: { [index: number]: boolean };
  editing: Record<string, number | null>;
  draftCourse: DraftCourse;
  projectOptions: Project[];
  getCoursesForDay: (iso: string) => Course[];
  isEditable: boolean;
  toggleExpand: (index: number) => void;
  startEdit: (iso: string, index: number, curso: Course) => void;
  cancelEdit: (iso: string) => void;
  confirmEdit: (iso: string, index: number) => void;
  deleteCourse: (iso: string, index: number) => void;
  addCourse: (iso: string) => void;
  setDraftCourse: React.Dispatch<React.SetStateAction<DraftCourse>>;
}

const TimeTable: React.FC<Props> = ({
  week,
  expanded,
  editing,
  draftCourse,
  projectOptions,
  getCoursesForDay,
  isEditable,
  toggleExpand,
  startEdit,
  cancelEdit,
  confirmEdit,
  deleteCourse,
  addCourse,
  setDraftCourse
}) => {
  return (
    <table className="hours-table">
      <thead>
        <tr>
          <th>Ver Más</th>
          <th>Día</th>
          <th>Fecha</th>
          <th>Horas Total</th>
        </tr>
      </thead>
      <tbody>
        {week.map((dia, index) => {
          const iso = dia.iso;
          const cursos = getCoursesForDay(iso);
          const horasTotales = cursos.reduce((sum, c) => sum + c.hours, 0);
          const isExpanded = expanded[index];

          return (
            <React.Fragment key={index}>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    checked={!!isExpanded}
                    onChange={() => toggleExpand(index)}
                  />
                </td>
                <td>{dia.name}</td>
                <td>{dia.format}</td>
                <td>{horasTotales}</td>
              </tr>

              {isExpanded && (
                <tr>
                  <td colSpan={4} className="expand-td">
                    <div className="expand-content">
                      {cursos.length > 0 ? (
                        cursos.map((curso, i) =>
                          editing[iso] === i ? (
                            <div key={i} className="edit-row">
                              <select
                                className="course-input title-input"
                                value={draftCourse[iso]?.id || ''}
                                onChange={(e) => {
                                  const selectedId = e.target.value;
                                  const selectedProject = projectOptions.find(p => p.id_proyecto === selectedId);
                                  if (selectedProject) {
                                    setDraftCourse(prev => ({
                                      ...prev,
                                      [iso]: {
                                        ...prev[iso],
                                        id: selectedId,
                                        title: selectedProject.nombre
                                      }
                                    }));
                                  }
                                }}
                              >
                                <option value="" disabled>Selecciona un proyecto</option>
                                {projectOptions.map((project, idx) => (
                                  <option key={idx} value={project.id_proyecto}>
                                    {project.nombre}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                className="course-input number-input"
                                value={draftCourse[iso]?.hours ?? ''}
                                onChange={e => {
                                  let value = parseFloat(e.target.value);
                                  if (isNaN(value) || value < 0) value = 0;
                                  const rounded = Math.floor(value * 10) / 10;
                                  setDraftCourse(prev => ({
                                    ...prev,
                                    [iso]: { ...prev[iso], hours: rounded }
                                  }));
                                }}
                              />
                              <button className={`action-button ${isEditable ? '' : 'invisible-preserved'}`} onClick={() => confirmEdit(iso, i)}>Aceptar</button>
                              <button className={`action-button ${isEditable ? '' : 'invisible-preserved'}`} onClick={() => cancelEdit(iso)}>Cancelar</button>
                            </div>
                          ) : (
                            <div key={i} className="course-entry">
                              <div className="course-info">
                                <strong>{curso.title}</strong> — {curso.hours} horas
                              </div>
                              <div>
                                <button className={`action-button-blue ${isEditable ? '' : 'invisible-preserved'}`} onClick={() => startEdit(iso, i, curso)}>Editar</button>
                                <button className={`action-button-red ${isEditable ? '' : 'invisible-preserved'}`} onClick={() => deleteCourse(iso, i)}>Borrar</button>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div>No hay proyectos hechos este día.</div>
                      )}
                      {(editing[iso] === null || editing[iso] === undefined) && (
                        <button className={`btn-anadir ${isEditable ? '' : 'invisible-preserved'}`} onClick={() => addCourse(iso)}>
                          + Añadir Proyecto
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default TimeTable;
