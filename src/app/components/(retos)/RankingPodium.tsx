"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface UsuarioRanking {
  id: string;
  nombre_completo: string;
  puntos_total: number;
  imagen: string;
}

export default function RankingPodium() {
  const [ranking, setRanking] = useState<UsuarioRanking[]>([]);
  const [equipo, setEquipo] = useState<string>("Equipo");

  useEffect(() => {
    fetch("/api/retos/getRankingEquipo", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setRanking(data.ranking ?? []);
        setEquipo(data.equipo ?? "Equipo");
      })
      .catch((err) => console.error("Error cargando ranking:", err));
  }, []);

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <div className="ranking-title">Ranking de Equipo |</div>
        <div className="ranking-subtitle">{equipo}</div>
      </div>

      <div className="ranking-table">
        <div className="ranking-table-header">
          <div className="ranking-header-item">Rank</div>
          <div className="ranking-header-item">Colaborador</div>
          <div className="ranking-header-item">Puntos</div>
        </div>
        <div className="ranking-divider" />
        <div className="ranking-table-body">
          {ranking.map((user, index) => (
            <div key={user.id} className="ranking-row">
              <div className="ranking-left">
                <div className="ranking-rank">{index + 1}</div>
                <Image
                  src={user.imagen}
                  alt={user.nombre_completo}
                  width={61}
                  height={61}
                  className="profile-picture-small"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder_profile.png";
                  }}
                  unoptimized
                />
                <div className="ranking-name">{user.nombre_completo}</div>
              </div>
              <div className="ranking-points">{user.puntos_total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
