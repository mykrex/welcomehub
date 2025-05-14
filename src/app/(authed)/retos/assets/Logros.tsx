"use client";
import React, { useMemo } from "react";
import "./logros.css";

/** Assets */
import Badge from "./icons/Badge";

/** Mock Data */
import { mockBadges } from "@/app/api/retos/mock/badges";
import { mockBadgeUsuarios } from "@/app/api/retos/mock/badgeUsuarios";

export default function Logros() {
  // Assume current user is id 1
  const userLogros = useMemo(() => {
    return mockBadgeUsuarios
      .filter((entry) => entry.id_usuario === 1)
      .map((entry) => {
        const badge = mockBadges.find((b) => b.id_badge === entry.id_badge);
        return {
          ...badge,
          fecha: new Date(entry.fecha_obtenido)
            .toLocaleDateString("es-MX", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
            .replace(
              /^(\d+) de ([a-záéíóúñ]+) de (\d{4})$/,
              (_, d, m, y) =>
                `${d} de ${m.charAt(0).toUpperCase() + m.slice(1)} de ${y}`
            ),
        };
      });
  }, []);

  return (
    <div className="logros-container">
      <div className="logros-header-wrapper">
        <div className="logros-title">Logros</div>
      </div>
      <div className="logros-cards-wrapper">
        {userLogros.map((logro) => (
          <div className="logro-card" key={logro.id_badge}>
            <div className="logro-icon-wrapper">
            <Badge variant={["gold", "red"].includes(logro.icono ?? "") ? logro.icono as "gold" | "red" : undefined} />
            </div>
            <div className="logro-text">
              <div className="logro-name">{logro.nombre}</div>
              <div className="logro-desc">{logro.descripcion}</div>
            </div>
            <div className="logro-date-wrapper">
              <div className="logro-date-label">Ganado:</div>
              <div className="logro-date-value">{logro.fecha}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
