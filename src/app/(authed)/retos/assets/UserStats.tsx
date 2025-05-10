'use client';
import './userStats.css';

//* Assets */
import StarIcon from './icons/starIcon';
import MedalStatsIcon from './icons/medalStatsIcon';
import FireIcon from './icons/fireIcon';
import FlagStatsIcon from './icons/flagStatsIcon';

export default function UserStats() {
  return (
    <div className="user-stats-container">
      <div className="stats-header-wrapper">
        <div className="stats-name">Gabriel David Cruz Martinez |</div>
        <div className="stats-title">Mis Estadísticas</div>
      </div>

      <div className="stats-cards-wrapper">
        
        {/* Puntos Totales */}
        <div className="stats-card puntos">
          <div className="icon-wrapper">
            <StarIcon />
          </div>
          <div className="stats-card-content">
            <div className="stats-card-value">887</div>
            <div className="stats-card-label">Puntos Totales</div>
          </div>
        </div>
        


        {/* Podios */}
        <div className="stats-card podiums">
          <div className="icon-wrapper">
            <MedalStatsIcon />
          </div>

          <div className="stats-card-content">
            <div className="stats-card-value">0</div>
            <div className="stats-card-label">Podios</div>
          </div>
        </div>

        {/* Streak */}
        <div className="stats-card streak">
          <div className="icon-wrapper">
          <FireIcon />
          </div>
          <div className="stats-card-content">
            <div className="stats-card-value">2</div>
            <div className="stats-card-label">Streak</div>
          </div>
        </div>

        {/* Retos Hechos */}
        <div className="stats-card challenges">
          <div className="icon-wrapper">
            <FlagStatsIcon />
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