'use client';
import './userStats.css';

//* Assets */
import StarIcon from './icons/starIcon';
import FlagStatsIcon from './icons/flagStatsIcon';

//* Libraries */
import { useEffect, useState } from 'react';

//* Custom Hooks */
import { useUser } from '@/app/context/UserContext';
import {useUserRetosCount} from '@/app/hooks/useUserRetosCount';

export default function UserStats() {
  const { user } = useUser();
  const { counts, loading, error } = useUserRetosCount();

  const [puntosTotales, setPuntosTotales] = useState<number>(0);
  const [retosTotales, setRetosTotales] = useState<number>(0);

  useEffect(() => {
    if (counts && !loading && !error) {
      // Calcular puntos totales sumando todas las veces completado por los puntos del reto
      const total = counts.reduce((acc, c) => acc + c.veces_completado * c.puntos, 0);
      setPuntosTotales(total);

      // Contar total de retos completados (sumar veces_completado)
      const totalRetos = counts.reduce((acc, c) => acc + c.veces_completado, 0);
      setRetosTotales(totalRetos);
    }
  }, [counts, loading, error]);

  if (!user) return null;

  return (
    <div className="user-stats-container">
      <div className="stats-header-wrapper">
        <div className="stats-name">
          {`${user.nombres ?? ''} ${user.apellidos ?? ''} |`}
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
            <div className="stats-card-value">{puntosTotales}</div>
            <div className="stats-card-label">Puntos Totales</div>
          </div>
        </div>

        {/*
        // Podios comentados
        <div className="stats-card podiums">
          <div className="icon-wrapper">
            <MedalStatsIcon />
          </div>
          <div className="stats-card-content">
            <div className="stats-card-value">-</div>
            <div className="stats-card-label">Podios</div>
          </div>
        </div>

        // Streak comentado
        <div className="stats-card streak">
          <div className="icon-wrapper">
            <FireIcon />
          </div>
          <div className="stats-card-content">
            <div className="stats-card-value">-</div>
            <div className="stats-card-label">Streak</div>
          </div>
        </div>
        */}

        {/* Retos Hechos */}
        <div className="stats-card challenges">
          <div className="icon-wrapper">
            <FlagStatsIcon />
          </div>
          <div className="stats-card-content">
            <div className="stats-card-value">{retosTotales}</div>
            <div className="stats-card-label">Retos Hechos</div>
          </div>
        </div>

      </div>
    </div>
  );
}
