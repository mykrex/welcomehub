'use client';

import React, { useState, useEffect } from 'react';
import {
  saveWeekData,
  saveSubmittedWeeks,
  saveApprovedWeeks,
  saveDeliveryDates,
} from '@/app/(authed)/timecard/timecard';

import '@/app/(authed)/timecard/TimeCard.css';
import './TimeCard.css';

interface Course {
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

// Build the week starting from Sunday
const getWeekFromBaseDate = (base: Date): DayOfWeek[] => {
  const start = new Date(base);
  start.setDate(base.getDate() - base.getDay());
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
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

const TimeCard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [week, setWeek] = useState<DayOfWeek[]>([]);
  const [tempCourses, setTempCourses] = useState<{ [weekKey: string]: CoursesPerDay }>({});
  const [savedCourses, setSavedCourses] = useState<{ [weekKey: string]: CoursesPerDay }>({});
  const [submittedWeeks, setSubmittedWeeks] = useState<Set<string>>(new Set());
  const [approvedWeeks, setApprovedWeeks] = useState<{ [weekKey: string]: string | null }>({});
  const [deliveryDates, setDeliveryDates] = useState<{ [weekKey: string]: string }>({});
  const [expanded, setExpanded] = useState<{ [index: number]: boolean }>({});
  const [editing, setEditing] = useState<{ [iso: string]: number | null }>({});
  const [draftCourse, setDraftCourse] = useState<{ [iso: string]: Course }>({});
  const [isDirty, setIsDirty] = useState(false); // Mark changes

  useEffect(() => {
    const saved = localStorage.getItem('savedCourses');
    const submitted = localStorage.getItem('submittedWeeks');
    const approved = localStorage.getItem('approvedWeeks');
    const delivery = localStorage.getItem('deliveryDates');

    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedCourses(parsed);
      setTempCourses(parsed); // Load all saved weeks
    }
    if (submitted) setSubmittedWeeks(new Set<string>(JSON.parse(submitted)));
    if (approved) setApprovedWeeks(JSON.parse(approved));
    if (delivery) setDeliveryDates(JSON.parse(delivery));
  }, []);

  useEffect(() => {
    setWeek(getWeekFromBaseDate(startDate));
  }, [startDate]);

  const weekKey = week.map(d => d.iso).join(',');

  const getCoursesForDay = (iso: string): Course[] => {
    return tempCourses[weekKey]?.[iso] || [];
  };

  const startEdit = (iso: string, index: number, course: Course) => {
    setEditing(prev => ({ ...prev, [iso]: index }));
    setDraftCourse(prev => ({ ...prev, [iso]: { ...course } }));
  };

  const confirmEdit = (iso: string, index: number) => {
    const updated = draftCourse[iso];
    if (!updated || updated.title.trim() === '') {
      alert("Debes escribir el nombre del curso antes de aceptar. O presiona cancelar.");
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
    setIsDirty(true);
  };

  const cancelEdit = (iso: string) => {
    const dayCourses = tempCourses[weekKey]?.[iso] || [];
    if (dayCourses.length > 0) {
      const lastCourse = dayCourses[dayCourses.length - 1];
      if (lastCourse.title.trim() === '' && lastCourse.hours === 0) {
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
    setIsDirty(false); // Cancel edit = no changes
  };

  const deleteCourse = (iso: string, index: number) => {
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
    setIsDirty(true);
  };

  const addCourse = (iso: string) => {
    if (editing[iso] !== null && editing[iso] !== undefined) return;
    setTempCourses(prev => {
      const existing = prev[weekKey]?.[iso] || [];
      const newCourses = [...existing, { title: '', hours: 0 }];
      return {
        ...prev,
        [weekKey]: {
          ...prev[weekKey],
          [iso]: newCourses,
        },
      };
    });
    setEditing(prev => ({ ...prev, [iso]: (getCoursesForDay(iso).length || 0) }));
    setDraftCourse(prev => ({ ...prev, [iso]: { title: '', hours: 0 } }));
    setIsDirty(true);
  };

  const totalHours = week.reduce((acc, day) => {
    const courses = getCoursesForDay(day.iso);
    return acc + courses.reduce((sum, c) => sum + c.hours, 0);
  }, 0);

  const changeWeek = (days: number) => {
    if (isDirty) {
      alert("Tienes cambios sin guardar. Guarda tu semana antes de cambiar de periodo.");
      return;
    }
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      alert("No puedes cambiar de semana mientras estás editando.");
      return;
    }
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + days);
    setStartDate(newDate);
    setExpanded({});
  };

  const toggleExpand = (index: number) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const copyLastWeek = () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      alert("No puedes copiar la semana pasada mientras editas.");
      return;
    }
    if (!confirm('¿Deseas duplicar los cursos de la semana pasada? Esto borrará lo que haya en la semana actual.')) return;

