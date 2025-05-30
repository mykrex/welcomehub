'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { fetchWeekData } from "@/pages/api/timecard/fetchTimeCard";
import './TimeCard.css';

interface Course {
  id: string;
  title: string;
  hours: number;
}

interface DayOfWeek {
  name: string;
  date: Date;
  format: string;
  iso: string;
}

type CoursesPerDay = { [iso: string]: Course[] };

const getWeekFromBaseDate = (base: Date): DayOfWeek[] => {
  const start = new Date(base);
  start.setHours(0, 0, 0, 0); //SUPERIMPORTANT, It makes so your timezone match, this could change

  const diffToWednesday = (start.getDay() + 4) % 7; //Start with Saturday
  start.setDate(start.getDate() - diffToWednesday);

  const days = ['Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Lunes', 'Martes'];
  const week: DayOfWeek[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const format = date.toLocaleDateString('es-MX');
    const iso = date.toISOString().split('T')[0];

    week.push({ name: days[i], date, format, iso });
  }

  return week;
};

//Change states to having capital letter
const statusFormatted = (state?: string) => {
  switch ((state || '').toLowerCase()) {
    case 'enviado':
      return 'Enviado';
    case 'aprobado':
      return 'Aprobado';
    default:
      return 'Abierto';
  }
};


