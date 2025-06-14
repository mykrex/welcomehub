import React from "react";

interface CalendarStatusProps {
  today: Date;
  monthName: string;
  weekStates: Record<string, string>;
  weekKey: string;
  totalHours: number;
  weekNumber: number;
  week: { date: Date }[];
  deliveryDates: Record<string, string>;
  approvedWeeks: Record<string, string | null>;
  statusFormatted: (state: string) => string;
}

const CalendarStatus: React.FC<CalendarStatusProps> = ({
  today,
  monthName,
  weekStates,
  weekKey,
  totalHours,
  weekNumber,
  week,
  deliveryDates,
  approvedWeeks,
  statusFormatted,
}) => {
  return (
    <div className="calendar-container">
      <div className="calendar-box">
        <div className="calendar-top">Hoy:</div>
        <div className="calendar-day">{today.getDate()}</div>
        <div className="calendar-bottom">{monthName}</div>
      </div>

      <div className="status">
        <p>
          <strong>Estatus de Time Card:</strong>{" "}
          {statusFormatted(weekStates[weekKey])}
        </p>
        <p>
          <strong>Horas Totales de Time Card:</strong> {totalHours.toFixed(1)} /
          42.5
        </p>
        <p>
          <strong>Semana:</strong> {weekNumber} &nbsp;
          <strong>Mes:</strong> {week[1]?.date.getMonth() + 1} &nbsp;
          <strong>Año:</strong> {week[1]?.date.getFullYear()}
        </p>
      </div>

      <div className="dates">
        <div className="date-item">
          <span>
            <strong>Guardado recientemente:</strong>
          </span>
          <span>{deliveryDates[weekKey] || "N/A"}</span>
        </div>
        <div className="date-item">
          <span>
            <strong>Fecha de Aprobación:</strong>
          </span>
          <span>{approvedWeeks[weekKey] || "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarStatus;
