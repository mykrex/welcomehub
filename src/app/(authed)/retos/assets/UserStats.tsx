'use client';
import './userStats.css';

//* Assets */
import StarIcon from './icons/starIcon';
import MedalStatsIcon from './icons/medalStatsIcon';
import FireIcon from './icons/fireIcon';
import FlagStatsIcon from './icons/flagStatsIcon';

//* Libraries */
import { useEffect, useState } from 'react';

//* Mocks & Types */
import { mockUsuarios, mockStats } from '@/app/api/retos/mock/users';
import { Usuario, RetoUsuarioStats } from '@/app/api/retos/types/retoTypes';

export default function UserStats() {
  const [stats, setStats] = useState<RetoUsuarioStats | null>(null);
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const userId = 1;

    // Load mock data
    const userStats = mockStats.find((s) => s.id_user === userId) || null;
    const userData = mockUsuarios.find((u) => u.id_usuario === userId) || null;

    setStats(userStats);
    setUser(userData);
  }, []);

  if (!stats || !user) return null;

  return (
    <div className="user-stats-container">
      <div className="stats-header-wrapper">
        <div className="stats-name">
          {`${user.nombres} ${user.apellidos} |`}
        </div>
        <div className="stats-title">Mis Estadísticas</div>
      </div>

      <div className="stats-cards-wrapper">

        {/* Puntos Totales */}
        <div className="stats-card puntos">
          <div className="icon-wrapper">
            <StarIcon />
          </div>
          <div className="stats-card-content">
            <div className="stats-card-value">{stats.puntos_total}</div>
            <div className="stats-card-label">Puntos Totales</div>
          </div>
        </div>

        {/* Podios */}
        <div className="stats-card podiums">
          <div className="icon-wrapper">
            <MedalStatsIcon />
          </div>
          <div className="stats-card-content">
            <div className="stats-card-value">{stats.podios_total}</div>
            <div className="stats-card-label">Podios</div>
          </div>
        </div>

        {/* Streak */}
        <div className="stats-card streak">
          <div className="icon-wrapper">
            <FireIcon />
          </div>
          <div className="stats-card-content">
            <div className="stats-card-value">{stats.streak_actual}</div>
            <div className="stats-card-label">Streak</div>
          </div>
        </div>

        {/* Retos Hechos */}
        <div className="stats-card challenges">
          <div className="icon-wrapper">
            <FlagStatsIcon />
          </div>
          <div className="stats-card-content">
            <div className="stats-card-value">{stats.retos_completados_total}</div>
            <div className="stats-card-label">Retos Hechos</div>
          </div>
        </div>
      </div>
    </div>
  );
}
