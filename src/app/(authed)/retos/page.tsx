"use client";

//* Styles *//
import "./retos.css";
import "@/app/components/(layout)/layout.css";

//* Libraries *//
import Image from "next/image";
import { useEffect, useState } from "react"; //* Fake Api *//

//* Icons *//
import CheckmarkIcon from "./assets/icons/checkmarkIcon";

//* Assets/Components *//
import RankingPodium from "./assets/RankingPodium";
import UserStats from "./assets/UserStats";
import Logros from "./assets/Logros";

//* Fake Api *//
import { mockRetos } from "@/app/api/retos/mock/retos";
import { mockRetoUsuarios } from "@/app/api/retos/mock/retoUsuarios";
import { Reto, RetoUsuario } from "@/app/api/retos/types/retoTypes";

//* Get current week *//
function getCurrentWeekRange(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Get Monday of this week
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  // Get Sunday of this week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };

  // Format and capitalize the month
  const format = (date: Date): string => {
    const raw = date.toLocaleDateString("es-MX", options);
    return raw.replace(/(^\d+ de )(\w)/, (_, prefix, firstLetter) =>
      prefix + firstLetter.toUpperCase()
    );
  };

  const start = format(monday);
  const end = format(sunday);

  return `${start} - ${end}`;
}



export default function Retos() {
  //* Fake Api -> State *//
  const [retos, setRetos] = useState<Reto[]>([]);
  const [userRetos, setUserRetos] = useState<RetoUsuario[]>([]);

  useEffect(() => {
    setRetos(mockRetos);
    setUserRetos(mockRetoUsuarios.filter((r) => r.id_usuario === 1)); //* TEMPORAL: Asume que Logged in user id_usuario -> 1
  }, []);

  //* Get current week *//
  const weekRange = getCurrentWeekRange();

  return (
    <div className="main-content">
      <div className="retos-page">
        <UserStats />
        <div className="retos-container">
          {/* ───────── header ───────── */}
          <div className="retos-header">
            <span className="retos-title">Mis Retos |</span>
            <span className="retos-subtitle">Semana:</span>
            <span className="retos-date">{weekRange}</span>
          </div>

          {/* ───────── table ───────── */}
          <div className="retos-table">
            {/* column labels */}
            <div className="retos-row retos-row--header">
              <div className="retos-cell retos-cell--status">Estatus</div>
              <div className="retos-cell retos-cell--type">Tipo De Reto</div>
              <div className="retos-cell retos-cell--points">Puntos</div>
              <div className="retos-cell retos-cell--description">
                Descripción
              </div>
              <div className="retos-cell retos-cell--assigned">
                Asignado por:
              </div>
              <div className="retos-cell retos-cell--progress">Progreso</div>
            </div>

            {retos.map((reto) => {
              const userReto = userRetos.find(
                (ru) => ru.id_reto === reto.id_reto
              );
              const completado = userReto?.completado ?? false;
              const progreso = userReto?.progreso ?? 0;

              return (
                <div
                  key={reto.id_reto}
                  className={`retos-row ${
                    reto.tipo_reto === "target"
                      ? "retos-row--odd"
                      : "retos-row--even"
                  }`}
                >
                  <div className="retos-cell retos-cell--status">
                    <CheckmarkIcon completed={completado} />
                  </div>
                  <div
                    className={`retos-cell retos-cell--type ${reto.tipo_reto}`}
                  >
                    {reto.tipo_reto === "streak" && "⚡Streak"}
                    {reto.tipo_reto === "challenge" && "🥊 Challenge"}
                    {reto.tipo_reto === "target" && "🎯 Target"}
                  </div>
                  <div
                    className={`retos-cell retos-cell--points ${reto.tipo_reto}`}
                  >
                    + {reto.puntos}
                  </div>
                  <div className="retos-cell retos-cell--description desc">
                    {reto.descripcion}
                  </div>
                  <div className="retos-cell retos-cell--assigned">
                    {/* fake source for now */}
                    {reto.tipo_reto === "streak" ? (
                      <Image
                        src="/welcomeHub.png"
                        alt="Logo"
                        width={120}
                        height={35}
                      />
                    ) : (
                      <span className="assigned-name">Maria Quetzalli</span>
                    )}
                  </div>
                  <div className="retos-cell retos-cell--progress">
                    {reto.tipo_reto === "streak" ? (
                      <div className="dot-group">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`dot ${
                              i < progreso ? "dot--filled" : ""
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="progress-text">
                        {completado
                          ? "Completado"
                          : reto.tipo_reto === "challenge"
                          ? `${Math.round(progreso * 100)}% completado`
                          : "Incompleto"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ───────── ranking ───────── */}
        <RankingPodium />

        {/* ───────── logros ───────── */}
        <Logros />
      </div>
    </div>
  );
}
