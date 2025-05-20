import './progressBar.css';

export default function ProgressComponent() {
  return (
    <div className="db-progress-container">
        {/*Title*/}
      <div className="db-progress-title-container">
        <div className="db-progress-title-main">Progreso Total</div>
        <div className="db-progress-title-sub">Cursos Asignados</div> {/*TODO: Hacer dropdown menu (Todos mis Cursos, Cursos Asignados, Cursos Opcionales)*/}
      </div>

        {/*Progress Bar*/}
      <div className="db-progress-bar-group">
        {/*Bars*/}
        <div className="db-progress-bar-group">
            {/*Progress Bar Total -> 100%*/}
          <div className="db-progress-bar-total" />
           {/*Progress Bar Completed -> variable*/}
          <div className="db-progress-bar-completed" /> {/*TODO -> Hacer esto con variables*/}
        </div>

        <div className="db-progress-summary">

          <div className="db-progress-item">
            <div className="db-progress-item-circle" />
            <div className="db-progress-item-label">45% Completado</div>
          </div>

          <div className="db-progress-item">
            <div className="db-progress-item-circle" style={{ background: '#9DAAA6' }} />
            <div className="db-progress-item-label">27% Restante</div>
          </div>
        </div>
      </div>
    </div>
  );
}
