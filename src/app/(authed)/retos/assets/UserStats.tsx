"use client";
import "./userStats.css";

//* Assets */
import StarIcon from "./icons/starIcon";
import FlagStatsIcon from "./icons/flagStatsIcon";

//* Libraries */
import { useEffect, useState } from "react";

//* Custom Hooks */
import { useUser } from "@/app/context/UserContext";
import { useUserRetosCount } from "@/app/hooks/useUserRetosCount";

export default function UserStats() {
  const { user } = useUser();
  const { counts, loading, error } = useUserRetosCount();

  const [puntosTotales, setPuntosTotales] = useState<number>(0);
  const [retosTotales, setRetosTotales] = useState<number>(0);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (user && (user.nombres || user.apellidos)) {
      setLoadingUser(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && counts && !loading && !error) {
      const total = counts.reduce(
        (acc, c) => acc + c.veces_completado * c.puntos,
        0
      );
      setPuntosTotales(total);

      const totalRetos = counts.reduce((acc, c) => acc + c.veces_completado, 0);
      setRetosTotales(totalRetos);
    }
  }, [user, counts, loading, error]);

  if (loadingUser || !user) {
    return <p className="text-white">Cargando estadísticas del usuario...</p>;
  }

  return (
    <div className="user-stats-container">
      <div className="stats-header-wrapper">
        <div className="stats-name">
          {user.nombres || user.apellidos
            ? `${user.nombres ?? ""} ${user.apellidos ?? ""} |`
            : "Usuario sin nombre |"}
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
