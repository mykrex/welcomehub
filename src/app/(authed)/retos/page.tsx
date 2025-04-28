"use client";
import "./retos.css";
import Image from "next/image";
import "@/app/components/(layout)/layout.css";

//* Assets
import CheckmarkIcon from "./assets/checkmarkIcon";
import RankingPodium from './assets/RankingPodium';

export default function Retos() {
  return (
    <div className="main-content">
      <div className="retos-page">
        <div className="retos-container">
          {/* ───────── header ───────── */}
          <div className="retos-header">
            <span className="retos-title">Mis Retos |</span>
            <span className="retos-subtitle">Semana:</span>
            <span className="retos-date">Abril 7 - Abril 11</span>
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
                Asignado por:
              </div>
              <div className="retos-cell retos-cell--progress">Progreso</div>
            </div>

            {/* ⚡STREAK row */}
            <div className="retos-row retos-row--even">
              <div className="retos-cell retos-cell--status">
                <CheckmarkIcon completed={true} />
              </div>
              <div className="retos-cell retos-cell--type streak">⚡Streak</div>
              <div className="retos-cell retos-cell--points streak">+ 50</div>
              <div className="retos-cell retos-cell--description desc">
                Cursar 10 minutos en Global Campus diario por 5 días
              </div>
              <div className="retos-cell retos-cell--assigned">
                <Image
                  src="/welcomeHub.png"
                  alt="Logo"
                  width={120}
                  height={35}
                />
              </div>
              <div className="retos-cell retos-cell--progress">
                <div className="dot-group">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="dot" />
                  ))}
                </div>
              </div>
            </div>

            {/* 🥊CHALLENGE row */}
            <div className="retos-row retos-row--even">
              <div className="retos-cell retos-cell--status">
                <CheckmarkIcon completed={false} />
              </div>
              <div className="retos-cell retos-cell--type challenge">
                🥊 Challenge
              </div>
              <div className="retos-cell retos-cell--points challenge">
                + 80
              </div>
              <div className="retos-cell retos-cell--description desc">
                Terminar curso de Atención al Cliente y Ventas
              </div>
              <div className="retos-cell retos-cell--assigned">
                <span className="assigned-name">Maria Quetzalli</span>
              </div>
              <div className="retos-cell retos-cell--progress">
                <span className="progress-text">63% completado</span>
              </div>
            </div>

            {/* 🎯 TARGET row */}
            <div className="retos-row retos-row--odd">
              <div className="retos-cell retos-cell--status">
                <CheckmarkIcon completed={false} />
              </div>
              <div className="retos-cell retos-cell--type target">
                🎯 Target
              </div>
              <div className="retos-cell retos-cell--points target">
                + 100
              </div>
              <div className="retos-cell retos-cell--description desc">
                Acabar un modulo con calificacion de 100%
              </div>
              <div className="retos-cell retos-cell--assigned">
                <span className="assigned-name">Maria Quetzalli</span>
              </div>
              <div className="retos-cell retos-cell--progress">
                <span className="progress-text">Incompleto</span>
              </div>
            </div>
          </div>
        </div>

        {/* ───────── ranking ───────── */}
        <RankingPodium />
      </div>
    </div>
  );
}