const TimeCard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [week, setWeek] = useState<DayOfWeek[]>([]);
  const [tempCourses, setTempCourses] = useState<{ [weekKey: string]: CoursesPerDay }>({});
  const [savedCourses, setSavedCourses] = useState<{ [weekKey: string]: CoursesPerDay }>({});
  const [approvedWeeks, setApprovedWeeks] = useState<{ [weekKey: string]: string | null }>({});
  const [weekStates, setWeekStates] = useState<{ [weekKey: string]: string }>({});
  const [deliveryDates, setDeliveryDates] = useState<{ [weekKey: string]: string }>({});
  const [expanded, setExpanded] = useState<{ [index: number]: boolean }>({});
  const [editing, setEditing] = useState<{ [iso: string]: number | null }>({});
  const [draftCourse, setDraftCourse] = useState<{ [iso: string]: Course }>({});
  const [projectOptions, setProjectOptions] = useState<{ id_proyecto: string; nombre: string }[]>([]);
  const [triggerAutoSave, setTriggerAutoSave] = useState(false);

  const [modal, setModal] = useState<null | {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }>(null);

  useEffect(() => {
    const result = getWeekFromBaseDate(startDate);
    setWeek(result);
    const initialEditingState: { [iso: string]: number | null } = {};
    result.forEach(day => {
      initialEditingState[day.iso] = null;
    });
    setEditing(initialEditingState);

  }, [startDate]);




  const weekKey = week.map(d => d.iso).join(',');

  const isCurrentWeek = (selectedDate: Date) => {
    const today = new Date();
    const startOfTodayWeek = getWeekFromBaseDate(today).map(d => d.iso).join(',');
    const startOfSelectedWeek = getWeekFromBaseDate(selectedDate).map(d => d.iso).join(',');
    return startOfTodayWeek === startOfSelectedWeek;
  };

  const isEditable = isCurrentWeek(startDate);


  useEffect(() => {
    const loadFromAPI = async () => {
      if (week.length !== 7) return;

      try {
        const data = await fetchWeekData(week[0].iso);
        if (!data) return;

        const { semana, registros, proyectosDisponibles } = data;

        const grouped: CoursesPerDay = {};
        for (const r of registros) {
          if (!grouped[r.fecha_trabajada]) grouped[r.fecha_trabajada] = [];
          grouped[r.fecha_trabajada].push({
            id: r.proyecto.id_proyecto, // ✅ CAMBIO: incluir id del proyecto
            title: r.proyecto.nombre,
            hours: r.horas,
          });
        }

        const newWeekKey = week.map(d => d.iso).join(',');

        setWeekStates(prev => ({
          ...prev,
          [newWeekKey]: semana?.estado || 'Abierto',
        }));

        setSavedCourses(prev => ({ ...prev, [newWeekKey]: grouped }));
        setTempCourses(prev => ({ ...prev, [newWeekKey]: grouped }));
        setDeliveryDates(prev => ({
          ...prev,
          [newWeekKey]: semana?.enviado_el || '',
        }));
        setApprovedWeeks(prev => ({
          ...prev,
          [newWeekKey]: semana?.aprobado_el || null,
        }));

        setProjectOptions(proyectosDisponibles);
      } catch (error) {
        console.error('Error al cargar datos de Supabase:', error);
      }
    };

    loadFromAPI();
  }, [week]);

  const getCoursesForDay = (iso: string): Course[] => {

    return tempCourses[weekKey]?.[iso] || [];
  };

  const startEdit = (iso: string, index: number, course: Course) => {
    const isEditingNow = Object.values(editing).some(i => i !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'Ya estás editando otro proyecto. Termínalo antes de continuar.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    setEditing(prev => ({ ...prev, [iso]: index }));
    setDraftCourse(prev => ({ ...prev, [iso]: { ...course } }));
  };

  const confirmEdit = (iso: string, index: number) => {
    const updated = draftCourse[iso];
    if (!updated || !updated.id || updated.title.trim() === '') {
      setModal({
        title: 'Error',
        message: 'Debes seleccionar un proyecto válido antes de aceptar.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    setTempCourses(prev => {
      const dayCourses = prev[weekKey]?.[iso] || [];
      const newCourses = [...dayCourses];
      newCourses[index] = updated;
      return {
        ...prev,
        [weekKey]: {
          ...prev[weekKey],
          [iso]: newCourses,
        },
      };
    });

    setEditing(prev => ({ ...prev, [iso]: null }));
  };

  const cancelEdit = (iso: string) => {
    const dayCourses = tempCourses[weekKey]?.[iso] || [];
    if (dayCourses.length > 0) {
      const lastCourse = dayCourses[dayCourses.length - 1];
      if (!lastCourse.id && lastCourse.title.trim() === '' && lastCourse.hours === 0) {
        const newCourses = dayCourses.slice(0, -1);
        setTempCourses(prev => ({
          ...prev,
          [weekKey]: {
            ...prev[weekKey],
            [iso]: newCourses,
          }
        }));
      }
    }
    setEditing(prev => ({ ...prev, [iso]: null }));
  };

  const deleteCourse = (iso: string, index: number) => {
    const isEditingNow = Object.values(editing).some(i => i !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes borrar mientras estás editando otro proyecto.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    setTempCourses(prev => {
      const dayCourses = prev[weekKey]?.[iso] || [];
      const newCourses = dayCourses.filter((_, i) => i !== index);
      return {
        ...prev,
        [weekKey]: {
          ...prev[weekKey],
          [iso]: newCourses,
        },
      };
    });
  };

  const addCourse = (iso: string) => {
    if (editing[iso] !== null && editing[iso] !== undefined) return;
    setTempCourses(prev => {
      const existing = prev[weekKey]?.[iso] || [];
      const newCourses = [...existing, { id: '', title: '', hours: 0 }];
      return {
        ...prev,
        [weekKey]: {
          ...prev[weekKey],
          [iso]: newCourses,
        },
      };
    });
    setEditing(prev => ({ ...prev, [iso]: (getCoursesForDay(iso).length || 0) }));
    setDraftCourse(prev => ({ ...prev, [iso]: { id: '', title: '', hours: 0 } }));
  };

  const totalHours = week.reduce((acc, day) => {
    const courses = getCoursesForDay(day.iso);
    return acc + courses.reduce((sum, c) => sum + c.hours, 0);
  }, 0);

  const isWeekClean = (): boolean => {
    const noEditing = Object.values(editing).every(index => index === null);
    const current = tempCourses[weekKey] || {};
    const saved = savedCourses[weekKey] || {};
    const unchanged = JSON.stringify(current) === JSON.stringify(saved);
    return noEditing && unchanged;
  };
  const changeWeek = (days: number) => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes cambiar de semana mientras estás editando.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    if (!isWeekClean()) {
      setModal({
        title: 'Advertencia',
        message: 'Antes de cambiar de semana, debes guardar los cambios.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + days);
    setStartDate(newDate);
    setExpanded({});
  };

  const toggleExpand = (index: number) => {
    const iso = week[index]?.iso;
    const isEditingThisDay = editing[iso] !== null && editing[iso] !== undefined;
    if (isEditingThisDay) {
      cancelEdit(iso);
    }
    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const copyLastWeek = async () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes copiar la semana pasada mientras editas.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    setModal({
      title: 'Confirmar',
      message: '¿Deseas duplicar los proyectos de la semana pasada? Esto borrará lo actual y lo guardará automáticamente.',
      confirmText: 'Sí',
      cancelText: 'No',
      onConfirm: async () => {
        const prevWeekDate = new Date(startDate);
        prevWeekDate.setDate(startDate.getDate() - 7);

        const prevWeek = getWeekFromBaseDate(prevWeekDate);

        try {
          const prevData = await fetchWeekData(prevWeek[0].iso); //Obtain Api
          const prevCourses = prevData.registros.reduce((acc: CoursesPerDay, r) => {
            if (!acc[r.fecha_trabajada]) acc[r.fecha_trabajada] = [];
            acc[r.fecha_trabajada].push({
              id: r.proyecto.id_proyecto,
              title: r.proyecto.nombre,
              hours: r.horas,
            });
            return acc;
          }, {});

          const newWeekCourses: CoursesPerDay = {};
          week.forEach((day, i) => {
            const prevDay = prevWeek[i];
            if (prevDay && prevCourses[prevDay.iso]) {
              newWeekCourses[day.iso] = prevCourses[prevDay.iso].map(c => ({
                id: c.id,
                title: c.title,
                hours: c.hours
              }));
            }
          });

          setTempCourses(prev => ({ ...prev, [weekKey]: newWeekCourses }));
          setSavedCourses(prev => ({ ...prev, [weekKey]: newWeekCourses }));
          setTriggerAutoSave(true);
          setModal(null);
        } catch (error) {
          console.error("❌ Error al copiar semana pasada:", error);
          setModal({
            title: "Error",
            message: "No se pudo cargar la semana anterior desde el servidor.",
            onConfirm: () => setModal(null)
          });
        }
      },
      onCancel: () => setModal(null)
    });
  };




  const deleteAll = () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes eliminar mientras editas.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    setModal({
      title: 'Confirmar',
      message: '¿Estás seguro de que quieres eliminar todo? Esto se guardará automáticamente.',
      confirmText: 'Sí',
      cancelText: 'No',
      onConfirm: () => {
        const updated = { ...tempCourses, [weekKey]: {} };
        setTempCourses(updated);
        setSavedCourses(prev => ({ ...prev, [weekKey]: {} }));
        setTriggerAutoSave(true);
        setModal(null);
      },
      onCancel: () => setModal(null)
    });
  };

  // ✅ CAMBIO: ahora se envía curso.id en vez de curso.title
  const saveWeek = useCallback(async () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes guardar mientras editas.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    const current = tempCourses[weekKey] || {};

    const simplifiedCourses = Object.fromEntries(
      Object.entries(current).map(([iso, entries]) => [
        iso,
        entries.map(c => ({
          title: c.id, // 👈 esto sigue siendo el id_proyecto
          hours: c.hours
        }))
      ])
    );

    // 🚀 Aquí asumimos que guardar también es enviar (ya no hay botón aparte)
    const today = new Date().toISOString().split('T')[0];

    const body = {
      week,
      coursesPerDay: simplifiedCourses,
      deliveryDate: today,
      approvedDate: approvedWeeks[weekKey] ?? undefined,
      approvedBy: null
    };

    const response = await fetch('/api/timecard/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error('❌ Error guardando semana');

      // Restaurar en caso de error
      setSavedCourses(prev => ({ ...prev, [weekKey]: current }));
      setTempCourses(prev => ({ ...prev, [weekKey]: current }));

      setModal({
        title: 'Error',
        message: 'Hubo un error al guardar los datos.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    // Save everything correctly
    const updatedSavedCourses = { ...savedCourses, [weekKey]: current };
    setSavedCourses(updatedSavedCourses);
    setTempCourses(prev => ({ ...prev, [weekKey]: current }));
    setDeliveryDates(prev => ({ ...prev, [weekKey]: today }));

    setModal({
      title: 'Guardado',
      message: 'Semana guardada y enviada correctamente.',
      onConfirm: () => setModal(null)
    });
  }, [editing, tempCourses, week, weekKey, approvedWeeks, savedCourses]);

  useEffect(() => {
    if (triggerAutoSave) {
      saveWeek();
      setTriggerAutoSave(false);
    }
  }, [triggerAutoSave, saveWeek]);

/*
  const toggleApproval = async () => {
    const semana = await fetchWeekData(week[0].iso);
    if (!semana || !semana.semana?.id_semana) return;

    console.log("ID que se está enviando a aprobar:", semana.semana.id_semana); // <-- DEBUG

    const response = await fetch('/api/timecard/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_semana: semana.semana.id_semana })
    });

    if (!response.ok) {
      setModal({
        title: 'Error',
        message: 'No se pudo aprobar la semana.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    const now = new Date().toISOString();
    setApprovedWeeks(prev => ({ ...prev, [weekKey]: now }));
    setWeekStates(prev => ({ ...prev, [weekKey]: 'aprobado' }));
    setModal({
      title: 'Aprobado',
      message: 'Semana aprobada correctamente.',
      onConfirm: () => setModal(null)
    });
  };
*/

  const today = new Date();
  const currentMonth = today.toLocaleString('es-MX', { month: 'long' });
  const monthName = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
  const weekNumber = week.length
    ? Math.ceil((week[0].date.getTime() - new Date(week[0].date.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))
    : 0;

  return (
    <div className="timecard-container">
      <div className="timecard-box">

        {/* HEADER */}
        <div className="header">
          <button className="nav-btn" onClick={() => changeWeek(-7)}>‹ Periodo Anterior</button>
          <h2 className="weekendpayment">
            <strong>Periodo de Pago:</strong> {week[0]?.format} - {week[6]?.format}
          </h2>
          <button className="nav-btn" onClick={() => changeWeek(7)}>Siguiente Periodo ›</button>
        </div>

        {/* CALENDAR AND ESTATUS */}
        <div className="calendar-container">
          <div className="calendar-box">
            <div className="calendar-top">Hoy:</div>
            <div className="calendar-day">{today.getDate()}</div>
            <div className="calendar-bottom">{monthName}</div>
          </div>

          <div className="status">
            <p><strong>Estatus de Time Card:</strong> {
              statusFormatted(weekStates[weekKey])
            }</p>
            <p><strong>Horas Totales de Time Card:</strong> {totalHours.toFixed(1)} / 42.5</p>
            <p>
              <strong>Semana:</strong> {weekNumber} &nbsp;
              <strong>Mes:</strong> {week[1]?.date.getMonth() + 1} &nbsp;
              <strong>Año:</strong> {week[1]?.date.getFullYear()}
            </p>
          </div>

          <div className="dates">
            <div className="date-item">
              <span><strong>Guardado recientemente:</strong></span>
              <span>{deliveryDates[weekKey] || 'N/A'}</span>
            </div>
            <div className="date-item">
              <span><strong>Fecha de Aprobación:</strong></span>
              <span>{approvedWeeks[weekKey] || 'N/A'}</span>
            </div>
          </div>
        </div>
        {/* HOURS TABLE */}
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
              const cursos = getCoursesForDay(dia.iso);
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
                            cursos.map((curso, i) => (
                              editing[dia.iso] === i ? (
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
                                    value={draftCourse[dia.iso]?.hours ?? ''}
                                    onChange={e => {
                                      let value = parseFloat(e.target.value);
                                      if (isNaN(value) || value < 0) value = 0;
                                      const rounded = Math.floor(value * 10) / 10;
                                      setDraftCourse(prev => ({
                                        ...prev,
                                        [dia.iso]: { ...prev[dia.iso], hours: rounded }
                                      }));
                                    }}
                                  />
                                  <button className={`action-button ${isEditable ? '' : 'invisible-preserved'}`} onClick={() => confirmEdit(dia.iso, i)}>Aceptar</button>
                                  <button className={`action-button ${isEditable ? '' : 'invisible-preserved'}`} onClick={() => cancelEdit(dia.iso)}>Cancelar</button>
                                </div>
                              ) : (

                                <div key={i} className="course-entry">
                                  <div className="course-info">
                                    <strong>{curso.title}</strong> — {curso.hours} horas
                                  </div>
                                  <div>
                                    <button className={`action-button-blue ${isEditable ? '' : 'invisible-preserved'}`} onClick={() => startEdit(dia.iso, i, curso)}>Editar</button>
                                    <button className={`action-button-red ${isEditable ? '' : 'invisible-preserved'}`} onClick={() => deleteCourse(dia.iso, i)}>Borrar</button>
                                  </div>
                                </div>

                              )
                            ))
                          ) : (
                            <div>No hay proyectos hechos este día.</div>
                          )}
                          {(editing[dia.iso] === null || editing[dia.iso] === undefined) && (
                            <button className={`btn-anadir ${isEditable ? '' : 'invisible-preserved'}`} onClick={() => addCourse(dia.iso)}>
                              + Añadir Curso
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

        {/*INFERIOR BUTTONS*/}
        <div className={`buttons-bar ${isEditable ? '' : 'invisible-preserved'}`}>
          <button className="link-button" onClick={copyLastWeek}>
            Copiar la Semana Pasada
          </button> <button>
          </button>

          <div className="button-group">
            <button> </button>
            <button className="red" style={{ visibility: isEditable ? 'visible' : 'hidden' }} onClick={deleteAll}>Eliminar Todo</button>
            <button className="gray" style={{ visibility: isEditable ? 'visible' : 'hidden' }} onClick={saveWeek}>Guardar</button>
          </div>
        </div>
      </div>

      {/*The modal is for make the possible warnings*/}
      {modal && (
        <Modal
          title={modal.title}
          message={modal.message}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}
    </div>
  );
};

export default TimeCard;
