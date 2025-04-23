'use client';

import React, { useState, useEffect } from 'react';
import "@/app/(authed)/timecard/TimeCard.css";
import './TimeCard.css';

interface dayweek {
  name: string;
  date: Date;
  format: string;
}

const obtainweekfrom = (base: Date): dayweek[] => {
  const daysoftheweek = base.getDay(); // 0 = Domingo
  const startofweek = new Date(base);


  startofweek.setDate(base.getDate() - daysoftheweek);

  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const week: dayweek[] = [];

  for (let i = 0; i < 7; i++) {
    const datef = new Date(startofweek);
    datef.setDate(startofweek.getDate() + i);
    const formatf = datef.toLocaleDateString('es-MX');
    week.push({ name: days[i], date: datef, format: formatf });
  }

  return week;
};

const TimeCard = () => {
  const actualdate = new Date(); //DOESNT CHANGE since it stays the same day
  const [startdate, setFechaBase] = useState<Date>(new Date());
  const [week, setWeek] = useState<dayweek[]>([]);
  const [hours, setHours] = useState<number[]>(Array(7).fill(0));
  const cmonth = actualdate.toLocaleString('es-MX', { month: 'long' });
  const month = cmonth.charAt(0).toUpperCase() + cmonth.slice(1);

  useEffect(() => {
    setWeek(obtainweekfrom(startdate));
  }, [startdate]);

  const handleChange = (index: number, value: number) => {
    const newHours = [...hours];
    newHours[index] = value;
    setHours(newHours);
  };

  const totalHours = hours.reduce((acc, curr) => acc + curr, 0);

  const copylastweek = () => alert('Copiar semana pasada (simulado)');
  const fromMondayFriday = () => {
    const hoursmonday = hours[1];
    const newHours = [...hours];
    for (let i = 1; i <= 5; i++) newHours[i] = hoursmonday;
    setHours(newHours);
  };
  const DeleteEverything = () => setHours(Array(7).fill(0));
  const save = () => alert('Guardado exitosamente (simulado)');
  const send = () => alert('Enviado exitosamente (simulado)');

  const Weeknumber = week.length > 0
    ? Math.ceil(
      (week[0].date.getTime() - new Date(week[0].date.getFullYear(), 0, 1).getTime()) /
      (1000 * 60 * 60 * 24 * 7)
    )
    : 0;


  //Send foward or backwards the week
  const changeWeek = (days: number) => {
    const newWeek = new Date(startdate);
    newWeek.setDate(startdate.getDate() + days);
    setFechaBase(newWeek);
    setHours(Array(7).fill(0)); // Clean hours from week 
  };

  return (
    <div className="timecard-container">
      <div className="timecard-box">
        <div className="header">
          <button className="nav-btn" onClick={() => changeWeek(-7)}>‹ Periodo Anterior</button>
          <h2 className="weekendpayment">
            <strong>Periodo de Pago:</strong> {week[0]?.format} - {week[6]?.format}
          </h2>
          <button className="nav-btn" onClick={() => changeWeek(7)}>Siguiente Periodo ›</button>
        </div>

        <div className="calendar-container">
          <div className="calendar-box">
            <div className="calendar-top">Hoy:</div>
            <div className="calendar-day">{actualdate.getDate()}</div>
            <div className="calendar-bottom">
              {month}
            </div>

          </div>
          <div className="status">
            <p><strong>Estatus de Time Card:</strong> No Entregado</p>
            <p><strong>Horas Totales de Time Card:</strong> {totalHours} / 42.5</p>
            <p>
              <strong>Semana:</strong> {Weeknumber} &nbsp;
              <strong>Mes:</strong> {week[1]?.date.getMonth() + 1} &nbsp;
              <strong>Año:</strong> {week[1]?.date.getFullYear()}
            </p>
          </div>
          <div className="dates">
            <div className="date-item">
              <span><strong>Fecha de Entrega:</strong></span>
              <span>N/A</span>
            </div>
            <div className="date-item">
              <span><strong>Fecha de Aprobación:</strong></span>
              <span>N/A</span>
            </div>
          </div>
        </div>

        <table className="hours-table">
          <thead>
            <tr>
              <th>Ver Más</th>
              <th>Día</th>
              <th>Fecha</th>
              <th>Horas total</th>
            </tr>
          </thead>
          <tbody>
            {week.map((dia, index) => (
              <tr key={index}>
                <td><input type="checkbox" /></td>
                <td>{dia.name}</td>
                <td>{dia.format}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={hours[index]}
                    onChange={(e) => handleChange(index, Number(e.target.value))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="buttons-bar">
          <label className="custom-checkbox">
            <input type="checkbox" onClick={copylastweek} />
            <span className="checkmark"></span>
            Copia la Semana Pasada
          </label>
          <label className="custom-checkbox">
            <input type="checkbox" onClick={fromMondayFriday} />
            <span className="checkmark"></span>
            Aplicar a todos los días (Lunes a Viernes)
          </label>
          <div className="button-group">
            <button className="red" onClick={DeleteEverything}>Eliminar Todo</button>
            <button className="gray" onClick={save}>Guardar</button>
            <button className="blue" onClick={send}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeCard;
