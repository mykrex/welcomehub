"use client";

import StarIcon from "../(icons)/Star";
import FlagStatsIcon from "../(icons)/Flag";

import { useEffect, useState } from "react";

import { useUserRetosCount } from "@/app/hooks/useUserRetosCount";
import type { User } from "@/app/context/UserContext";

export default function UserStats() {
  const { counts, loading, error } = useUserRetosCount();

  const [puntosTotales, setPuntosTotales] = useState<number>(0);
  const [retosTotales, setRetosTotales] = useState<number>(0);
  const [perfil, setPerfil] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const res = await fetch("/api/users/info", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("No se pudo cargar el perfil");
        const data: User = await res.json();
        setPerfil(data);
      } catch (err) {
        console.error("Error cargando perfil:", err);
        setPerfil(null);
      } finally {
        setCargando(false);
      }
    }

    fetchPerfil();
  }, []);

  useEffect(() => {
    if (perfil && counts && !loading && !error) {
      const total = counts.reduce(
        (acc, c) => acc + c.veces_completado * c.puntos,
        0
      );
      const totalRetos = counts.reduce((acc, c) => acc + c.veces_completado, 0);
      setPuntosTotales(total);
      setRetosTotales(totalRetos);
    }
  }, [perfil, counts, loading, error]);

  if (cargando || !perfil) {
    return <p className="text-white">Cargando estadísticas del usuario...</p>;
  }

  const nombreCompleto = `${perfil.nombres ?? ""} ${
    perfil.apellidos ?? ""
  }`.trim();

  return (
    <div className="user-stats-container">
      <div className="stats-header-wrapper">
        <div className="stats-name">
          {nombreCompleto ? `${nombreCompleto} |` : "Usuario sin nombre |"}
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
