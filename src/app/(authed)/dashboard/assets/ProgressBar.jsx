import "./progressBar.css";

export default function ProgressComponent() {
  return (
    <div className="db-progress-container">
      {/*Title*/}
      <div className="db-progress-title-container">
        <div className="db-progress-title-main">Progreso Total</div>
        {/*Dropdown*/}
        <select className="db-progress-dropdown" defaultValue="todos">
          <option value="todos">Todos Mis Cursos</option>
          <option value="asignados">Cursos Asignados</option>
          <option value="opcionales">Cursos Opcionales</option>
        </select>
      </div>

      {/*Progress Bar*/}
      <div className="db-progress-bar-group">
        {/*Bars*/}
          {/*Progress Bar Total -> 100%*/}
          <div className="db-progress-bar-total" />
          {/*Progress Bar Completed -> variable*/}
          <div className="db-progress-bar-completed" style={{ width: '80%' }}/>{" "}
          {/*TODO -> Hacer esto con variables*/}
      </div>

      <div className="db-progress-summary">
        <div className="db-progress-item">
          <div className="db-progress-item-circle circle-completado" />
          <div className="db-progress-item-label">45% Completado</div>
        </div>

        <div className="db-progress-item">
          <div className="db-progress-item-circle circle-restante" />
          <div className="db-progress-item-label">27% Restante</div>
        </div>
      </div>
    </div>
  );
}
