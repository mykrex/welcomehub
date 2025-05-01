'use client';
import './userStats.css';

export default function UserStats() {
  return (
    <div className="user-stats-container">
      <div className="stats-header-wrapper">
        <div className="stats-name">Gabriel David Cruz Martinez |</div>
        <div className="stats-title">Mis Estadísticas</div>
      </div>

      <div className="stats-cards-wrapper">
        {/* Puntos Totales */}
        <div className="stats-card points">
          <div className="points-icon" />
          <div className="stats-card-content">
            <div className="stats-card-value">887</div>
            <div className="stats-card-label">Puntos Totales</div>
          </div>
        </div>

        {/* Podios */}
        <div className="stats-card podiums">
          <div className="podiums-icon-wrapper">
            <div className="podiums-shape1" />
            <div className="podiums-shape2" />
          </div>
          <div className="stats-card-content">
            <div className="stats-card-value">0</div>
            <div className="stats-card-label">Podios</div>
          </div>
        </div>

        {/* Streak */}
        <div className="stats-card streak">
          <div className="streak-icon-wrapper">
            <div className="streak-shape1" />
            <div className="streak-shape2" />
          </div>
          <div className="stats-card-content">
            <div className="stats-card-value">2</div>
            <div className="stats-card-label">Streak</div>
          </div>
        </div>

        {/* Retos Hechos */}
        <div className="stats-card challenges">
          <div className="challenges-icon-wrapper">
            <div className="challenges-shape1" />
            <div className="challenges-shape2" />
          </div>
          <div className="stats-card-content">
            <div className="stats-card-value">13</div>
            <div className="stats-card-label">Retos Hechos</div>
          </div>
        </div>
      </div>
    </div>
  );
}