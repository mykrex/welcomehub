"use client";
import React, { useMemo } from "react";
import "./rankingPodium.css";

//* Icons */
import TrophyIcon from "./icons/trophyIcon";
import SecondPlaceMedal from "./icons/SecondPlaceMedal";
import ThirdPlaceMedal from "./icons/ThirdPlaceMedal";
import Image from "next/image";

//* Mock Data */
import { mockStats, mockUsuarios } from "@/app/api/retos/mock/users";

//* Check if user's name is too long and truncate if necessary */
import { useEffect, useRef, useState } from "react";


function TruncatingProfileName({
  name,
  colorClass,
}: {
  name: string;
  colorClass: string;
}) {
  const nameRef = useRef<HTMLDivElement>(null);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const el = nameRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      setCanExpand(true);
    }
  }, [name]);

  return (
    <div
      className={`profile-name-container ${colorClass} ${
        canExpand ? "can-expand" : ""
      }`}
    >
      <div className="profile-name" ref={nameRef}>
        {name}
      </div>
    </div>
  );
}

export default function RankingPodium() {
  const ranking = useMemo(() => {
    return mockStats
      .map((stats) => {
        const user = mockUsuarios.find((u) => u.id_usuario === stats.id_user);
        return {
          id: stats.id_user,
          nombre_completo: `${user?.nombres ?? ""} ${user?.apellidos ?? ""}`,
          puntos: stats.puntos_total,
          imagen: user?.imagen ?? "/Avatars/default.jpg",
        };
      })
      .sort((a, b) => b.puntos - a.puntos);
  }, []);

  const first = ranking[0];
  const second = ranking[1];
  const third = ranking[2];
  const others = ranking.slice(3);

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <div className="ranking-title">Ranking de Equipo |</div>
        <div className="ranking-subtitle">All Time</div>
      </div>

      <div className="ranking-content">
        {/* ───────── Podium ───────── */}
        <div className="podium-container">
          {/* SECOND PLACE */}
          <div className="podium-item podium-item--second">
            <div className="profile-card">
              <Image
                src={second.imagen}
                alt="Second Place"
                width={130}
                height={126}
                className="profile-picture"
              />
              <TruncatingProfileName
                name={second.nombre_completo}
                colorClass="profile-name-container--first"
              />
            </div>
            <div className="points-wrapper">
              <div className="points-card points-card--second">
                <SecondPlaceMedal />
                <div className="points-info">
                  <div className="points-number">{second.puntos}</div>
                  <div className="points-label">Puntos</div>
                </div>
              </div>
            </div>
          </div>

          {/* FIRST PLACE */}
          <div className="podium-item podium-item--first">
            <div className="profile-card">
              <Image
                src={first.imagen}
                alt="First Place"
                width={130}
                height={126}
                className="profile-picture"
              />
              <TruncatingProfileName
                name={first.nombre_completo}
                colorClass="profile-name-container--first"
              />
            </div>
            <div className="points-wrapper">
              <div className="points-card points-card--first">
                <TrophyIcon />
                <div className="points-info">
                  <div className="points-number">{first.puntos}</div>
                  <div className="points-label">Puntos</div>
                </div>
              </div>
            </div>
          </div>

          {/* THIRD PLACE */}
          <div className="podium-item podium-item--third">
            <div className="profile-card">
              <Image
                src={third.imagen}
                alt="Third Place"
                width={130}
                height={126}
                className="profile-picture"
              />
              <TruncatingProfileName
                name={third.nombre_completo}
                colorClass="profile-name-container--first"
              />
            </div>
            <div className="points-wrapper">
              <div className="points-card points-card--third">
                <ThirdPlaceMedal />
                <div className="points-info">
                  <div className="points-number">{third.puntos}</div>
                  <div className="points-label">Puntos</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───────── Ranking Table ───────── */}
        <div className="ranking-table">
          <div className="ranking-table-header">
            <div className="ranking-header-item">Rank</div>
            <div className="ranking-header-item">Colaborador</div>
            <div className="ranking-header-item">Puntos</div>
          </div>

          <div className="ranking-divider" />

          <div className="ranking-table-body">
            {others.map((user, index) => (
              <div key={user.id} className="ranking-row">
                <div className="ranking-rank">{index + 4}</div>
                <Image
                  className="profile-picture-small"
                  src={user.imagen}
                  alt={`Profile of ${user.nombre_completo}`}
                  width={61}
                  height={61}
                />
                <div className="ranking-name">{user.nombre_completo}</div>
                <div className="ranking-points">{user.puntos}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
