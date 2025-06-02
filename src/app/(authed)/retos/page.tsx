"use client";

//* Styles *//
import "./retos.css";

//* Libraries *//
import { useRetos } from "@/app/hooks/useRetos";
import { useUserRetos } from "@/app/hooks/useUserRetos";

//* Components *//
import RankingPodium from "./assets/RankingPodium";
import Logros from "./assets/Logros";

function getCurrentWeekRange(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
  const format = (date: Date): string =>
    date
      .toLocaleDateString("es-MX", options)
      .replace(
        /(^\d+ de )(\w)/,
        (_, prefix, firstLetter) => prefix + firstLetter.toUpperCase()
      );
  const start = format(monday);
  const end = format(sunday);
  return `${start} - ${end}`;
}

export default function Retos() {
  const { retos, loading: loadingRetos, error: errorRetos } = useRetos();
  const {
    userRetos,
    loading: loadingUserRetos,
    error: errorUserRetos,
  } = useUserRetos();

  const weekRange = getCurrentWeekRange();

  const isLoading = loadingRetos || loadingUserRetos;
  const hasError = errorRetos || errorUserRetos;

  return (
    <div className="main-content">
      <div className="retos-page">
        <div className="retos-container">
          <div className="retos-header">
            <span className="retos-title">Mis Retos |</span>
            <span className="retos-subtitle">Semana:</span>
            <span className="retos-date">{weekRange}</span>
          </div>

          {/* Loader o error */}
          {isLoading ? (
            <p>Cargando retos...</p>
          ) : hasError ? (
            <p>Error al cargar retos.</p>
          ) : (
            <div className="retos-table">
              <div className="retos-row retos-row--header">
                <div className="retos-cell">Estatus</div>
                <div className="retos-cell">Tipo de reto</div>
                <div className="retos-cell">Puntos</div>
                <div className="retos-cell">Descripción</div>
              </div>

              {retos &&
                retos.map((reto) => {
                  const completado = userRetos
                    ? userRetos.some((ur) => ur.id_reto === reto.id_reto)
                    : false;

                  return (
                    <div key={reto.id_reto} className="retos-row">
                      <div className="retos-cell">
                        {completado ? "✅ Completado" : "❌ Incompleto"}
                      </div>
                      <div className="retos-cell">{reto.tipo_reto}</div>
                      <div className="retos-cell">{reto.puntos}</div>
                      <div className="retos-cell">{reto.titulo_reto}</div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <RankingPodium />
        <Logros />
      </div>
    </div>
  );
}
