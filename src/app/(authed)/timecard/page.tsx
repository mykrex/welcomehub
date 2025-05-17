'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
//It what we need to save all this page.
import {
  saveWeekData,
  loadWeekData,
  saveSubmittedWeeks,
  loadSubmittedWeeks,
  saveApprovedWeeks,
  loadApprovedWeeks,
  saveDeliveryDates,
  loadDeliveryDates,
  getProjectsByUserId
} from '@/app/api/timecard/timecard';

//import '@/app/(authed)/timecard/TimeCard.css';
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
  //const [isDirty, setIsDirty] = useState(false);


  const [modal, setModal] = useState<null | {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }>(null);

  //Obtain the info yet again from Sunday to saturday.
  useEffect(() => {
    setWeek(getWeekFromBaseDate(startDate));
  }, [startDate]);



  const weekKey = week.map(d => d.iso).join(',');

  useEffect(() => {
    const loadedCourses = loadWeekData();
    const loadedSubmitted = loadSubmittedWeeks();
    const loadedApproved = loadApprovedWeeks();
    const loadedDates = loadDeliveryDates();

    setSavedCourses(loadedCourses);
    setTempCourses(loadedCourses); //Important for appear in UI
    setSubmittedWeeks(loadedSubmitted);
    setApprovedWeeks(loadedApproved);
    setDeliveryDates(loadedDates);
  }, [weekKey]);

  const [projectOptions, setProjectOptions] = useState<string[]>([]);
  const userId = '1';

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await getProjectsByUserId(userId);
      setProjectOptions(projects);
    };
    fetchProjects();
  }, []);

  // Obtain the proyects for a specific day from a code of ISO
  const getCoursesForDay = (iso: string): Course[] => {
    return tempCourses[weekKey]?.[iso] || [];
  };

  //Stars editing the specific proyect, save the indice and temporaly the information
  const startEdit = (iso: string, index: number, course: Course) => {
    setEditing(prev => ({ ...prev, [iso]: index }));
    setDraftCourse(prev => ({ ...prev, [iso]: { ...course } }));
  };

  //Comfirms edition from the proyect and update the state
  const confirmEdit = (iso: string, index: number) => {
    const updated = draftCourse[iso];
    if (!updated || updated.title.trim() === '') {
      //All setModal are for the warning from here to down in all the tsx
      setModal({
        title: 'Error',
        message: 'Debes seleccionar un proyecto antes de aceptar. O presiona cancelar.',
        onConfirm: () => setModal(null)
      });
      return;
    }
    //Update the proyect edited from the specific day temporally
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
    //setIsDirty(true);
  };
  //Cancels the edition, if the last proyect was empty, eliminates the column
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
    //setIsDirty(false);
  };
  //Delete the selected proyect temporally
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
    //setIsDirty(true);
  };

  //Adds a new proyect empty from the specific day and goes edition mode
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
    //setIsDirty(true);
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

  //Changes the week visually, and secure if it's saved or not
  const changeWeek = (days: number) => {
    //...and can't change week if it's in edition mode
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

  //Expand or obtain the view from the specific day, if it's in edition, it cancels out.
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

  //Copy all the data from the last week
  const copyLastWeek = () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes copiar la semana pasada mientras editas.',
        onConfirm: () => setModal(null)
      });
      return;
    }
    //Asks the question and tell you if you want to do it
    setModal({
      title: 'Confirmar',
      message: '¿Deseas duplicar los proyectos seleccionados de la semana pasada? Esto borrará lo que haya en la semana actual y se quedara guardado.',
      confirmText: 'Sí',
      cancelText: 'No',
      onConfirm: () => {
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

        const updated = { ...tempCourses, [weekKey]: newWeekCourses };
        setTempCourses(updated);
        setSavedCourses(prev => ({ ...prev, [weekKey]: newWeekCourses }));
        saveWeekData({ ...savedCourses, [weekKey]: newWeekCourses });
        //setIsDirty(false);
        setModal(null);
      },
      onCancel: () => setModal(null)
    });
  };

  //Delete all proyects from the actual weeek and saved automatically
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
      message: '¿Estás seguro de que quieres eliminar todo? Esto se guardara automaticamente.',
      confirmText: 'Sí',
      cancelText: 'No',
      onConfirm: () => {
        const updated = { ...tempCourses, [weekKey]: {} };
        setTempCourses(updated);
        setSavedCourses(prev => ({ ...prev, [weekKey]: {} }));
        saveWeekData({ ...savedCourses, [weekKey]: {} });
        //setIsDirty(false);
        setModal(null);
      },
      onCancel: () => setModal(null)
    });
  };
  //Save all content of the actual weekend from the state and put it on the API
  const saveWeek = () => {
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
    const updatedSavedCourses = { ...savedCourses, [weekKey]: current };

    setSavedCourses(updatedSavedCourses);
    setTempCourses(prev => ({ ...prev, [weekKey]: current }));
    saveWeekData(updatedSavedCourses);
    saveSubmittedWeeks(submittedWeeks);
    saveApprovedWeeks(approvedWeeks);
    saveDeliveryDates(deliveryDates);
    //setIsDirty(false);

    setModal({
      title: 'Guardado',
      message: 'Semana guardada correctamente.',
      onConfirm: () => setModal(null)
    });
  };

  //Send the week and checking if the info was send with no missing editions
  const sendWeek = () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes enviar mientras editas.',
        onConfirm: () => setModal(null)
      });
      return;
    }

    const saved = savedCourses[weekKey];
    const temp = tempCourses[weekKey];
    if (!saved || JSON.stringify(saved) !== JSON.stringify(temp)) {
      setModal({
        title: 'Advertencia',
        message: 'Debes guardar antes de enviar.',
        onConfirm: () => setModal(null)
      });
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

    setModal({
      title: 'Enviado',
      message: 'Semana enviada correctamente.',
      onConfirm: () => setModal(null)
    });
  };
  //Asigns or remove the aprovation of a specific week. This is just for practice atm and will be only for the administrator
  const toggleApproval = () => {
    const isEditingNow = Object.values(editing).some(index => index !== null);
    if (isEditingNow) {
      setModal({
        title: 'Advertencia',
        message: 'No puedes aprobar mientras editas.',
        onConfirm: () => setModal(null)
      });
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
        date.setDate(date.getDate());
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

        {/* CALENDAR Y ESTATUS */}
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
                                    value={draftCourse[dia.iso]?.title || ''}
                                    onChange={e =>
                                      setDraftCourse(prev => ({
                                        ...prev,
                                        [dia.iso]: { ...prev[dia.iso], title: e.target.value }
                                      }))
                                    }
                                  >
                                    <option value="" disabled>Selecciona un proyecto</option>
                                    {projectOptions.map((project, idx) => (
                                      <option key={idx} value={project}>{project}</option>
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
                                  <button className="action-button" onClick={() => confirmEdit(dia.iso, i)}>Aceptar</button>
                                  <button className="action-button" onClick={() => cancelEdit(dia.iso)}>Cancelar</button>
                                </div>
                              ) : (

                                <div key={i} className="course-entry">
                                  <div className="course-info">
                                    <strong>{curso.title}</strong> — {curso.hours} horas
                                  </div>
                                  <div>
                                    <button className="action-button-blue" onClick={() => startEdit(dia.iso, i, curso)}>Editar</button>
                                    <button className="action-button-red" onClick={() => deleteCourse(dia.iso, i)}>Borrar</button>
                                  </div>
                                </div>

                              )
                            ))
                          ) : (
                            <div>No hay proyectos hechos este día.</div>
                          )}

                          {(editing[dia.iso] === null || editing[dia.iso] === undefined) && (
                            <button className="btn-anadir" onClick={() => addCourse(dia.iso)}>
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

        {/* BOTONES INFERIORES */}
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

