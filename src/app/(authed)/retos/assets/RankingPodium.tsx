"use client";
import React, { useEffect, useState } from "react";
import "./rankingPodium.css";
import Image from "next/image";

export default function RankingPodium() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [equipo, setEquipo] = useState<string>('Equipo');

  useEffect(() => {
  fetch('/api/retos/getRankingEquipo', { credentials: 'include' })
    .then(res => res.json())
    .then(async data => {
      const updatedRanking = await Promise.all(
        (data.ranking ?? []).map(async (user: any) => {
          try {
            const res = await fetch(`/api/avatar/bajarAvatar?id_usuario=${user.id}`);
            if (!res.ok) throw new Error();
            const { url } = await res.json();
            return { ...user, imagen: `${url}&v=${Date.now()}` };
          } catch {
            return { ...user, imagen: '/placeholder_profile.png' }; // Fallback a placeholder
          }
        })
      );
      setRanking(updatedRanking);
      setEquipo(data.equipo ?? 'Equipo');
    })
    .catch(err => console.error("Error cargando ranking:", err));
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
                  className="profile-picture-small"
                  src={user.imagen}
                  alt={user.nombre_completo}
                  width={61}
                  height={61}
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
