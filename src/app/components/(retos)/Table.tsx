"use client";

import { useEffect } from "react";
import { useRetos } from "@/app/hooks/useRetos";
import { useUserRetos } from "@/app/hooks/useUserRetos";
import { useUserRetosCount } from "@/app/hooks/useUserRetosCount";
import CheckmarkIcon from "../(icons)/Checkmark";

export default function RetosTable() {
  const { retos, loading: loadingRetos, error: errorRetos } = useRetos();
  const {
    userRetos,
    loading: loadingUserRetos,
    error: errorUserRetos,
  } = useUserRetos();
  const {
    counts,
    loading: loadingCounts,
    error: errorCounts,
  } = useUserRetosCount();

  useEffect(() => {
    fetch("/api/retos/verificarCambioFoto", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => console.log("Verificación cambio foto:", data))
      .catch((err) => console.error("Error verificando cambio foto:", err));
  }, []);

  useEffect(() => {
    const verificarChatCompi = async () => {
      try {
        const res = await fetch("/api/retos/verificarChatCompi", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        console.log("Verificación chat compi:", data);
      } catch (err) {
        console.error("Error verificando chat compi:", err);
      }
    };

    verificarChatCompi();
  }, []);

  const isLoading = loadingRetos || loadingUserRetos || loadingCounts;
  const hasError = errorRetos || errorUserRetos || errorCounts;

  const retosUnicos = retos?.filter((r) => !r.es_continuo) ?? [];
  const retosContinuos = retos?.filter((r) => r.es_continuo) ?? [];

  const retosUnicosOrdenados = retosUnicos.slice().sort((a, b) => {
    const completadoA =
      userRetos?.some((ur) => ur.id_reto === a.id_reto) ?? false;
    const completadoB =
      userRetos?.some((ur) => ur.id_reto === b.id_reto) ?? false;
    if (completadoA !== completadoB) return completadoB ? 1 : -1;
    return a.titulo_reto.localeCompare(b.titulo_reto);
  });

  const retosContinuosOrdenados = retosContinuos.slice().sort((a, b) => {
    const completadoA =
      userRetos?.some((ur) => ur.id_reto === a.id_reto) ?? false;
    const completadoB =
      userRetos?.some((ur) => ur.id_reto === b.id_reto) ?? false;
    if (completadoA !== completadoB) return completadoB ? 1 : -1;
    return a.titulo_reto.localeCompare(b.titulo_reto);
  });

  if (isLoading) return <p>Cargando retos...</p>;
  if (hasError) return <p>Error al cargar retos.</p>;

  return (
    <>
      {/* Retos Únicos */}
      <div className="retos-title">Retos Únicos</div>
      <div className="retos-table">
        <div className="retos-row retos-row--header">
          <div className="retos-cell retos-cell--status">Estatus</div>
          <div className="retos-cell retos-cell--type">Tipo de reto</div>
          <div className="retos-cell retos-cell--points">Puntos</div>
          <div className="retos-cell retos-cell--description">Descripción</div>
        </div>
        {retosUnicosOrdenados.map((reto, index) => {
          const completado = userRetos?.some(
            (ur) => ur.id_reto === reto.id_reto
          );
          const rowClass =
            index % 2 === 0
              ? "retos-row retos-row--even"
              : "retos-row retos-row--odd";
          return (
            <div key={reto.id_reto} className={rowClass}>
              <div
                className="retos-cell retos-cell--cont"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <CheckmarkIcon completed={completado} />
                {completado ? "Completado" : "Incompleto"}
              </div>
              <div className="retos-cell retos-cell--type">
                {reto.tipo_reto}
              </div>
              <div className="retos-cell retos-cell--points">{reto.puntos}</div>
              <div className="retos-cell retos-cell--description">
                {reto.titulo_reto}
              </div>
            </div>
          );
        })}
      </div>

      {/* Retos Continuos */}
      <div className="retos-title">Retos Continuos</div>
      <div className="retos-table">
        <div className="retos-row retos-row--header">
          <div className="retos-cell retos-cell--status">Estatus</div>
          <div className="retos-cell retos-cell--type">Tipo de reto</div>
          <div className="retos-cell retos-cell--points">Puntos</div>
          <div className="retos-cell retos-cell--description">Descripción</div>
        </div>
        {retosContinuosOrdenados.map((reto, index) => {
          const vecesCompletado =
            counts?.find((c) => c.id_reto === reto.id_reto)?.veces_completado ??
            0;
          const completado = vecesCompletado > 0;
          const rowClass =
            index % 2 === 0
              ? "retos-row retos-row--even"
              : "retos-row retos-row--odd";
          return (
            <div key={reto.id_reto} className={rowClass}>
              <div
                className="retos-cell retos-cell--cont"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <CheckmarkIcon completed={completado} />
                {vecesCompletado} {vecesCompletado === 1 ? "vez" : "veces"} (
                {vecesCompletado * reto.puntos} pts)
              </div>
              <div className="retos-cell retos-cell--type">
                {reto.tipo_reto}
              </div>
              <div className="retos-cell retos-cell--points">{reto.puntos}</div>
              <div className="retos-cell retos-cell--description">
                {reto.titulo_reto}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