    const prevWeekDate = new Date(startDate);
    prevWeekDate.setDate(startDate.getDate() - 7);
    const prevWeek = getWeekFromBaseDate(prevWeekDate);
    const prevKey = prevWeek.map(d => d.iso).join(',');
    const prevCourses = savedCourses[prevKey];

    const newWeekCourses: CoursesPerDay = {};
    week.forEach(day => {
      const match = prevWeek.find(d => d.name === day.name);
      if (match && prevCourses?.[match.iso]) {
        newWeekCourses[day.iso] = prevCourses[match.iso];
      }
    });

    setTempCourses(prev => ({ ...prev, [weekKey]: newWeekCourses }));
    setIsDirty(true);
  };

  const deleteAll = () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      alert("No puedes eliminar mientras editas.");
      return;
    }
    setTempCourses(prev => ({ ...prev, [weekKey]: {} }));
    setIsDirty(true);
  };

  const saveWeek = () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      alert("No puedes guardar mientras editas.");
      return;
    }

    const current = tempCourses[weekKey] || {};
    const updatedSavedCourses = { ...savedCourses, [weekKey]: current };

    setSavedCourses(updatedSavedCourses);
    setTempCourses(prev => ({ ...prev, [weekKey]: current }));
    saveWeekData(updatedSavedCourses);
    saveSubmittedWeeks(submittedWeeks);
    saveApprovedWeeks(approvedWeeks);
    saveDeliveryDates(deliveryDates);
    setIsDirty(false);
    alert('Semana guardada');
  };

  const sendWeek = () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      alert("No puedes enviar mientras editas.");
      return;
    }

    const saved = savedCourses[weekKey];
    const temp = tempCourses[weekKey];
    if (!saved || JSON.stringify(saved) !== JSON.stringify(temp)) {
      alert('Debes guardar antes de enviar.');
      return;
    }

    const today = new Date().toLocaleDateString('es-MX');
    setSubmittedWeeks(prev => {
      const updated = new Set(prev).add(weekKey);
      saveSubmittedWeeks(updated);
      return updated;
    });
    setDeliveryDates(prev => {
      const updated = { ...prev, [weekKey]: today };
      saveDeliveryDates(updated);
      return updated;
    });

    alert('Semana enviada correctamente');
  };

  const toggleApproval = () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      alert("No puedes aprobar mientras editas.");
      return;
    }

    if (!submittedWeeks.has(weekKey)) return;

    setApprovedWeeks(prev => {
      const isApproved = prev[weekKey];
      const updated = { ...prev };
      if (isApproved) {
        updated[weekKey] = null;
      } else {
        const date = new Date();
        date.setDate(date.getDate() + 5);
        updated[weekKey] = date.toLocaleDateString('es-MX');
      }
      saveApprovedWeeks(updated);
      return updated;
    });
  };

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

        {/* CALENDAR / STATUS */}
        <div className="calendar-container">
          <div className="calendar-box">
            <div className="calendar-top">Hoy:</div>
            <div className="calendar-day">{today.getDate()}</div>
            <div className="calendar-bottom">{monthName}</div>
          </div>

          <div className="status">
            <p><strong>Estatus de Time Card:</strong> {submittedWeeks.has(weekKey) ? (approvedWeeks[weekKey] ? 'Entregado' : 'Enviado') : 'No Entregado'}</p>
            <p><strong>Horas Totales de Time Card:</strong> {totalHours.toFixed(1)} / 42.5</p>
            <p>
              <strong>Semana:</strong> {weekNumber} &nbsp;
              <strong>Mes:</strong> {week[1]?.date.getMonth() + 1} &nbsp;
              <strong>Año:</strong> {week[1]?.date.getFullYear()}
            </p>
          </div>

          <div className="dates">
            <div className="date-item">
              <span><strong>Fecha de Entrega:</strong></span>
              <span>{deliveryDates[weekKey] || 'N/A'}</span>
            </div>
            <div className="date-item">
              <span><strong>Fecha de Aprobación:</strong></span>
              <span>{approvedWeeks[weekKey] || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* TABLA */}
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
              const cursos = getCoursesForDay(dia.iso);
              const horasTotales = cursos.reduce((sum, c) => sum + c.hours, 0);

              return (
                <React.Fragment key={index}>
                  <tr>
                    <td><input type="checkbox" onClick={() => toggleExpand(index)} /></td>
                    <td>{dia.name}</td>
                    <td>{dia.format}</td>
                    <td>{horasTotales}</td>
                  </tr>

                  {expanded[index] && (
                    <tr>
                      <td></td>
                      <td colSpan={3}>
                        <div style={{ padding: '10px' }}>
                          {cursos.length > 0 ? (
                            cursos.map((curso, i) => (
                              editing[dia.iso] === i ? (
                                <div key={i} style={{ marginBottom: '14px' }}>
                                  <input
                                    style={{ backgroundColor: 'white', marginRight: '10px' }}
                                    value={draftCourse[dia.iso]?.title || ''}
                                    onChange={e => setDraftCourse(prev => ({ ...prev, [dia.iso]: { ...prev[dia.iso], title: e.target.value } }))}
                                  />
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    style={{ backgroundColor: 'white', width: '60px' }}
                                    value={draftCourse[dia.iso]?.hours ?? ''}
                                    onChange={e => {
                                      const value = parseFloat(e.target.value);
                                      const rounded = Math.floor(value * 10) / 10; // Truncar a 1 decimal
                                      setDraftCourse(prev => ({
                                        ...prev,
                                        [dia.iso]: { ...prev[dia.iso], hours: rounded }
                                      }));
                                    }}
                                  />

                                  <button onClick={() => confirmEdit(dia.iso, i)}>✅</button>
                                  <button onClick={() => cancelEdit(dia.iso)}>❌</button>
                                </div>
                              ) : (
                                <div key={i} style={{ marginBottom: '14px' }}>
                                  <strong>{curso.title}</strong> — {curso.hours} horas
                                  <button onClick={() => startEdit(dia.iso, i, curso)}>✏️</button>
                                  <button onClick={() => deleteCourse(dia.iso, i)}>🗑️</button>
                                </div>
                              )
                            ))
                          ) : (
                            <div>No hay cursos hechos este día.</div>
                          )}
                          {/* BOTÓN AÑADIR */}
                          {editing[dia.iso] === null || editing[dia.iso] === undefined ? (
                            <button onClick={() => addCourse(dia.iso)}>+ Añadir Curso</button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {/* BOTONES ABAJO */}
        <div className="buttons-bar">
          <button className="link-button" onClick={copyLastWeek}>
            Copiar la Semana Pasada
          </button>

          <button className="link-button" onClick={toggleApproval} disabled={!submittedWeeks.has(weekKey)}>
            {approvedWeeks[weekKey] ? 'Quitar Aprobación' : 'Asignar Aprobación'}
          </button>

          <div className="button-group">
            <button className="red" onClick={deleteAll}>Eliminar Todo</button>
            <button className="gray" onClick={saveWeek}>Guardar</button>
            <button className="blue" onClick={sendWeek}>Enviar</button>
          </div>
        </div>

      </div>
    </div>
  );

};

export default TimeCard;
